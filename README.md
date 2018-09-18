# Just Jotit (W.I.P.)

An *interactive tutorial* on how to build a Fullstack application using the Mongo + Express + Node + jQuery stack. The final result is a note keeping app with cloud sync. You can find a live version of it [here](https://just-jotit.heroku.com).

## How to Use

The way this tutorial works is by dividing the app building progress into 10 stages. Each stage will be treated as **separate branch** in this repository, allowing you to download the repoitory and check-out the respective branch to run it locally. Also, stages will appear as separate commits on this repository's **master** branch, allowing you to use Github's [integrated commit-compare tool](https://help.github.com/articles/comparing-commits-across-time/) to easilly see the changes done between each stage.

## Stages

* [01-bootstrap](https://github.com/sgarcia-dev/just-jotit/tree/01-bootstrap): Initialize Express.js server, add unit testing boilerplate, and setup CI with Travis+Heroku.
* [02-mock-frontend](https://github.com/sgarcia-dev/just-jotit/tree/02-mock-frontend): Create semi-functional frontend for our app using mock data.
* [03-mongo-crud](https://github.com/sgarcia-dev/just-jotit/tree/03-mongo-crud): Add the Note and User CRUD API endpoints and persist changes using MongoDB.
* [04-authentication](https://github.com/sgarcia-dev/just-jotit/tree/04-authentication): Protect read/update/delete endpoints with authentication using passport.
* [05-unit-testing](https://github.com/sgarcia-dev/just-jotit/tree/05-unit-testing): Add unit testing to all endpoints using Mocha and Chai.
* [06-wire-up](https://github.com/sgarcia-dev/just-jotit/tree/06-wire-up): Wire up all API endpoints to our frontend so it's 100% functional.
* [07-final-touches](https://github.com/sgarcia-dev/just-jotit/tree/07-final-touches): Implement final touches such as modularization and refactoring to keep code D.R.Y. (Don't repeat yourself)

## Pre-requisites

* Good ES6 JavaScript knowledge, specially about [Destructuring](https://wesbos.com/destructuring-objects/), [Arrow Functions](https://wesbos.com/arrow-functions/), as well as [Let/Const](https://wesbos.com/let-vs-const/).
* MongoDB must be [installed](https://docs.mongodb.com/manual/installation/#tutorials) and running locally. If you installed it correctly, you can start it running `mongod` in any terminal.

## How to download and run

1. Clone the project via `git clone https://github.com/sgarcia-dev/just-jotit.git`
2. Checkout the respective branch via `git checkout <branch_name>`. Example: `git checkout 03-mongo-crud` (*optional*)
3. Run `npm install` to make sure all dependencies inside `package.json` are installed.
4. Run any of the available NPM scripts inside package.json via `npm run <script_name>`. Example: `npm run start`.
