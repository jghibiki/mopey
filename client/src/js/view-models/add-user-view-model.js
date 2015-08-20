define(["ko", "nativeCommunicationManager"], function(ko, NativeCommunicationManagerModule){
    function AddUserViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            nativeCommunicationManager: NativeCommunicationManagerModule.get(),

            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("Add User View Model has already been disposed.");
                }
            }
        };

        self.fname = ko.observable();
        self.lname = ko.observable();
        self.user = ko.observable();
        self.email = ko.observable();
        self.password = ko.observable();
        self.password2 = ko.observable();
        self.terms = ko.observable(false);
        self.error = ko.observable(null);

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self._.shown = true;
            }
        }

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown){
                self._.shown = false;
            }
        }

        self.dispose = function(){
            if(!self._.disposed){
                self._.nativeCommunicationManager.dispose();
                self._.nativeCommunicationManager = null;
                self._.disposed = true;
            }
        }

        self.submit = function(){
            self._.checkIfDisposed();

            self.error(null);
            
            var fname = self.fname();
            if(!(fname !== null 
                    && fname !== ""
                    && fname !== undefined)){
                self.error("Please provide a first name.");
                return
            }

            var lname = self.lname();
            if(!(lname !== null 
                    && lname !== ""
                    && lname !== undefined)){
                self.error("Please provide a last name.");
                return
            }

            var username = self.user();
            if(!(username !== null 
                    && username !== ""
                    && username !== undefined)){
                self.error("Please provide a username.");
                return
            }

            var email = self.email();
            if(!(email !== null 
                    && email !== ""
                    && email !== undefined)){
                self.error("Please provide an email.");
                return
            }

            var password = self.password();
            var password2 = self.password2();
            if(!(password !== null 
                    && password !== ""
                    && password !== undefined)){
                self.error("Please provide a password.");
                return
            }

            if(!(password2 !== null 
                    && password2 !== ""
                    && password2 !== undefined)){
                self.error("Please confirm the password.");
                return
            }

            if(password !== password2){
                self.error("Passwords do no match.");
                return
            }

            var terms = self.terms();
            if(!terms){
                self.error("You must agree to the terms and conditions to create an account.");
                return
            }
            
            self._.nativeCommunicationManager.sendNativeRequest(
                    self._.nativeCommunicationManager.endpoints.CREATE_USER,
                    function(response){
                        if("Error" in response){
                            self.error("Error: " + response.Error);
                        }
                        else{
                            self.fname(null);
                            self.lname(null);
                            self.email(null);
                            self.user(null);
                            self.password(null);
                            self.password2(null);
                            self.terms(false);

                            alert("User added!");
                        }
                    },
                    null,
                    {
                       "username": username,
                       "password": password,
                        "firstName": fname,
                        "lastName": lname,
                        "email": email
                    });
             
        }
    }

    return {
        get: function(){
            return new AddUserViewModel();
        },
        type: function(){
            return AddUserViewModel;
        }
    };
});
