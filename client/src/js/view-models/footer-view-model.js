define(["ko", "authenticationManager", "nativeCommunicationManager", "chain"], function(ko, AuthenticationManagerModule, NativeCommunicationManagerModule, chain){
    function FooterViewModel(){
        var self = this;

        self._={
            disposed: false,
            shown: false,
            unsticking: false,
            authenticationManager: AuthenticationManagerModule.get(),
            nativeCommunicationManager: NativeCommunicationManagerModule.get()
        };

        self.admin = ko.observable();

        self.adminSubscription = null; 

        self.shown = function(){
            if(!self._.shown){

                self.adminSubscription = self._.authenticationManager.admin.subscribe(function(admin){
                    self.admin(admin);
                });

                self._.shown = true;
            }
        };

        self.hidden = function(){
            if(self._.shown){
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

        self.unstick = function(){
            if(!self._.unsticking){
                self._.unsticking = true;
                chain.get()
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
                        self._.nativeCommunicationManager.endpoints.PLAYBACK_NEXT,
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
                    self._.unsticking = false;   
                });
                        
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
