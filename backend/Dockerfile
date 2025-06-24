# Base image using Node.js on Alpine Linux (lightweight image)
FROM node:alpine3.18

# Set working directory inside the container
WORKDIR /usr/share/app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the app source code
COPY . ./

# Expose backend port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
