define(["ko", "nativeCommunicationManager", "authenticationManager"], function(ko, NativeCommunicationManagerModule, AuthenticationManagerModule){
    function AccountViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            nativeCommunicationManager: NativeCommunicationManagerModule.get(),
            authenticationManager: AuthenticationManagerModule.get()
        };


        self.admin = ko.observable();

        self.key = localStorage["user_key"];

        self.edit = ko.observable(false);
        self.loadingUser = ko.observable(false);
        self.loadingUsers = ko.observable(false);

        self.username = ko.observable();
        self._username = ko.observable();

        self.fname = ko.observable();
        self._fname = ko.observable();

        self.lname = ko.observable();
        self._lname = ko.observable();

        self.email = ko.observable();
        self._email = ko.observable();

        self.karma = ko.observable();

        self.strikes = ko.observable();

        self.edit_password = ko.observable(false);
        self.password = ko.observable();
        self.password2 = ko.observable();

        self.adminSubscription = null;



        self.shown = function(){
            if(!self._.shown){
                self._.shown = true;


                self.loadingUser(true);
                self._.nativeCommunicationManager.sendNativeRequest(
                    self._.nativeCommunicationManager.endpoints.GET_USER,
                    function(response){
                        if("Error" in response){
                            alert("Error: " + response.Error);
                            self.loadingUser(false);
                            return;
                        }
                        else{
                            self.username(response.username);
                            self.fname(response.firstName);
                            self.lname(response.lastName);
                            self.email(response.email);
                            self.karma(response.karma);
                            self.strikes(response.strikes);
                            self.loadingUser(false);
                        }
                    },
                    {
                        "key": self.key
                    },
                    null
                );

                self.adminSubscription = self._.authenticationManager.admin.subscribe(function(admin){
                    self.admin(admin);
                });
                self.admin(self._.authenticationManager.admin());
            }
        };

        self.hidden = function(){
            if(self._.shown){
                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self._.disposed = true;

                self._.nativeCommunicationManager.dispose();
                self._.nativeCommunicationManager = null;

                self._.authenticationManager.dispose();
                self._.authenticationManager = null;
            }
        };

        self.toggle_edit = function(){
            self.edit(true);
        }
    }

    return {
        get: function(){
            return new AccountViewModel();
        },
        type: function(){
            return AccountViewModel;
        }
    }
});
