// https://www.npmjs.com/package/chai
const chai = require('chai');
// http://www.chaijs.com/plugins/chai-http/
const chaiHttp = require('chai-http');

const { HTTP_STATUS_CODES } = require('../app/config');
const { startServer, stopServer, app } = require('../app/server.js');

const expect = chai.expect; // So we can do "expect" instead of always typing "chai.expect"
chai.use(chaiHttp); // implements chai http plugin

describe('Integration tests for: /', function () {
    /**
     * To understand Mocha hooks (before, after, beforeEach, afterEach), see:
     * https://mochajs.org/#hooks
     */
    before(function () {
        return startServer();
    });

    after(function () {
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
                expect(res.text).to.have.string('<title>Just Jotit</title>');
            });
    });
});