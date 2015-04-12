define(["application-state"], function(ApplicationStateModule) {
 
 
    //region Chain Link
    function ChainLink(linkId, callback) {
        var self = this;
        if (typeof linkId !== "number") {
            throw new Error("Invalid link id");
        }
        if (typeof callback !== "function") {
            throw new Error("callback at index " + linkId + " must be a function.");
        }
        self.linkId = linkId;
        self.callback = callback;
    }
 
    //endregion
 
 
    //region Chain
 
    //region Constructor method
    function Chain() {
        var self = this;
        self._chain = [];
        self._disposed = false;
        self._blocking = false;
        self._callback = null;
        self._context = null;
        self._applicationState = ApplicationStateModule.get();
 
        self._StopBlockAndBusy = StopBlockAndBusy.bind(this);
        self._StartBlockAndBusy = StartBlockAndBusy.bind(this);
        self._finally = Finally.bind(this);
        self._reset = reset.bind(this);
 
    //endregion
 
    //region Public Methods
    self.blocking = function () {
        self._blocking = true;
        return this;
    };
 
    self.chain = function (callback) {
        var link = new ChainLink(self._chain.length, callback, false);
        self._chain.push(link);
        return self;
    };
    self.cc = self.chain;
 
 
    self.end = function (parentContext, callback) {
        self._callback = callback;
        self._StartBlockAndBusy();
        var context = parentContext || {};
        self.next(context);
    };
 
 
    self.next = function (context) {
        if (self._chain.length > 0) {
            context.chain = self;
            var current = self._chain.splice(0, 1)[0];
            current.callback(context, self._finally, self.next);
        }
        else
        {
            self._finally(context);
        }
    };
 
    self.pause = function(interval){
        interval = interval || 500;
        self.chain(function(context, errorCallback, successCallback){
            setTimeout(function(){
                successCallback(context);
            }, interval);
        });
        return this;
    };
 
    self.dispose = function(){
        if(!self._disposed){
            self._applicationState.dispose();
            self._applicationState = null;
        }
    };
    //endregion
 
    //region Private Methods
 
    function StartBlockAndBusy(){
        if(self._blocking !== false){
            self._applicationState.isBusy(true);
            self._applicationState.isBlocked(true);
        }
    }
 
    function StopBlockAndBusy(){
        self._applicationState.isBusy(false);
        self._applicationState.isBlocked(false);
    }
 
    function Finally(context){
        self._StopBlockAndBusy();
        self._reset();
        if(typeof self._callback === "function"){
            self._callback(context);
        }
    }
 
    function reset(){
        self.callback = null;
        self._chain = [];
    }
 
    //endregion
 
    }
    //endregion
 
 
    return {
        get : function() {
            return new Chain();
        },
        type: function() {
            return Chain;
        }
    };
});
