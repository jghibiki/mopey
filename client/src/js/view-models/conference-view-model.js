define(["ko", "applicationState", "module"], function(ko, ApplicationStateModule, module){

    function ConferenceViewModel(){
        var self = this;
        
        self._ = {
            disposed: false,
            shown: false,
            applicationState : ApplicationStateModule.get(),
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("This instance of ConferenceViewModel is already disposed.");
                }
            }
        };

        self.speakers = ko.observableArray(module.config()["speakers"]);
        self.resumeReview = ko.observable(module.config()["resumeReview"]);
        self.concessions = ko.observable(module.config()["concessions"]);

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self._.applicationState.navigateRightLink("#hack-a-thon");
                self._.applicationState.navigateLeftLink("#home");
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

                self.concessions = null;
                self.resumeReview = null;
                self.speakers = null;

                self._.diposed = true;
            }
        };
    }

    return {
        get: function(){
            return new ConferenceViewModel();
        },
        type: function(){
            return ConferenceViewModel;
        }
    };

});
