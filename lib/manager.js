var _ = require('lodash');
/**
 * Service manager for the RotorWeb engine.
 * @constructor
 */
function ServiceManager(game) {
  if (ServiceManager._instance === null) {
    ServiceManager.prototype.init.apply(this, arguments);
    ServiceManager._instance = this;
  } else {
    return ServiceManager._instance;
  }
}

var proto = ServiceManager.prototype;

proto.init = function(game) {
	this._game = game;
	this._serviceTypes = {};
	this._services = [];
	this._realized = false;
};

proto.registerService = function(type, service, config) {
	if (type in this._serviceTypes) {
		throw new Error('This service type has already been registered');
	}
	if (typeof service !== 'function') {
		throw new Error('Service type should be a constructor');
	}
	this._serviceTypes[type] = {
		type: service,
		config: config
	};

	if (this._realized) {
		this.initializeService(type);
	}
};

proto.initializeService = function(type) {
	if (!(type in this._serviceTypes)) {
		throw new Error('This service type ' + type + ' is not registered');
	}
	var exist = _.find(this.services, function(service) {
		return service._serviceType === type;
	});
	if (exist) {
		throw new Error('This service type ', type, 
			' has already been initialized');
	}

	var service = this._serviceTypes[type];
	var serviceInstance = new service.type();
	//set link to the game instanse
	serviceInstance._game = this._game;
	serviceInstance._serviceType = type;

	serviceInstance.initialize(service.config);
	this._services.push(serviceInstance);
};

proto.initializeServices = function(serviceTypes) {
	if (serviceTypes instanceof Array) {
		_.each(serviceTypes, function(type) {
			this.initializeService(type);
		}.bind(this));
	}
	this._realized = true;
};

proto.removeService = function(service) {
	var idx = this._services.indexOf(service);
	if (idx >= 0) {
		this._services.splice(idx, 1);
		return true;
	}
	return false;
};

proto.update = function() {
	var services = this._services;
	for (var i = 0, len = services.length; i < len; i += 1) {
		services[i].update();
	}
};

//Static
ServiceManager._instance = null;
ServiceManager.getInstance = function() {
  return ServiceManager._instance;
};

module.exports = ServiceManager;
