define(["ko", "applicationState", "module"], function(ko, ApplicationStateModule, module){

    function HackAThonViewModel(){
        var self = this;

        self._ = {
            disposed : false,
            shown: false,
            applicationState : ApplicationStateModule.get(),

            checkIfDisposed : function(){
                if(self._.disposed){
                    throw new Error("This instance of HackAThonViewModel has already been disposed");
                }
            }
        };

        //ko observables
        
        self.registrationOpen = ko.observable(module.config()["registrationOpen"]);

        self.shown = function(){
            self._.checkIfDisposed(); 
            if(!self._.shown){
                self._.applicationState.navigateRightLink("#schedule");
                self._.applicationState.navigateLeftLink("#conference");
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
                self._.disposed = true;
            }
        };

    }

    return {
        get: function(){
            return new HackAThonViewModel();
        },
        type: function(){
            return HackAThonViewModel;
        }
    };

});
