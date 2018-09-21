// https://www.npmjs.com/package/chai
const chai = require('chai');
// http://www.chaijs.com/plugins/chai-http/
const chaiHttp = require('chai-http');

const { HTTP_STATUS_CODES } = require('../app/config');
const { startServer, stopServer, app } = require('../app/server.js');

const expect = chai.expect; // So we can do "expect" instead of always typing "chai.expect"
chai.use(chaiHttp); // implements chai http plugin

describe('Integration tests for: /', function () {
    // Mocha Hook: Runs before ALL the "it" test blocks.
    before(function () {
        // Be sure to always return a promise to Mocha when doing asynchronous work,
        // Otherwise Mocha will just asume your work is done even if it isn't.

        // Starts our Express Server, so we can test it.
        return startServer(true);
    });
    // Mocha Hook: Runs after ALL the "it" test blocks.
    after(function () {
        // Be sure to always return a promise to Mocha when doing asynchronous work,
        // Otherwise Mocha will just asume your work is done even if it isn't.

        // Shuts down our Express Server, since we don't need it anymore.
        return stopServer();
    });

    it('Should return index.html', function () {
        chai.request(app)
            .get('/')
            .then(res => {
                // chai-http assertions docs: http://www.chaijs.com/plugins/chai-http/#assertions 
                expect(res).to.have.status(HTTP_STATUS_CODES.OK);
                expect(res).to.be.html;
                // Chai.string assertion docs: http://www.chaijs.com/api/bdd/#stringstr-msg
                expect(res.text).to.have.string('<!DOCTYPE html>');
            });
    });
});