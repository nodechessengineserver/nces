import random
import json

################################################

import utils

################################################

BOARD_SIZE=8

PIECE_CHAR_TO_CODE={"-":0,"p":1,"n":2,"b":3,"r":4,"q":5,"k":6,"P":7,"N":8,"B":9,"R":10,"Q":11,"K":12}

NUM_PIECES=6
PIECE_VALUES={"p":100,"n":300,"b":300,"r":500,"q":900,"k":400}

NUM_PIECE_CODES=len(PIECE_CHAR_TO_CODE)

INPUT_SIZE=(NUM_PIECE_CODES-1)*BOARD_SIZE*BOARD_SIZE

BIT_ONE_MAG=1

################################################

class Piece():
	fen=""
	code=0
	def __init__(self,fen):
		self.fen=fen		
		self.code=PIECE_CHAR_TO_CODE[fen]
		self.kind=fen.lower()
		self.color=0
		if self.kind!=self.fen:
			self.color=1

class Board():
	fen=""
	def __init__(self):				
		self.rep=[[None]*BOARD_SIZE for i in range(BOARD_SIZE)]		
		self.bitboards=[[[None]*BOARD_SIZE for i in range(BOARD_SIZE)] for code in range(NUM_PIECE_CODES)]		
		self.setFromFen("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 1 0")
	# inputs for the neural network
	inputs=[None]*INPUT_SIZE
	inputscol=[]
	inputsrow=[]
	materials=[]
	def materials_init(self):
		self.materials=[0]*2
	def setinputs(self):
		ptr=0
		for code in range(1,NUM_PIECE_CODES):
			for i in range(BOARD_SIZE):
				for j in range(BOARD_SIZE):
					self.inputs[ptr]=self.bitboards[code][i][j]
					ptr+=1
		self.inputscol=utils.make_column_vector(self.inputs)			
		self.inputsrow=[self.inputs]
	def setFromFen(self,fen):		
		parts=fen.split(" ")
		cnt=0
		rank=0
		file=0
		self.materials_init()
		for c in parts[0]:
			if c>="0" and c<="9":
				cnt=int(c)
			else:
				for i in range(0,cnt):
						self.rep[rank][file]=Piece("-")
						file+=1
				cnt=0
				if c=="/":					
					file=0
					rank+=1
				else:					
					p=Piece(c)
					self.rep[rank][file]=p
					self.materials[p.color]+=PIECE_VALUES[p.kind]
					file+=1					
		for code in range(NUM_PIECE_CODES):
			for i in range(BOARD_SIZE):
				for j in range(BOARD_SIZE):
					if self.rep[i][j].code==code:
						self.bitboards[code][i][j] = ( BIT_ONE_MAG )
					else:
						self.bitboards[code][i][j] = ( -BIT_ONE_MAG )
		self.setinputs()
		self.fen=fen
		
	def mat_balance(self):
		return self.materials[1]-self.materials[0]