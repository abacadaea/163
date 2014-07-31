import solver, random, json

# determines if number is positive integer
def is_positive_integer(x):
	return (
		(isinstance(x, (int,long)) or float.is_integer(x))
		and int(x) > 0)

# Basic puzzle class
class Puzzle:
	def __init__(self, target, S, solution = None):
		self.target = target
		self.S = S
		self.solution = solution
		if not solution:
			self.solution = solver.Solver.solve(self.S)

	def json(self):
		return json.dumps(self.__dict__)

	@staticmethod
	def generatePuzzle(size):
		# get the puzzle
		S = []
		for i in range(size):
			S.append(random.randint(1,10))

		# solve the puzzle
		res = solver.Solver().solve(S)
		# randomly select an achievable integer
		target = random.choice(
			[int(x) for x in res.keys() if is_positive_integer(x)])
	
		# return
		return Puzzle(target, S, res[target])

class ContinuousPuzzle:
	def __init__(self, S):
		self.S = S
		self.targets = []
		self.res = {}
	
		self.generateTargets()

	def generateTargets(self):
		self.res = solver.Solver().solve(self.S)
		self.targets = [int(x) for x in self.res.keys() if is_positive_integer(x)]
		random.shuffle(self.targets)
	
	def getPuzzles(self):
		return [Puzzle(t, self.S, self.res[t]) for t in self.targets]

	@staticmethod
	def generatePuzzle(size):
		S = []
		for i in range(size):
			S.append(random.randint(1,10))

		return ContinuousPuzzle(S)

	def json(self):
		return json.dumps([p.__dict__ for p in self.getPuzzles()])

# Puzlzes Rated by bipartite ELO
class RatedPuzzle(Puzzle):
	def __init__(self, target = None, S = []):
		self.target = target
		self.S = S
		self.solution = solver.Solver().solve(self.S)

		self.puzzleID = 0
		self.rating = 1200
	
	def updateRating(self, user_rating, score):
		pass

	def insert(self):
		# insert into mysql database
		pass

	def setByID(self, id):
		pass
	
	@staticmethod
	def getByID(id):
		return RatedPuzzle().setByID(id)
