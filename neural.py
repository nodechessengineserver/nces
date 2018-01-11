import sys
import json

################################################

import network

import utils
from utils import printflush as pf

################################################

MAX_ARGS = 10

################################################

ints = [None] * MAX_ARGS
floats = [None] * MAX_ARGS

def get_int(i,default):
	global ints
	if ints[i]==None:
		return default
	return ints[i]

def get_float(i,default):
	global floats
	if floats[i]==None:
		return default
	return floats[i]

################################################
# main loop

for linen in sys.stdin:	
	line=linen.rstrip()	
	parts=line.split(" ")
	command=parts[0]	
	if len(parts)>1:
		parts=parts[1:]
	else:
		parts=[]
	try:
		for i in range(MAX_ARGS):
			ints[i]=int(parts[i])
	except Exception:
		pass		
	try:
		for i in range(MAX_ARGS):
			floats[i]=float(parts[i])
	except Exception:
		pass		
	if(command=="x"):
		sys.exit("neural terminated ok")
	elif(command=="rand"):
		network.rand()
	elif(command=="train"):
		network.epoch(get_int(0,5))
	elif(command=="savemodel"):
		network.save_model()
	elif(command=="resetmodel"):
		network.reset_model()
	elif(command=="dull"):
		network.set_smart(0)
	elif(command=="smart"):
		network.set_smart(1)
	elif(command=="trainall"):
		for i in range(get_int(0,1)):			
			network.train(True,True)
	elif(command=="lr"):
		network.set_learning_rate(get_float(0,network.learning_rate))
	else:
		try:
			c=json.loads(line)				
			action=c["action"]
			if action=="playmove":
				fens=c["fens"]
				network.play_move(fens)
			elif action=="epoch":
				network.epoch(c["n"])
			elif action=="test":			
				network.test()
			else:
				pf("unknown command")
		except Exception:
			pf("command error")

################################################
