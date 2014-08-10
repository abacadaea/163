#from collections import Counter
import itertools
import fileinput,sys

def hash_list(S):
	return ','.join([str(int(x)) for x in S])

def set_diff(S, A):
	res = list(S)
	for x in A:
		res.remove(x)
	return res
	#s = Counter(S)
	#a = Counter(A)
	#diff = s - a
	#return list(diff.elements())

# Find all numbers one can make using +-*/ with a set S
# returns list of key value pairs, where key is the number achieved, value is
# the string that achieves that value. e.g. 7: "(3+4)", 1.5: "(3/2)"
class Solver:
	# Constructor
	def __init__(self):
		# For each subset, remember list of achievable values for speed
		self.mem = dict()
		
	# Solve a subset recursively
	def solve(self, S):	
		S = [float(x) for x in S]

		# S has size 1
		if len(S) == 1:
			return dict({S[0]:str(int(S[0]))})

		S = sorted(S)

		# check if we already have all the solutions for S
		S_hash = hash_list(S)
		if S_hash in self.mem:
			return self.mem[S_hash]

		res = dict()
		# The sizes of the subsets into which S is split. 
		# range (1,len(S)/2 + 1) is {1,2,...,floor(size of S/2)}
		for i in range(1,len(S)/2 + 1):
			# iterate over ways to split S into size i and len(S) - i subsets
			splits = itertools.combinations(S, i)
			for ids in splits:
				# A is the first subset, B is second subset (B = S \ A)
				A = list(ids)
				B = set_diff(S,A)
				
				# recursively solve each of the subsets
				res_A = self.solve(A)
				res_B = self.solve(B)

				# combine the subsets in every way possible
				for x in res_A:
					for y in res_B:
						if x+y not in res:
							res[x+y] = "(" + res_A[x] + "+" + res_B[y] + ")"
						if x*y not in res:
							res[x*y] = "(" + res_A[x] + "*" + res_B[y] + ")"
						if x-y not in res:
							res[x-y] = "(" + res_A[x] + "-" + res_B[y] + ")"
						if y != 0 and x/y not in res:
							res[x/y] = "(" + res_A[x] + "/" + res_B[y] + ")"
						# other way around
						if y-x not in res:
							res[y-x] = "(" + res_B[y] + "-" + res_A[x] + ")"
						if x != 0 and y/x not in res:
							res[y/x] = "(" + res_B[y] + "/" + res_A[x] + ")"
		# memoize
		self.mem[S_hash] = res
		return res
	
	# Return a string denoting the solution to getting x with set S
	def getSolution(self, x, S):
		res = self.solve(S)
		# iterate over all values found
		for val in res:
			if abs(x - val) < 10**(-9):
				return res[val]
		# no solutions found
		return None

	# debugger to test solver
	# Input: x a_1 a_2 ... a_n (n can be arbitrary)
	# Output: One way to make x with a_1...a_n
	@staticmethod
	def debug():
		solver = Solver()
		while(True):
			line = raw_input("")
			nums = [float(x) for x in line.split(" ")]
			soln = solver.getSolution(nums[0], nums[1:])
			print (soln if soln else "No Solution")
