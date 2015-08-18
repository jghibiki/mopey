define(["ko", "jquery", "apiMappings"], function(ko, $, ApiMappings){
    function AuthenticationService(){
        var self = this;

        self._ = {
            initialized: false,
            started: false,
            disposed: false,
            timer: null,
            apiMappings : ApiMappings,

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


        self.token = ko.observable(null);
        self.admin = ko.observable(false);

        self.init = function(){
            self._.checkIfDisposed();

            if(!self._.initialized){

                self.loadLocalStorage();
                
                self._.initialized = true;
            }
        };

        self.start = function(){
            self._.checkIfInitialized();
            self._.checkIfDisposed();

            self._.timer = setInterval(self.validateToken, 60000);

            if(!self._.started){
                self._.started = true;
            }
        };

        self.stop = function(){
            self._.checkIfDisposed();
            self._.checkIfStarted();
            if(self._.started){
                self.started = false

                    clearInterval(self._.timer);
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self.stop()

                self._.disposed = true;
            }
        };

        self.loadLocalStorage = function(){
            if(localStorage.hasOwnProperty("access_token")){
                if(localStorage.hasOwnProperty("expiration_date")){
                    if((new Date(localStorage["expiration_date"])).valueOf() > (new Date()).getTime()){
                        self.token(localStorage["acccess_token"]);
                        self.admin(Boolean(localStorage["admin"]));
                    }
                    else{
                        localStorage.clear();
                    }
                }
            }
        }

        self.validateToken = function(){
            if(self.token() !== null || self.token() !== "" || self.token() !== undefined){
                $.ajax({
                    url: self._.apiMappings.baseUrl + "/authenticate/verify",
                    type: "POST",
                    dataType: "json",
                    contentType: "application/json",
                    data: JSON.stringify({"token": self.token()}),
                    success: function(response){
                        if(!Boolean(response.result)){
                            self.logout();
                        }
                        else{
                            /* Verify the user is an admin */
                            if(self.admin()){
                                $.ajax({
                                    url: self._.apiMappings.baseUrl + "/authenticate/verify/admin",
                                    type: "POST",
                                    dataType: "json",
                                    contentType: "application/json",
                                    data: JSON.stringify({"token": self.token()}),
                                    success: function(response){
                                        self.admin(Boolean(response.result))
                                    }
                                });
                            }
                        }
                    }
                });

            }
        };

        self.login = function(username, password, successCallback, errorCallback){
            $.ajax({
                url: self._.apiMappings.baseUrl + "/authenticate",
                type: "POST",
                dataType: "json",
                contentType: "application/json",
                data: JSON.stringify({
                    "username": username,
                    "password": password
                }),
                success: function(result){
                    if("Error" in result){
                        errorCallback(result.Error);
                    }
                    else{
                        localStorage["access_token"] = result.access_token;
                        self.token(result.access_token);
                        localStorage["expiration_date"] = result.expiration_date;
                        localStorage["admin"] = result.admin;
                        localStorage["user_key"] = result.user_key;
                        self.admin(Boolean(result.admin));
                    }
                    successCallback();
                }
            });
        }

        self.logout = function(){
            localStorage.clear();
            self.token(null);
            self.admin(false);
        }
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
