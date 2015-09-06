/**
 * Created by Tom on 02/07/2015.
 */

import Context = require('./Context');

import Dependency = require('./annotations/Dependency');
import Inject = require('./annotations/Inject');
var Injection = Inject.Injection;
var NamedInjection = Inject.NamedInjection;
var AutoInject = Inject.AutoInject;
var DirectLoad = Inject.DirectLoad;
import Singleton = require('./annotations/SingletonAnnotation');

import Config = require('./Config');

export {
	Context,
	Dependency,
	Injection,
	AutoInject,
	DirectLoad,
	Singleton,
	Config
}