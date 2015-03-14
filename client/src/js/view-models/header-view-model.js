define(["ko", "applicationState"], function(ko, applicationStateModule){
    function HeaderViewModel(){
        var self = this;

        self._={
            disposed: false,
            shown: false,
            applicationState: applicationStateModule.get(),

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("This instance of HeaderViewModel has already been disposed");
                }
            }   
        };

        self.loggedIn = ko.observable(self._.applicationState.loggedIn());

        self.loginChangedSubscription = self._.applicationState.loggedIn.subscribe(function(newValue){
            self.loggedIn(newValue);
        });

        self.started = ko.observable(self._.applicationState.started());

        self.shown = function(){
           self._.checkIfDisposed();
           if(!self._.shown){

           }
        };

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){
                
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self._.applicationState.dispose();
                self._.applicationState = null;

                self._.disposed = null;
            }
        };
        

    }
    
    return {
        get: function(){
            return new HeaderViewModel();
        },
        type: function(){
            return HeaderViewModel;
        }
    };
});
