# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Development command (with hot reload)
CMD ["npm", "run", "dev"]

# For production, use:
# RUN npm run build
# CMD ["npm", "start"]