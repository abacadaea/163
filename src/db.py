import MySQLdb

mysqlHost = "localhost"
mysqlUser = "ec2-user"
mysqlPassword = "password"
mysqlDB = "163"

connection = MySQLdb.connect(
	host = mysqlHost,
	user = mysqlUser,
	passwd = mysqlPassword,
	db = mysqlDB,
	charset = 'utf8',
	use_unicode = True)

connection.autocommit(True)

cursor = self.connection.cursor(MySQLdb.cursors.DictCursor)
