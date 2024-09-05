# Use Node 20 as the base image
FROM node:20

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set environment variables (if any)
# ENV NODE_ENV production

# Generate Prisma Client
CMD ["sh", "-c", "npx prisma generate && node server.js"]

# Expose the port your app runs on
EXPOSE 3000
