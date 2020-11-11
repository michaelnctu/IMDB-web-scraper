# IMDB MOVIE SCRAPER (Backend)

A small API by which you can scrape all the movie data you want and has been deployed on AWS.

Stored the movie data with MongoDB database and made it easily accessible through ROBO 3T locally.

+ Frontend code - https://github.com/michaelnctu/imdb-scraper-client

# How to run this project
1. To build this project locally:
```
git clone https://github.com/michaelnctu/IMDB-web-scraper.git
```
2. After directing into the file
```
npm install
```
3. run the Server
```
nodemon index.js
or
node index.js
```

# Dependencies
+ Node.js: v12.15.0
+ cheerio: "^1.0.0-rc.3",
+ cors: "^2.8.5",
+ express: "^4.17.1",
+ mongoose: "^5.10.13",
+ node-fetch: "^2.6.1",
+ nodemon: "^2.0.6"
