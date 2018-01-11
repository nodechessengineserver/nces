import sys

################################################

INFINITE = 1e20

################################################

def limit(x,limit):
	if x < -limit:
		return -limit
	if x > limit:
		return limit
	return x

def printflush(x):
	print(x)
	sys.stdout.flush()

def make_column_vector(row):
	result=[]
	for element in row:
		result.append([element])
	return result