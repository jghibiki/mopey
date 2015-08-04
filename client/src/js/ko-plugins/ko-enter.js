
define(["ko", "jquery"], function(ko, $){
"use strict";

    ko.bindingHandlers.enter = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel){
            var allBindings = allBindingsAccessor();

            $(element).on('keypress', 'input, textarea, select', function(e){
                var keyCode = e.which || e.keyCode;
                if(keyCode !== 13){
                    return true;
                }

                var target = e.target;
                target.blur();

                allBindings.enter.call(viewModel, viewModel, target, element);

                return false;
            });
        }

    };

});
