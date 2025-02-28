# Use the official Node.js image from the Docker Hub
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Copy the .env file
COPY .env .env

# Start the application
CMD ["npm", "start"]