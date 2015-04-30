define(["ko", "leftPaneViewModel", "rightPaneViewModel"], function(ko, leftPaneViewModelModule, rightPaneViewModelModule){
    function ContentViewModel(){
        var self = this;

        self._={
            disposed: false,
            shown: false,
            checkIfDisposed : function(){
                if(self._.disposed){
                    throw new Error("This instance of content view model is already disposd.");
                }
            }
        };

        self.leftPaneViewModel = leftPaneViewModelModule.get();
        self.rightPaneViewModel = rightPaneViewModelModule.get();

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self.leftPaneViewModel.shown();
                self.rightPaneViewModel.shown();
                self._.shown = true;
            }
        };

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){
                self.leftPaneViewModel.hidden();
                self.rightPaneViewModel.hidden();
                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self.leftPaneViewModel.hidden();
                self.rightPaneViewModel.hidden();
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
