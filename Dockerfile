FROM node:20-alpine

WORKDIR /app

# install deps
COPY package*.json ./
RUN npm install --omit=dev

# copy app
COPY . .

# Back4App expects this port in settings (8080)
EXPOSE 8080

# start
CMD ["npm", "start"]
