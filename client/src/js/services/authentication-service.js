define(["ko"], function(ko){
    function AuthenticationService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,

            checkIfInitialized: function(){
                if(!self._.initialized){
                    throw new Error("Must initialize Authentication Service before using it.");
                }
            },

            checkIfStarted: function(){
                if(!self._.started){
                    throw new Error("Must start Authentication Service before using it.");
                }
            },

            checkIfDisposed: function(){
                if(self._disposed){
                    throw new Error("Authentication Service has already been disposed.");
                }
            }
        };


        self.token = ko.observable();

        self.init = function(){
            self._.checkIfDisposed();

            if(!self._.initialized){

                if(localStorage.hasOwnProperty("access_token")){
                    if(localStorage.hasOwnProperty("expiration_date")){
                        if((new Date(localStorage["expiration_date"])).valueOf() > (new Date()).getTime()){
                            self.token(localStorage["acccess_token"]);
                        }
                        else{
                            localStorage.clear();
                        }
                    }
                }

                
                self._initialized = true;
            }
        };

        self.start = function(){
            self._.checkIfInitialized();
            self._.checkIfDisposed();

            if(!self._.started){
                self._.started = true;
            }
        };

        self.stop = function(){
            self._.checkIfDisposed();
            self._.checkIfStarted();
            if(self._.started){
                self.started = false
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self.stop()

                self._.disposed = true;
            }
        };
    }

    return {
        get: function(){
            return new AuthenticationService();
        },
        type: function(){
            return AuthenticationService;
        }
    };
});
