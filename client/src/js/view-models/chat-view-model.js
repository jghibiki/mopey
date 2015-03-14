define(["applicationState"], function(ApplicationStateModule){

    function ChatViewModel(){
        var self = this;

        self._ = {
            disposed : false,
            shown : false,
            applicationState : ApplicationStateModule.get(),
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("Instance of ChatViewModel has already been disposed.");
                }
            }
        };

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self._.applicationState.navigateLeftLink("");
                self._.applicationState.navigateRightLink("");
                if(self._.applicationState.currentFlow() !== "main"){
                    self._.applicationState.currentFlow("main");
                }
                self._.shown = true;
            }
        };

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){
                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self._.applicationState.dispose();
                self._.applicationState = null;
                self._.disposed = true;
            }
        };
    }
    return {
        get : function(){
            return new ChatViewModel();
        },
        type: function(){
            return ChatViewModel;
        }
    };
});
