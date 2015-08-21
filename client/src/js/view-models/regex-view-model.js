define(["ko", "nativeCommunicationManager", "chain"], function(ko, NativeCommunicationManagerModule, chain){

    function RegexViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            nativeCommunicationManager: NativeCommunicationManagerModule.get(),
            
            checkIfDisposed: function(){
                if(self._.disposed){
                    throw new Error("Regex View Model has already been disposed");
                }
            },
            checkIfShown: function(){
                if(self._.shown){
                    throw new Error("Regex View Model must be shown before interacting with it.");
                }
            }
        };

        self.regexes = ko.observable();
        self.page = ko.observable();
        self.regexesError = ko.observable();
        self.loadingRegexes = ko.observable(false);
        self.regexCount = ko.observable();
        self.pattern = ko.observable();
        self.newRegexError = ko.observable();
        self.loadingNewRegex = ko.observable(false);

        self.first = ko.computed(function(){
            return self.page() !== 0;
        });

        self.backward = ko.computed(function(){
            return self.page() > 0;
        });

        self.forward = ko.computed(function(){
            return self.page() < Math.floor(self.regexCount() / 10);
        });

        self.last = ko.computed(function(){
            return self.page() !== Math.floor(self.regexCount() /10);
        });

        self.pageSubscription = null;

        self.move_forward = function(){
            self.page(self.page() + 1);
        }

        self.move_backward = function(){
            self.page(self.page() - 1);
        }

        self.move_first = function(){
            self.page(0);
        }

        self.move_last = function(){
            self.page(Math.floor(self.regexCount()/10));
        }

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self._.shown = true;

                self.page(0);
                self.pageSubscription = self.page.subscribe(function(){
                    self.list()
                });
                self.list()

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
                self._.nativeCommunicationManager.dispose();
                self._.nativeCommunicationManager = null;
                self._.disposed = true;
            }
        };

        self.list = function(){
            chain.get()
                .cc(function(context, error, next){
                    self.loadingRegexes(true);
                    next();
                })
                .cc(function(context, error, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.COUNT_REGEXES,
                        function(response){
                            if("Error" in response){
                                self.regexesError("Error: " + response.Error);
                                self.loadingRegexes(false);
                                error();
                            }
                            else{
                                self.regexCount(response.result);
                                next();
                            }
                        },
                        null,
                        null);
                })
                .cc(function(context, error, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.GET_REGEXES,
                        function(response){
                            if("Error" in response){
                                self.regexesError("Error: " + response.Error);
                                self.loadingRegexes(false);
                                error();
                            }
                            else{
                                self.regexes(response.result);
                                next();
                            }
                        },
                        {
                            "page" : self.page()   
                        },
                        null)
                })
                .end(null, function(){
                    self.loadingRegexes(false);
                });
        }

        self.deleteRegex = function(){
            self._.checkIfDisposed();
            var regex = this; 

            chain.get()
                .cc(function(context, error, next){
                    self.loadingRegexes(true);
                    next();
                })
                .cc(function(context,error, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.DELETE_REGEX,
                        function(response){
                            if("Error" in response){
                                self.regexesError("Error: " + response.Error);
                                self.loadingRegexes(false);
                                error();
                            }
                            else{
                                next();
                            }
                    }, 
                    {
                        "key" : regex.key
                    },
                    null);
                })
                .end(null, function(){
                    self.loadingRegexes(false);
                    self.list();
                });
        }

        self.addRegex = function(){
            chain.get()
                .cc(function(context, error, next){
                    self.loadingNewRegex(true);
                    next();
                })
                .cc(function(context, error, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.CREATE_REGEX,
                        function(response){
                            if("Error" in response){
                                self.newRegexError("Error: " + response.Error);
                                self.loadingNewRegex(false);
                                error();
                            }
                            else{
                                alert("Regex: '" + self.pattern() + "' added.");
                                self.pattern(null);
                                next();
                            }
                        },
                        null,
                        {
                            "pattern" : self.pattern()
                        });
                })
                .end(null, function(){
                    self.loadingNewRegex(false);
                    self.list();
                });
        }
    }

    return {
        get: function(){
            return new RegexViewModel();
        },
        type: function(){
            return RegexViewModel;
        }
    };
});

