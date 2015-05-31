/**
 * @module base/ko-plugins/ko-content
 * @description
 * Knockout bindings which insert the html for an object.
 * It is expected that the view text is located at the view property on the object.
 */
define(["ko"], function(ko){
    "use strict";

    /**
     * @class ko.bindingHandlers.content
     * @classdesc
     * Knockout binding which inserts the html for an object.
     * It is expected that the view text is located at the view property on the object.
     */
    ko.bindingHandlers.content = {

        /**
         * @description Called when binding is initially applied to an element.
         * @param {Object} element - The DOM element involved in this binding.
         * @param {Function} valueAccessor - A JavaScript function that you can call to get the current model property that is involved in this binding.
         * @param {Object} allBindingsAccessor - A JavaScript object that you can use to access all the model values bound to this DOM element.
         * @param {Object} viewModel - Deprecated.  Do not use.
         * @param {Object} bindingContext - An object that holds the binding context available to this element’s bindings.
         * @name ko.bindingHandlers.content#init
         * @returns {{controlsDescendantBindings: boolean}}
         * @function
         */
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            return { controlsDescendantBindings: true };
        },

        /**
         * @description Called when binding is applied to an element and whenever a dependency changes.
         * @param {Object} element - The DOM element involved in this binding.
         * @param {Function} valueAccessor - A JavaScript function that you can call to get the current model property that is involved in this binding.
         * @param {Object} allBindingsAccessor - A JavaScript object that you can use to access all the model values bound to this DOM element.
         * @param {Object} viewModel - Deprecated.  Do not use.
         * @param {Object} bindingContext - An object that holds the binding context available to this element’s bindings.
         * @name ko.bindingHandlers.content#update
         * @function
         */
        update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
            var parentProperty = ko.utils.unwrapObservable(valueAccessor());
            ko.virtualElements.emptyNode(element);

            if(parentProperty != null){

                var content = parentProperty.view;

                var temp = document.createElement('div');
                temp.innerHTML = content;

                var DOMControl = temp.firstChild;
                temp = null;


                ko.virtualElements.prepend(element, DOMControl);
                ko.applyBindings(parentProperty, DOMControl);
            }
        }
    };

    /**
     * @class ko.bindingHandlers.foreachcontent
     * @classdesc
     * Knockout binding which inserts the html for an object which is in a list.
     * It is expected that the view text is located at the view property on the object.
     */
    ko.bindingHandlers.foreachcontent = {

        /**
         * @description Called when binding is initially applied to an element.
         * @param {Object} element - The DOM element involved in this binding.
         * @param {Function} valueAccessor - A JavaScript function that you can call to get the current model property that is involved in this binding.
         * @param {Object} allBindingsAccessor - A JavaScript object that you can use to access all the model values bound to this DOM element.
         * @param {Object} viewModel - Deprecated.  Do not use.
         * @param {Object} bindingContext - An object that holds the binding context available to this element’s bindings.
         * @name ko.bindingHandlers.foreachcontent#init
         * @returns {{controlsDescendantBindings: boolean}}
         * @function
         */
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            return { controlsDescendantBindings: true };
        },

        /**
         * @description Called when binding is applied to an element and whenever a dependency changes.
         * @param {Object} element - The DOM element involved in this binding.
         * @param {Function} valueAccessor - A JavaScript function that you can call to get the current model property that is involved in this binding.
         * @param {Object} allBindingsAccessor - A JavaScript object that you can use to access all the model values bound to this DOM element.
         * @param {Object} viewModel - Deprecated.  Do not use.
         * @param {Object} bindingContext - An object that holds the binding context available to this element’s bindings.
         * @name ko.bindingHandlers.foreachcontent#update
         * @function
         */
        update:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var content = viewModel.view;

            var temp = document.createElement('div');
            temp.innerHTML = content;

            var DOMControl = temp.firstChild;
            temp = null;

            ko.virtualElements.emptyNode(element);
            ko.virtualElements.prepend(element, DOMControl);
            ko.applyBindings(viewModel, DOMControl);
        }
    };
    ko.virtualElements.allowedBindings.content = true;
    ko.virtualElements.allowedBindings.foreachcontent = true;

    return {};

});