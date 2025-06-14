# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port (optional, Render assigns dynamically)
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
