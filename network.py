import json
import math
import random
import shutil
import time

from pathlib import Path

################################################

import utils
from utils import printflush as pf
from utils import INFINITE
import chess

################################################
# TensorFlow init

pf("neural initialization")

import tensorflow as tf

tf.reset_default_graph()

pf("\n------------\nneural started\n------------\n")

################################################

board = chess.Board()

################################################

config = {}

################################################

STORE_ENGINE_WEIGHTS_DIR = "./enginemodel"
STORE_ENGINE_WEIGHTS_PATH = STORE_ENGINE_WEIGHTS_DIR + "/enginemodel.ckpt"

CONFIG_PATH = "neuralconfig.json"

MAX_TRAIN_SIZE = 100

MAX_LATEST_TRAINS = 50

OUTPUT_FACTOR = 900

REDUCE_ONE = 0.8

learning_rate = 0.01

num_input = chess.INPUT_SIZE

SCALE_FACTOR = 1

num_hidden_1 = int( chess.INPUT_SIZE * SCALE_FACTOR )
num_hidden_2 = int( chess.INPUT_SIZE * SCALE_FACTOR )

num_output = 1

################################################

X = tf.placeholder("float", [1, num_input])

Y = tf.placeholder("float", [1, num_output])

model = {
    'w1': tf.Variable(tf.random_normal([num_input, num_hidden_1]),name="w1"),
    'w2': tf.Variable(tf.random_normal([num_hidden_1, num_hidden_2]),name="w2"),    
    'wout': tf.Variable(tf.random_normal([num_hidden_2, num_output]),name="wout"),
    'b1': tf.Variable(tf.random_normal([num_hidden_1]),name="b1"),
    'b2': tf.Variable(tf.random_normal([num_hidden_2]),name="b2"),    
    'bout': tf.Variable(tf.random_normal([num_output]),name="bout")
}

layer_1 = tf.nn.sigmoid(tf.add(tf.matmul(X, model['w1']), model['b1']))

layer_2 = tf.nn.sigmoid(tf.add(tf.matmul(layer_1, model['w2']), model['b2']))

engine = tf.nn.sigmoid(tf.add(tf.matmul(layer_2, model['wout']), model['bout']))

################################################

squared_deltas = tf.square( engine - Y )

loss = tf.sqrt(tf.reduce_sum(squared_deltas))

optimizer = tf.train.GradientDescentOptimizer(learning_rate)

trainjob = optimizer.minimize(loss)

################################################

init = tf.global_variables_initializer()

sess = tf.Session()

saver = tf.train.Saver()

################################################

def load_config():
	global config
	global learning_rate
	try:
		config=json.load(open(CONFIG_PATH))
		learning_rate=config.get("learningrate",learning_rate)
		pf(json.dumps(config,indent=1))
	except Exception:
		pf("no config detected")

def save_config():
	global config
	with open(CONFIG_PATH, 'w') as outfile:
		json.dump(config, outfile)
		pf(json.dumps(config,indent=1))

def model_has_nan():
	return sess.run(tf.is_nan(sess.run(model["w1"]).tolist()[0][0]))

def calc_pos_value(fen):
	board.setFromFen(fen)
	value=sess.run(engine, {X:board.inputsrow, Y:[[0.0]]})[0][0]*OUTPUT_FACTOR/REDUCE_ONE	
	return value

def test():
	pf("test")
	for key in model:
		size=sess.run(tf.size(model[key]))
		sumsq=sess.run(tf.reduce_sum(tf.square(model[key])))
		pf("model {0:6s} : exp {1:10d} , act {2:10.2f} , rat {3:2.4f}".format(key,size,sumsq,sumsq/size))	
	pf("pos value {0:f}".format(calc_pos_value(board.fen)))

def rand():
	pf("rand")
	sess.run(init)
	test()

def reset_model():
	pf("resetting model")
	try:
		shutil.rmtree(STORE_ENGINE_WEIGHTS_DIR)
		pf("tree removed ok")
	except Exception:
		pf("tree was not found")
	rand()

def save_model():
	if model_has_nan():
		pf("model have nan, refused to save")
		load_model()
	else:
		pf(saver.save(sess, STORE_ENGINE_WEIGHTS_PATH))
		pf("engine model saved ok")

def load_model():
	if Path(STORE_ENGINE_WEIGHTS_DIR).is_dir():
		try:
			saver.restore(sess, STORE_ENGINE_WEIGHTS_PATH)
			pf("engine model loaded ok")
		except Exception:
			reset_model()
	else:
		pf("no stored engine model")
		rand()

def avg_loss(totalloss,n):
	return totalloss/n

train_set_size = 0

def true_score(score):
	return utils.limit(score,OUTPUT_FACTOR)/OUTPUT_FACTOR*REDUCE_ONE

def train(verbose=True,doall=False):
	data=json.load(open("evals.json"))		
	global train_set_size
	train_set_size=len(data)	
	fens=list(data.keys())
	if not doall:
		random.shuffle(fens)
	totalloss=0
	al=0
	for fen,i in zip(fens,range(len(data))):
		if i < min(MAX_TRAIN_SIZE,len(data)) or doall:			

			attrs=data[fen]

			board.setFromFen(fen)				

			score=true_score(attrs["score"])			

			sess.run(trainjob, {X:board.inputsrow, Y:[[score]]})	

			actualloss=sess.run(loss, {X:board.inputsrow, Y:[[score]]})

			totalloss+=actualloss				

			n=i+1

			al=avg_loss(totalloss,n)

			if verbose:
				if doall and (i%100)!=0:
					pass
				else:
					pf("{0:5d}. avg loss: {1:20f}".format(n,al))

	return al

latest_trains=[None]*MAX_LATEST_TRAINS

def calc_latest_trains_moving_average():
	global latest_trains
	sum=0
	for i in range(MAX_LATEST_TRAINS):
		t=latest_trains[-1-i]
		if t==None:			
			if i==0:
				return 0
			else:
				return sum/i
		sum+=t
	return sum/MAX_LATEST_TRAINS

def epoch(n):
	global latest_trains
	for i in range(n):
		t=train(False)
		latest_trains=latest_trains[1:]
		latest_trains.append(t)		
		pf("{0:4d} : {1:10.6f} [ {2:10.6f} ]".format(i,t,calc_latest_trains_moving_average()))
		if model_has_nan():
			break
		if ((i+1)%10) == 0:
			save_model()
	pf("training set size {0:d}".format(train_set_size))
	save_model()

smart=1

def set_smart(s):
	global smart
	smart=s
	pf("smart set to {0:d}".format(smart))

def play_move(data):
	global smart
	selsan=""
	bestvalue=INFINITE
	if smart==1:
		for item in data:
			fen=item["fen"]		
			actualvalue=calc_pos_value(fen)									
			if actualvalue < bestvalue:
				selsan=item["san"]				
				bestvalue=actualvalue		
		pf("wise move {0:8s} value {1:20.10f} mat {2:d}".format(selsan,bestvalue,board.mat_balance()))
		time.sleep(0.3)
	else:
		item=random.choice(data)
		selsan=item["san"]
		pf("random move "+selsan)
		time.sleep(0.5)
	movejsonstr=json.dumps({ "action" : "makesan" , "san" : selsan })
	pf(movejsonstr)

def set_learning_rate(lr):
	learning_rate=lr	
	config["learningrate"]=learning_rate
	pf("learning rate set to {0:f}".format(learning_rate))
	save_config()

################################################

load_model()

load_config()

################################################