# Node.js Bootstrap API

This is a simple Node.JS API written with Typescript, to be used as a bootstrap to new projects. It features:

- Node.JS with Express
- Nodemon local monitoring
- JWT Authentication
- MongoDB connection with prisma
- Simple jest test (not sure if this is allright, I created it from AI)

## Installation

- First, create a `.env`file (just copy from `.env.example`)
- Review the MongoDB connection string
  - You can host your db in http://cloud.mongodb.com and copy their connection string. Remember to insert your db name into the string.\
  As an example: if the connectionstring is:\
  `mongodb+srv://myuser:pwd@cluster0.nf1ohe1.mongodb.net?retryWrites=true&w=majority&appName=Cluster0`\
  ...change it to:\
  `mongodb+srv://myuser:pwd@cluster0.nf1ohe1.mongodb.net/mydatabase?retryWrites=true&w=majority&appName=Cluster0`
- run `npm install`
- run `npm start`

## TODO
- JWT Authentication
- Automatically create the collection/table if no record is found with the initial admin user
- Implement validation for required fields