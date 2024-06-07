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

# MongoDB Atlas Credentials

synergy
pOLmw5ijeqwAwMnP

mongodb+srv://synergy:pOLmw5ijeqwAwMnP@mycluster.4djbdxz.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster

mongodb+srv://synergy:pOLmw5ijeqwAwMnP@mycluster.4djbdxz.mongodb.net/optum-db

# Prisma - ORM

- npm init -y
- npm install prisma
- npx prisma init
- npm install @prisma/client
- npx prisma db push
- node src/server.js -> npm start

- npm install graphql-yoga graphql
- npm install nodemon -D

---

# GraphQL Operations

- Query : fetch data
- Mutation : create, update and delete
- Subscription : receive the real time updates

# Data Persistence

- MongoDB
- ORM - Prisma
- Authentication: JWT Token

[{"id":"66619cc71805aa0aea7e98af","name":"monica","age":24,"email":"monica@test","password":"$2b$12$sg9N1OvwNjVaemA51xSbHuWo3VTX/FeekLin6uIt7aBX3vBFeUlcO","role":"DEVELOPER","Post":[{"id":"66619ed0cb1832fee6825201","title":"GraphQL 101","body":"the body","published":false,"authorId":"66619cc71805aa0aea7e98af"}]},

{"id":"66619f21cb1832fee6825202","name":"rachel","age":24,"email":"rachel@test","password":"$2b$12$DFGJO.Lylv1FHtSmvnUcYOdm9icwHhg66/iPoIAmrzXbAJN4t0VjG","role":"ANALYST","Post":[{"id":"66619f47cb1832fee6825203","title":"Mastering React","body":"....","published":false,"authorId":"66619f21cb1832fee6825202"}]},

{"id":"6661a1fe3390abb31b2b5bef","name":"chandler","age":24,"email":"chandler@test","password":"$2b$12$lLr27stX1oYA.6ncXjAkK.2m37DVvn9CclM7GAhraD4u/2EShp2PG","role":"ANALYST","Post":[{"id":"6661a29c4c2450b4dd74e10c","title":"Super-heroic Angular","body":"....","published":false,"authorId":"6661a1fe3390abb31b2b5bef"}]},

{"id":"66628c416f99db204bb62c51","name":"james","age":24,"email":"james@test","password":"$2b$12$jICO0JlxJglDM75ohQK7ROR3KoMqNLp3G8q.tmDpLxsvDIS1QahUq","role":"MANAGER","Post":[]},

{"id":"666290b8aaf059a6f62868c7","name":"ross","age":24,"email":"ross@test","password":"$2b$12$PQOz5ouKdZL4tsZjRLYm2eZ5J/FTRsAyKPC6Wo0gLf8ECZz1MPmvy","role":"MANAGER","Post":[{"id":"666290faaaf059a6f62868c9","title":"Beginning with NodeJS","body":"....","published":false,"authorId":"666290b8aaf059a6f62868c7"}]}]

---

# Frontend with Vanilla JavaSCript

- npm install @apollo/client graphql react
- npm install jest -D
- npm install jest-environment-jsdom -D
- npm install cross-fetch -D
- npm init jest
