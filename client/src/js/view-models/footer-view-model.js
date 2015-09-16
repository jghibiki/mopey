define(["ko", "authenticationManager", "nativeCommunicationManager", "chain"], function(ko, AuthenticationManagerModule, NativeCommunicationManagerModule, chain){
    function FooterViewModel(){
        var self = this;

        self._={
            disposed: false,
            shown: false,
            skiping: false,
            timer: null, 
            defaultThumbnail: "/img/missing.png",
            authenticationManager: AuthenticationManagerModule.get(),
            nativeCommunicationManager: NativeCommunicationManagerModule.get()
        };

        self.admin = ko.observable();

        self.adminSubscription = null; 

        self.currentRequest = ko.observable(null);
        self.thumbnail = ko.observable(self._.defaultThumbnail);
        self.loading = ko.observable(false);
        self.errorMessage = ko.observable(null);


        self.shown = function(){
            if(!self._.shown){

                self.adminSubscription = self._.authenticationManager.admin.subscribe(function(admin){
                    self.admin(admin);
                });
                self.admin(self._.authenticationManager.admin());

                self._.timer = setInterval(self.getCurrentRequest, 10000);
                self.getCurrentRequest();

                self._.shown = true;
            }
        };

        self.hidden = function(){
            if(self._.shown){

                clearInterval(self._.timer)

                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                if(self.adminSubscription !== null){
                    self.adminSubscription.dispose();
                    self.adminSubscription = null;
                }

                self._.authenticationManager.dispose();
                self._.authenticationManager = null;

                self._.nativeCommunicationManager.dispose();
                self._.nativeCommunicationManager = null;

                self._.disposed = true;
            }
        };

        self.skip = function(){
            if(!self._.skiping){
                self._.skiping = true;
                chain.get()
                .cc(function(context, abort, next){
                    var skip = confirm("Are you sure you wish to skip the current song?");
                    if(skip){
                        next()
                    }
                    else{
                        abort()
                    }
                })
                .cc(function(context, abort, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.PLAYBACK_STATE,
                        function(response){
                            if("Error" in response){
                                alert("Error: " + response.Error);
                                abort();
                            }
                            else{
                                if(response.result === "playing"){
                                    next();
                                }
                                else{
                                    abort();
                                } 
                            }
                        }
                    );
                })
                .cc(function(context, abort, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.SERVICE_SKIP_SONG,
                        function(response){
                            if("Error" in response){
                                alert("Error:" + response.Error);
                                abort();
                            }
                            else{
                                next();
                            }
                        }
                    );
                })
                .end(null, function(){
                    self._.skiping = false;   
                });
                        
            }
        }
        

        self.getCurrentRequest = function(){
            if(!self.loading()){

                self.loading(true);
                self.errorMessage(null);

                self._.nativeCommunicationManager.sendNativeRequest(
                    self._.nativeCommunicationManager.endpoints.GET_CURRENT_REQUEST,
                    function(response){
                        if("Error" in response){
                            self.errorMessage(response.Error);
                            self.loading(false);
                        }
                        else{
                            if(response.result !== null){
					if(self.currentRequest() === null 
                                            || response.result.title !== self.currentRequest().title){
					self.currentRequest(response.result);
					self.thumbnail(response.result.thumbnail);
                                }
                            }
                            else{
                                self.currentRequest(null);
                                self.thumbnail(self._.defaultThumbnail);
                            }
                            self.loading(false);
                        }
                    },
                    null,
                    null
                );

            }
        }
    }
    
    return {
        get: function(){
            return new FooterViewModel();
        },
        type: function(){
            return FooterViewModel;
        }
    };
});
