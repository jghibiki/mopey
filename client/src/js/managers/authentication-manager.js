define(["ko", "authenticationService"], function(ko, AuthenticationServiceModule){
    
    function AuthenticationManager(){
        var self = this;

        self._ = {
            disposed : false,
            authenticationService: AuthenticationServiceModule.get()
        };
        
        self.token = ko.observable();
        self.admin = ko.observable(self._.authenticationService.admin());
        self.loggedIn = ko.observable();

        self.tokenSubscription = self._.authenticationService.token.subscribe(function(token){
            self.token(token);
            if(token === null || token === ""){
                self.loggedIn(false);
            }
            else{
                self.loggedIn(true);
            }
        });

        self.adminSubscription= self._.authenticationService.admin.subscribe(function(admin){
            self.admin(admin);
        });

        self.dispose = function(){
            if(!self._.disposed){
                self._.authenticationService.dispose();
                self._.authenticationService = null;

                self.tokenSubscription.dispose();
                self.tokenSubscription = null;

                self.adminSubscription.dispose();
                self.adminSubscription = null;

                self_disposed = true;
            }
        };

        self.login = function(username, password, callback){
            self._.authenticationService.login(username, password, callback);
        }

        self.logout = function(){
            self._.authenticationService.logout();
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
