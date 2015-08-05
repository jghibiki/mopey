define(["ko", "authenticationManager"], function(ko, AuthenticationManagerModule){
    function AuthenticationViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            authenticationManager: AuthenticationManagerModule.get(),

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("Authentication View Model has already been disposed.");
                }
            }
        };

        self.loggedIn = ko.observable(false);

        self.tokenSubscription = self._.authenticationManager.loggedIn.subscribe(function(loggedIn){
            self.loggedIn(loggedIn) 
        });

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
                self._.authenticationManager.dispose();
                self._.authenticationManager = null;
                self._.disposed = true;
            }
        }

    }

    return {
        get: function(){
            return new AuthenticationViewModel();
        },
        type: function(){
            return AuthenticationViewModel;
        }
    };
});
