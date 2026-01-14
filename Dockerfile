# Use Node.js LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose port (Back4App uses 8080)
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
