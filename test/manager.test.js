var chai      = require('chai');
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');
var expect    = chai.expect;

chai.should();
chai.use(sinonChai);

var ServiceManager = require('../lib/manager');

describe('EventService tests:', function() {
  describe('EventService', function() {
    var serviceManager;
    var game = {};

    before(function() {
      serviceManager = new ServiceManager(game);
    });

    it('should have link to the game intstance', function() {
      expect(serviceManager._game).to.be.equal(game);
    });

  });
});
