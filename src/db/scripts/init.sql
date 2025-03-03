CREATE DATABASE IF NOT EXISTS strava;
USE strava;

CREATE TABLE IF NOT EXISTS runs(
	id VARCHAR(25),
	average_cadence INT,
	average_heartrate DECIMAL(9, 1),
	average_speed DECIMAL(9, 2),
	distance DECIMAL(9, 2),
	name VARCHAR(100),
	start_date DATETIME,
	suffer_score INT,
	time INT
);