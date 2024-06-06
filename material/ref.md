# Break Timing

Tea Break : 12:00 (15 minutes)
Lunch : 01:30PM (45 minutes)
Tea Break : 04:00 (15 minutes)

# Node JS Installer

- Node Package Manager (NPM)
- Node Runtime / REPL
- Node Native Modules (eg. http, events, os, fs etc)

- In REST API, Server decides the data to be sent to client

# /api/books > id, isbn, title, authorName, numOfPages etc

# /api/authors > id authorName, booksPublished, age

id, isbn, title, numOfPages

- Over-fetching : fetching more data than needed in app
- under-fetching : fetching less data than needed in app

query {
bookId
isbn
title
numOfPages
authorName
authorAge
authorPublishedBooks
}

# GraphQL Server

- npm init -y : creates package.json file
- npm install graphql-yoga graphql
- npm install nodemon -D
- npm run dev:start
- npm install uuid
- npm install graphql-import-files
