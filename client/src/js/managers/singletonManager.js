/**
 * @module base/managers/singleton-manager
 * @description
 * RequireJS module to obtain a singleton instance of the {@link SingletonManager}.
 */
define([], function(){
    var __singleton = null;

    /**
     * @class SingletonManager
     * @classdesc Provides a manager for all instances of singletons in the system to manage their lifecycle.
     * @global
     */
    function SingletonManager(){
        var self = this;

        self.singletons = {};

        /**
         * @description
         * Iterates through all created singletons and calls dispose on them before setting the instance to null so
         * it will be recreated on the next request.
         * @name SingletonManager#dispose
         * @function
         */
        self.dispose = function(){
            for (var key in self.singletons){
                // Make sure it's a property of singletons and didn't come from prototype
                if (self.singletons.hasOwnProperty(key)){
                    if (self.singletons[key] != null){
                        console.log("Dispose called on: " + key);
                        self.singletons[key].dispose();
                        self.singletons[key] = null;
                    }
                }
            }
        }
    }

    /**
     * @alias module:base/managers/singleton-manager
     * @constructor
     */
    return {
        /**
         * @name module:base/managers/singleton-manager#get
         * @returns {SingletonManager} Singleton instance of the {@link SingletonManager}.
         * @function
         */
        get:function(){
            if (__singleton == null){
                __singleton = new SingletonManager();
            }
            return __singleton;
        },
        /**
         * @name module:base/managers/singleton-manager#type
         * @returns {Function} Returns the declaration of the [SingletonManager]{@link SingletonManager}
         * @function
         */
        type:function(){
            return SingletonManager;
        }
    }
});
