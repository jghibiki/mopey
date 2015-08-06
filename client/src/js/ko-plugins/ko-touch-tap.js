/**
 * Creates a "tap" gesture recognizer handler on a dom element.
 * Configuration Object:
 * {
 *    [onStart: function(){}] //fires when the touch begins. Fires only once per event.
 *    [onAction: function(){}] //fires when the touch listener recognizes the tap is successful.
 *    [onEnd: function(){}] //fires when the touch ends, in either case of abnormal or success.
 *    [isDisabled: boolean/binding] //boolean to check for if the current control is disabled.
 *                                    no longer accepts touch events and adds the "disabled" css class
 *                                    to the element while true.
 *    [timeout:number] //optional configuration value; the amount of time in ms a touch must be inside the
 *                       control before the touch release event fires the action callback.
 * }
 *
 * Browser Defaults:
 *
 * When in the browser, this binding behaves in a similar fashion, using 'mousedown'/'mousemove'/'mouseup' events
 * rather than touch.
 */

define(["ko"], function(ko){

    var __PRESSED_CLASS = "pressed";
    var __DISABLED_CLASS = "disabled";


    function buildOnPointerUp(element, valueAccessor){
        var callbacks = valueAccessor();
        function onPointerUp(evt){
            ko.bindingHandlers.touchTap.onAction(element, callbacks);
        }
        return onPointerUp;
    }


    ko.bindingHandlers.touchTap = {
        onStart:function(element, callback) {
            ko.bindingHandlers.css.update(element, cssPressedVacc(true));
            if(callback)
                callback();
        },
        onAction:function(element, callback) {
            //No UI update
            if(callback)
                callback();
        },
        onEnd:function(element, callback) {
            ko.bindingHandlers.css.update(element, cssPressedVacc(false));
            if(callback)
                callback();
        },
        init:function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){

            var onPointerUp = buildOnPointerUp(element, valueAccessor);
            element.addEventListener("pointerup", onPointerUp, false);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
                element.removeEventListener("pointerup", onPointerUp);
               
            });
        },update:function(element, valueAccessor){
        }
    }


});
