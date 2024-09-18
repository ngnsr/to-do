# Dockerfile for frontend

# Use an official Node.js image as a parent image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy the project files
COPY package.json package-lock.json ./
COPY index.html ./
COPY src ./src
COPY public ./public
COPY vite.config.js ./

# Install dependencies
RUN npm install

# Build the project (optional if you want to build for production)
# RUN npm run build

# Expose the port the app will run on
EXPOSE 5173

# Run the application
CMD ["npm", "run", "pdev"]

