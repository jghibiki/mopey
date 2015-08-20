define(["ko", "nativeCommunicationManager", "authenticationManager", "chain"], function(ko, NativeCommunicationManagerModule, AuthenticationManagerModule, chain){
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
        self.userUpdateError = ko.observable();
        self.updatingUser = ko.observable(false);

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

        self.userError = ko.observable();

        self.adminSubscription = null;

        // Admin control variables
        self.mode = ko.observable("list");
        self.page = ko.observable(0);
        self.query = ko.observable();
        self.userCount = ko.observable();
        self.results = ko.observable();
        self.selected = ko.observable();
        self.usersError = ko.observable();

        self.view_edit = ko.observable(false);

        self.view_username = ko.observable();
        self._view_username = ko.observable();

        self.view_fname = ko.observable();
        self._view_fname = ko.observable();

        self.view_lname = ko.observable();
        self._view_lname = ko.observable();

        self.view_email = ko.observable();
        self._view_email = ko.observable();
        
        self.view_karma = ko.observable();
        self._view_karma = ko.observable();

        self.view_strikes = ko.observable();
        self._view_strikes = ko.observable();

        self.view_edit_password = ko.observable(false);
        self.view_password = ko.observable();
        self.view_password2 = ko.observable();

        self.first = ko.computed(function(){
            return self.page() !== 0;
        });

        self.backward = ko.computed(function(){
            return self.page() > 0;
        });

        self.forward = ko.computed(function(){
            return self.page() < Math.floor(self.userCount() / 10);
        });

        self.last = ko.computed(function(){
            return self.page() !== Math.floor(self.userCount() /10);
        });


        self.modeSubscription = self.mode.subscribe(function(newMode){
            if(self.admin()){
                if(newMode === "list"){
                    self.list();
                }
                else if(newMode == "search"){
                    self.search();
                    self.mode("view")
                }
            }
        });

        


        self.shown = function(){
            if(!self._.shown){
                self._.shown = true;


                self.userError(null);
                self.usersError(null);
                self.loadUser();

                self.adminSubscription = self._.authenticationManager.admin.subscribe(function(admin){
                    self.admin(admin);
                });
                self.admin(self._.authenticationManager.admin());

                if(self.admin()){
                    self.list();
                }

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

        self.loadUser = function(){
                self.loadingUser(true);
                self._.nativeCommunicationManager.sendNativeRequest(
                    self._.nativeCommunicationManager.endpoints.GET_USER,
                    function(response){
                        if("Error" in response){
                            self.userError("Error: " + response.Error);
                            self.loadingUser(false);
                            return;
                        }
                        else{
                            self.username(response.username);
                            self._username(response.username);
                            self.fname(response.firstName);
                            self._fname(response.firstName);
                            self.lname(response.lastName);
                            self._lname(response.lastName);
                            self.email(response.email);
                            self._email(response.email);
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
        };

        self.list = function(){
            chain.get()
                .cc(function(conext, error, next){
                    self.loadingUsers(true);
                    next();
                })
                .cc(function(context, error, next){
                    self.usersError(null)
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.COUNT_USERS,
                        function(response){
                            if("Error" in response){
                                self.usersError("Error: " + response.Error);
                                self.loadingUsers(false);
                                error()
                            }
                            else{
                                self.userCount(response.result);
                                next();
                            }
                        },
                        {},
                        null);
                })
                .cc(function(context, error, next){
                    self.usersError(null);
                    var page = self.page();

                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.GET_USERS,
                        function(response){
                            if("Error" in response){
                                self.usersError("Error: " + response.Error);
                                self.loadingUsers(false);
                            }
                            else{

                                self.results(response.result);
                                next();
                            }
                        },
                        {"page" : self.page()},
                        null);

                })
                .end({}, function(){
                    self.loadingUsers(false);   
                });
        }

        self.search = function(){
            self.usersError(null);
            self.loadingUsers(true);


            var query = self.query();
            if(query !== undefined 
                    && query !== null
                    && query !== ""){

                self.query("");
                self._.nativeCommunicationManager.sendNativeRequest(
                    self._.nativeCommunicationManager.endpoints.GET_USER,
                    function(response){
                        if("Error" in response){
                            self.usersError("Error: " + response.Error); 
                            self.loadingUsers(false);
                            self.mode("list");
                        }
                        else{
                            self.view_username(response.username);
                            self._view_username(response.username);

                            self.view_fname(response.firstName);
                            self._view_fname(response.firstName);

                            self.view_lname(response.lastName);
                            self._view_lname(response.lastName);

                            self.view_email(response.email);
                            self._view_email(response.email);

                            self.view_karma(response.karma);
                            self._view_karma(response.karma);

                            self.view_strikes(response.strikes);
                            self._view_strikes(response.strikes);

                            self.selected(response.key);

                            self.loadingUsers(false);

                        }
                    },
                    {"key": query},
                    null);
            }
        }

        self.startSearch = function(){
            self.mode("search");
        }

        self.toList = function(){
            self.mode("list");

            self.selected(null);
            self.view_username(null);
            self._view_username(this);

            self.view_fname(this);
            self._view_fname(this);

            self.view_lname(this);
            self._view_lname(this);

            self.view_email(this);
            self._view_email(this);

            self.view_karma(this);
            self._view_karma(this);

            self.view_strikes(this);
            self._view_strikes(this);

        }

        self.viewItem = function(){

            self.selected(this.key);
            self.view_username(this.username);
            self._view_username(this.username);

            self.view_fname(this.firstName);
            self._view_fname(this.firstName);

            self.view_lname(this.lastName);
            self._view_lname(this.lastName);

            self.view_email(this.email);
            self._view_email(this.email);

            self.view_karma(this.karma);
            self._view_karma(this.karma);

            self.view_strikes(this.strikes);
            self._view_strikes(this.strikes);

            self.mode("view");

        }

        self.userEdit = function(){
            self.edit(true);
        }

        self.userSubmit = function(){
            self.userUpdateError(null);

            var username = self.username();
            if(username === undefined
                || username === null
                || username === ""){
                
                self.userUpdateError("Please enter a username.");
                return;
            }

            var fname = self.fname();
            if(fname === undefined
                || fname === null
                || fname === ""){
                
                self.userUpdateError("Please enter a first name.");
            }

            var lname = self.lname();
            if(lname === undefined
                || lname === null
                || lname === ""){
                
                self.userUpdateError("Please enter a last name.");
            }

            var email = self.email ();
            if(lname === undefined
                || email === null
                || email === ""){
                
                self.userUpdateError("Please enter an email.");
            }


            self._.nativeCommunicationManager.sendNativeRequest(
                self._.nativeCommunicationManager.endpoints.EDIT_USER,
                function(response){
                    if("Error" in response){
                        self.userUpdateError("Error: " + response.Error);
                        self.updatingUser(false);                        
                    }
                    else{
                        self.edit(false);
                        self.loadUser();
                    }
                },
                { "key": self.key },
                {
                    "username": username,
                    "firstName" : fname,
                    "lastName": lname,
                    "email" : email
                });

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
