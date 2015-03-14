/**
 * @module base/require-plugins/singleton
 * @description
 * Require plugin which changes a viewmodel into a singleton. The "get" method of the viewmodel is replaced
 * with a singleton pattern version. The viewmodel is then managed by the [SingletonManager]{@link SingletonManager}
 * for possible disposal later.
 */
define(["singletonManager"], function(singletonManager){
    var manager = singletonManager.get();
    return {

    /**
     * @description A function that is called to turn a viewmodel into a singleton before it is first fetched. This is the only mandatory method for the plugin to be useful.
     * @name module:base/require-plugins/singleton#load
     * @param {String} path - The path to the viewmodel that will become a singleton.
     * @param {Function} parentRequire - A local "require" function to use to load other modules.
     * @param {Function} onload - A function to call with the value for path. This tells the loader that the plugin is done loading the resource.
     * @param {Object} config - A configuration object. This is a way for the optimizer and the web app to pass configuration information to the plugin. This is <b>NOT</b> used.
     * @function
     */
    load: function(path, parentRequire, onload, config){

        //Get the actual module which must be loaded as a singleton.
        //If this is a build environment, we still need to hint to
        //RequireJS what this plugin will need during runtime.
        parentRequire([path], function(originalModule) {

            if(config.isBuild) {
                //If this is a build environment, do nothing.
                onload();
            } else {
                // Capture the original get function
                var __original_get = originalModule.get;
                if (typeof originalModule.get !== "function") {
                    throw new Error("module '" + path + "' does not conform to get pattern");
                }

                // Convert the get function into a singleton pattern
                originalModule.get = function () {
                    if (!manager.singletons[path]) {
                        manager.singletons[path] = __original_get.apply(originalModule, arguments);
                    }
                    return manager.singletons[path];
                };
                onload(originalModule);
            }
        });
    }
}});
