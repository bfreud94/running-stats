export const INSERT_QUERY = `INSERT INTO runs (id, average_cadence, average_heartrate, average_speed,` +
	`distance, name, start_date, suffer_score, time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`

export const UPDATE_QUERY = `UPDATE runs SET name = ? WHERE id = ?`

export const SELECT_QUERY = 'SELECT * FROM runs'