/**
 * @module base/require-plugins/viewModel
 * @description
 * Require plugin which binds a view to a viewModel.  The "view" property on viewModel will get set with the text of the view.
 * It is expected that the "name" passed in contains &lt;path to view&gt;:&lt;path to viewModel&gt;
 */
define({

    /**
     * @description A function that is called to load a resource. This is the only mandatory API method that needs to be implemented for the plugin to be useful.
     * @name module:base/require-plugins/viewModel#load
     * @param {String} names - The names of the view and viewModel resources to load.  This is formatted as &lt;path to view&gt;:&lt;path to viewModel&gt;.
     * @param {Function} parentRequire - A local "require" function to use to load other modules.
     * @param {Function} onload - A function to call with the value for name. This tells the loader that the plugin is done loading the resource.
     * @param {Object} config -  A configuration object. This is a way for the optimizer and the web app to pass configuration information to the plugin.  This is NOT used.
     * @function
     */
    load: function(names, parentRequire, onload, config){
        "use strict";

        var split = names.split(":");
        var viewPath = split[0];
        var viewModelPath = split[1];

        //Load the two pieces of the component.
        //If this is a build enviornment, this is the hint which
        //tells the compiler what files to include
        parentRequire(["text!"+viewPath, viewModelPath], function(viewText, originalModule) {
            if(config.isBuild) {
                //If this is a compiler environment, do nothing.
                onload();
            } else {
                var __original_get = originalModule.get;
                if (typeof originalModule.get !== "function") {
                    throw new Error("module '" + viewModelPath + "' does not conform to get pattern");
                }

                originalModule.get = function () {
                    var viewModel = __original_get.apply(null, arguments);

                    if (typeof viewModel.shown !== "function" || typeof viewModel.hidden !== "function" || typeof viewModel.dispose !== "function") {
                        throw new Error("View Model defined at path: '" + viewModelPath + "' does not conform to view model contract.");
                    }

                    if(typeof viewModel.initialize === "function"){
                        viewModel.initialize();
                    }

                    viewModel.view = viewText;
                    return viewModel;
                };
                onload(originalModule);
            }
        });
    }
});