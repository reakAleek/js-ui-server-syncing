# Javascript​ ​UI​ ​↔​ ​Server​ ​syncing

## LIVE DEMO
[![Build Status](https://travis-ci.org/reakAleek/js-ui-server-syncing.svg?branch=master)](https://travis-ci.org/reakAleek/js-ui-server-syncing)

[https://reakaleek.github.io/js-ui-server-syncing/](https://reakaleek.github.io/js-ui-server-syncing/)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Syncing Logic
The syncing logic can be found in the the file [src/+store/util/actionProcrastinator.js](src/+store/util/actionProcrastinator.js) 
including description as comment.
The usage of the ActionProcrastinor can be found either in [src/+store/middlewares/apiMiddleware.js](src/+store/middlewares/apiMiddleware.js)
or in [src/test.js](src/test.js).

## Example test case
The ​example​ ​test​ ​case​ ​in​ ​JS​ ​that​ ​reproduces​ ​the​ explained ​issue​ ​can be found in [src/test.js](src/test.js)

## Available Scripts
In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
