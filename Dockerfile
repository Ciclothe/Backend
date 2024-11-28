FROM node

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

EXPOSE 3000

# development
# npm run start

# watch mode
# npm run start:dev

# production mode
# npm run start:prod3

CMD [ "npm", "run", "start"]