define(["ko","jquery"], function(ko, $){

    function LoginViewModel(){
        var self = this;

        self._ = {
            disposed: false,
            shown: false,
//            applicationState : applicationStateModule.get(),
            apiUrl : null,
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("Instance of LoginViewModel has alredy been disposed.");
                }
            },

            validateUsername : function(){
                var emptyString = "Username cannot be empty";
                if(self.username() === ""){
                    self._.addError(emptyString);
                    return false;
                }
                else{
                    self._.removeError(emptyString);
                    return true;
                }

            },

            validatePassword : function(){
                var emptyString = "Password cannot be empty";
                if(self.password() === ""){
                    self._.addError(emptyString);
                    return false;
                }
                else{
                    self._.removeError(emptyString);
                    return true;
                }
            },
            addError: function(message){
                var index = self.errors.indexOf(message);
                if(index === -1){
                    self.errors.push(message);
                }
            },
            removeError: function(message){
                var index = self.errors.indexOf(message);
                if(index !== -1){
                    self.errors.remove(self.errors()[index]);
                }
            },
        };

        self.username = ko.observable("");
        self.password = ko.observable("");
        self.errors = ko.observableArray([]);

        self.validateUsername = ko.computed(self._.validateUsername);
        self.validatePassword = ko.computed(self._.validatePassword);


        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
//                self._.applicationState.navigateLeftLink("");
//                self._.applicationState.navigateRightLink("");
//                if(self._.applicationState.currentFlow() !== "main"){
//                    self._.applicationState.currentFlow("main");
//                }
//                self._.apiUrl = self._.applicationState.apiUrl();
                self._.shown = true;
            }
        };

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){
//                self._.apiUrl = self._.applicationState.apiUrl();
                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
//                self._.applicationState.dispose();
//                self._.applicationState = null;
                self._disposed = true;
            }
        };

        self.submit = function(){
            if(self.validateUsername() && self.validatePassword()){
                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    data: JSON.stringify({
                        username : self.username(), 
                        password : self.password()
                    }), 
                    dataType: "json",
                    url: self._.apiUrl + "/authenticate"
                }).done(
                    function(data){
                        localStorage["expiration_date"] = data["expiration_date"];
                        localStorage["access_token"] = data["access_token"];

//                        self._.applicationState.accessToken(data.access_token);
//                        self._.applicationState.expirationDate(data.expiration_date);
//                        self._.applicationState.loggedIn(true);

//                        window.location = self._.applicationState.clientUrl() + "/#home";
//                        self._.applicationState.currentRoute("#home");
                    });
            }
        };
    }

    return {
        get: function(){
            return new LoginViewModel();
        },
        type: function(){
            return LoginViewModel;
        }
    };

});
