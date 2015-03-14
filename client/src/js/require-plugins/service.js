/**
 * @module base/require-plugins/service
 * @description
 * Require plugin which checks if a service follows the service contract, gets it, and then starts it.
 */
define({

    /**
     * @description A function that is called to load a service. This is the only mandatory API method that needs to be implemented for the plugin to be useful.
     * @param {String} servicePath - The path to the service to load.
     * @param {Function} parentRequire - A local "require" function to use to load other modules.
     * @param {Function} onload - A function to call with the value for servicePath. This tells the loader that the plugin is done loading the resource.
     * @param {Object} config -  A configuration object. This is a way for the optimizer and the web app to pass configuration information to the plugin.  This is <b>NOT</b> used.
     * @function
     */
    load: function(servicePath, parentRequire, onload, config){
        "use strict";

        parentRequire([servicePath], function(serviceModule) {
            if(config.isBuild) {
                onload();
            } else {

                var __original_get = serviceModule.get;
                if (typeof serviceModule.get !== "function") {
                    throw new Error("service '" + servicePath + "' does not conform to get pattern");
                }

                serviceModule.get = function () {
                    var service = __original_get();

                    if (typeof service.start !== "function" || typeof service.stop !== "function" || typeof service.dispose !== "function") {
                        throw new Error("Service defined at path: '" + servicePath + "' does not conform to service contract");
                    }

                    service.start();
                    return service;
                };

                onload(serviceModule);
            }
        });
    }
});