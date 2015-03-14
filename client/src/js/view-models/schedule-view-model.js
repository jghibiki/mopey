define(["ko", "applicationState"], function(ko, ApplicationStateModule){

    function ScheduleViewModel(){
        var self = this;

        self._ = {
            disposed: false,
            shown: false,
            applicationState : ApplicationStateModule.get(),
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("This instance of ScheduleViewModel is already disposed.");
                }
            }
        };

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self._.applicationState.navigateRightLink("#sponsors");
                self._.applicationState.navigateLeftLink("#hack-a-thon");
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

                self._.disposed = false;
            }
        };
    }

    return {
        get: function(){
            return new ScheduleViewModel();
        },
        type: function(){
            return ScheduleViewModel;
        }
    };

});
