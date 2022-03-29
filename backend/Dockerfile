FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json .

# Install dependencies
RUN npm install

# copy source code to /app/src folder
COPY . ./

# check files list
RUN ls -a

# Build TypeScript project
RUN npm run build

ENV PORT=3000
EXPOSE 3000
CMD [ "npm", "start" ]