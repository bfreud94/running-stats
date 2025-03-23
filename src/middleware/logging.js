const logger = (req, res, next) => {
	const { method, url } = req
	const start = Date.now()
	const timestamp = new Date().toISOString()
	res.on('finish', () => {
		const duration = Date.now() - start
		console.log(`[${timestamp}] ${method} ${url} ${res.statusCode} - ${duration}ms`)
	})
	next()
}

export default logger