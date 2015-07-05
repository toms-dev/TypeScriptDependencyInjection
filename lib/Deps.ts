/**
 * Created by Tom on 02/07/2015.
 */

export import Context = require('./Context');

export import Dependency = require('./annotations/Dependency');
import Inject = require('./annotations/Inject');
export var Injection = Inject.Injection;
export var NamedInjection = Inject.NamedInjection;

console.log("Inject:", Inject);