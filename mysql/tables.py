tables = {}

tables["User"] = """
	userID INT (11) AUTO_INCREMENT UNIQUE,
	username VARCHAR(40),
	password VARCHAR(40),

	rating INT(11) DEFAULT 1200,

	PRIMARY KEY(userID)
"""

tables["Puzzle"] = """
	puzzleID INT (11) AUTO_INCREMENT UNIQUE,
	inputs VARCHAR(100),
	target INT(11),
	solution VARCHAR(100),

	rating INT(11) DEFAULT 1200,
	upvotes INT(11) DEFAULT 0,
	downvotes INT(11) DEFAULT 0,

	PRIMARY KEY(puzzleID)
"""
