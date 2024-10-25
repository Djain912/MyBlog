# Use the official Node.js image from Docker Hub
FROM node:21.5.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app directory to the container
COPY . .

# Expose the port your app runs on (e.g., 3000)
EXPOSE 6969

# Command to run the app
CMD ["node", "index.js"]
