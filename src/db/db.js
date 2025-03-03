import mysql from 'mysql2/promise'

import 'dotenv/config'

export const connect = async () => {
	try {
		const connection = await mysql.createConnection({
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE
		})
		return connection
	} catch (error) {
		console.error('Error connecting to database:', error)
		throw error
	}
}

export const disconnect = async (connection) => {
	try {
		await connection.end()
		console.log('Disconnected from database')
	} catch (error) {
		console.error('Error disconnecting from database:', error)
		throw error
	}
}