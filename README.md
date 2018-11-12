# Just Jotit

An sample Fullstack application using the Mongo + Express + Node + jQuery stack. The final result is a note keeping app with cloud sync. You can find a live version of it [here](https://just-jotit.heroku.com).

## Progress Checklist

This app is currently about 90% complete. It has a 100% back end with happy-path unit test coverage for all routes. It has a basic Frontend as well, but it's about 85% complete. Login, Signup, Logout, Homepage, Note details and Note creation are all functional. All that's left to do is Note Editing + Deletion and it will be 100% complete. There is no ETA aprox. for when this will be finished out of personal time constraints.

Comments to explain the application flow are added plentifully everywhere possible, but notable areas where they are lacking at the moment are in some unit tests, and the front-end. I will add these when I have the time.

## Pre-requisites

* Good ES6 JavaScript knowledge, specially about [Destructuring](https://wesbos.com/destructuring-objects/), [Arrow Functions](https://wesbos.com/arrow-functions/), as well as [Let/Const](https://wesbos.com/let-vs-const/).
* MongoDB must be [installed](https://docs.mongodb.com/manual/installation/#tutorials) and running locally. If you installed it correctly, you can start it running `mongod` in any terminal.

## How to download and run

1. Clone the project via `git clone https://github.com/sgarcia-dev/just-jotit.git`
2. Checkout the respective branch via `git checkout <branch_name>`. Example: `git checkout 03-mongo-crud` (*optional*)
3. Run `npm install` to make sure all dependencies inside `package.json` are installed.
4. Run any of the available NPM scripts inside package.json via `npm run <script_name>`. Example: `npm run start`.
