FROM node:12.18.1
WORKDIR /parse-server
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
CMD ["npm", "start"]