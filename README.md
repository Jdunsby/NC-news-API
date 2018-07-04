# NC-News-API
[Northcoders News](https://jd-nc-news.herokuapp.com/api) is a simple, easy to navigate, RESTful API built for serving article themed data. The data is split into 4 categories: `Topics`, `Articles`, `Comments`, `Users`.

## Getting Started
### Prerequisites
Setting up a development and testing environment for this project first requires a code editor and MongoDB. You may have these already, but if not, you can find installation instructions [here](https://code.visualstudio.com/docs) for `VSCode` and [here](https://docs.mongodb.com/manual/installation/) for `MongoDB`.

### Installation
Open up your terminal and navigate to the directory where you wish to save the application.
Once you are in the desired directory you can clone this repository using the following command:
```
git clone https://github.com/Jdunsby/NC-news-API.git
```

Navigate into the cloned directory:
```
cd NC-news-API
```

At the project's root directory install dependencies with the following command:
```
npm i
```
This will install all dependencies listed in package.json.

The project also requires a specific config file in order to connect to and seed the database as well as insert API links into some of the responses.
Type the following command to generate a config file:
```
npm run create-config
```
This will create a `config.js` file that includes everything the project needs to run in 'dev' or 'test' environments.

The final step to getting our project up and running locally is giving our API some way to interact with our database. for this we use the [mongod](https://docs.mongodb.com/manual/reference/program/mongod/) command which comes with mongodb and deals with requests to the database.
Type the following to start mongod
```
mongod
```

## Running tests
This API has been thoroughly tested before deployment. To run the included tests use the command:
```
npm test
```
**NOTE:** Make sure you have `mongod` running before running the tests (see above)

## Deployment
This project uses [Mlab](https://mlab.com/) to host the database and [Heroku](https://www.heroku.com/) for hosting the app itself.

If you wish to host your own version of this project you will need to add your database URL to the config file. A useful comment has been placed in the generated config file to show you where to put this.
Once you have done this you can run the following command to seed your production database:
```
npm run seed:prod
```

## Built With
This Application was built using the following versions:
- Node.js - (v9.11.1)
- Mongo - (v3.4.6)
- Javascript - (ES6)

## Author
[Jonathan Dunsby](https://github.com/Jdunsby)