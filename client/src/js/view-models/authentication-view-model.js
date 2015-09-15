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

        self.loggedIn = ko.observable();
        self.password = ko.observable();
        self.username = ko.observable();
        self.loggingIn = ko.observable();
        self.errorMessage = ko.observable();

        self.tokenSubscription = self._.authenticationManager.loggedIn.subscribe(function(loggedIn){
            self.loggedIn(loggedIn) 
        });

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self.loggedIn(self._.authenticationManager.loggedIn());
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

        self.login = function(){
            self.errorMessage("");

            user = self.username();
            if(user === "" || user === null || user === undefined){
                self.errorMessage("Please enter a username.");
                return;
            }

            pass = self.password();
            if(pass === "" || pass === null || pass === undefined){
                self.errorMessage("Please enter a password.")
                return;
            }
            self.username("");

            self.loggingIn(true)
            self._.authenticationManager.login(user, pass, 
                    function(){
                        self.loggingIn(false)
                        self.password("");
                    },
                    function(error){
                        self.errorMessage(error);
                        self.loggingIn(false);     
                    });
            return false
        }

        self.logout = function(){
            self._.authenticationManager.logout();
            return false;
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
