# 1. Use Node 20 to satisfy Mongoose requirements
FROM node:20-alpine

# 2. Set the working directory
WORKDIR /app

# 3. Copy package files FROM the backend folder
COPY backend/package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the backend files
COPY backend/ .

# 6. EXPOSE 5000 to match your .env and code
EXPOSE 5000

# 7. Start the server
CMD ["npm", "start"]