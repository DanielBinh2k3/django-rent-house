# Base image
FROM node:alpine

# Set working directory
WORKDIR /frontend

# Copy package.json and package-lock.json to container
COPY package*.json ./

RUN npm install -g npm@

RUN npm install --force

# Copy the rest of the app code to container
COPY . .

RUN npm run build

# Start the app server
CMD ["npm", "start"]
