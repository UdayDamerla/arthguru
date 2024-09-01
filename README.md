# Expense Tracker



Expense Tracker is a simple RESTful web application built with Node.js, Express, and mongoDB for users to track daily expenses.

This project is Live on: https://sleepy-cliffs-84117.herokuapp.com/


## Features

- Sign up for an account by providing name, email, and password
- Log in with email
- Log out of an account

After login, users can:

- View all expenses/revenues
- View total amount of expenses/revenues/balance
- View expenses break down by category and month in chart visualizations
- View monthly spent and remaining budget in pie chart
- Filter expenses by category and month
- Filter revenues by month
- Add an expense and a revenue
- Edit their expense, revenue, budget, avatar, and name
- Delete an expense and a revenue


## Prerequisites

- [Git](https://git-scm.com/downloads)
- [Node.js v14.15.1](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [mongoDB](https://www.mongodb.com/)

## Install Expense Tracker

#### Clone the repository locally

```
$ git clone 
```

#### Install project dependencies

```
$ cd arthguru
$ npm install
```

#### Add .env file

```
MONGODB_URI=mongodb://localhost/yourURL
```

## Use Expense Tracker

#### Import seed data

To have default users, categories, and records set up, run the following script.

```
$ npm run seed
```

#### Start the app

If you have installed [nodemon](https://www.npmjs.com/package/nodemon), run the following script.

```
$ npm run dev
```

or just run:

```
$ node app.js
```

The server will start running on http://localhost:3000/
