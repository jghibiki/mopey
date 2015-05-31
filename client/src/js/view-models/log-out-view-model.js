define(["applicationState"], function(applicationStateModule){
    function LogOutViewModel(){
        var self = this;

        self._ = {
            disposed: false,
            shown: false,
            applicationState : applicationStateModule.get(),
            timer : null,
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("Instance of LogOutViewModel already disposed.");
                }
            },
            logOut : function(){
                if(self._.shown){
                    clearTimeout(self._.timer);
                    self._.timer = null;

                    localStorage.clear();
                    self._.applicationState.accessToken("");
                    self._.applicationState.expirationDate("");
                    self._.applicationState.loggedIn(false);
                    window.location = self._.applicationState.clientUrl() + "/#home";
                    self._.applicationState.currentRoute("#home");
                }
            }
        };

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self._.timer = setInterval(self._.logOut, 1000);       
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
            return new LogOutViewModel();
        },
        type : function(){
            return LogOutViewModel;
        }
    }
});
