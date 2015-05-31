define(["ko", "navigationViewModel", "workingViewModel"], function(ko, NavigationViewModelModule, WorkingViewModelModule){
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

        self.navigationViewModel = NavigationViewModelModule.get();
        self.workingViewModel = WorkingViewModelModule.get();

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self.navigationViewModel.shown();
                self.workingViewModel.shown();
                self._.shown = true;
            }
        };

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){
                self.navigationViewModel.hidden();
                self.workingViewModel.hidden();
                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self.navigationViewModel.hidden();
                self.workingViewModel.hidden();
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
