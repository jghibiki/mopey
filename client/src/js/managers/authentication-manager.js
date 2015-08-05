define(["ko", "authenticationService"], function(ko, AuthenticationServiceModule){
    
    function AuthenticationManager(){
        var self = this;

        self._ = {
            disposed : false,
            authenticationService: AuthenticationServiceModule.get()
        };
        
        self.token = ko.observable();

        self.tokenSubscription = self._.authenticationService.token.subscribe(function(token){
            self.token = token;
        });

        self.dispose = function(){
            if(!self._.disposed){
                self._.authenticationService.dispose();
                self._.authenticationService = null;

                self.tokenSubscription.dispose();
                self.tokenSubscription = null;

                self_disposed = true;
            }
        }
    }


    return {
        get: function(){
            return new AuthenticationManager();
        },
        type: function(){
            return AuthenticationManager;
        }
    };
})
