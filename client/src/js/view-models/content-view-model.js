define(["ko", "applicationState"], function(ko, applicationStateModule){
    function ContentViewModel(){
        var self = this;

        self._={
            disposed: false,
            shown: false,
            applicationState : applicationStateModule.get(),
            checkIfDisposed : function(){
                if(self._.disposed){
                    throw new Error("This instance of content view model is already disposd.");
                }
            }
        };

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
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
        get: function(){
            return new ContentViewModel();
        },
        type: function(){
            return ContentViewModel;
        }
    };
});
