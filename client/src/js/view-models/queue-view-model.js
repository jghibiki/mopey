define(["ko", "authenticationManager", "nativeCommunicationManager", "chain"], function(ko, AuthenticationManagerModule, NativeCommunicationManagerModule, chain){
    function QueueViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,

            authenticationManager: AuthenticationManagerModule.get(),
            nativeCommunicationManager: NativeCommunicationManagerModule.get(),
            timer: null
        };

        self.page = ko.observable();

        self.requestCount = ko.observable();

        self.results = ko.observable(null);

        self.isAdmin = ko.observable();

        self.loading = ko.observable(false);

        self.error = ko.observable();
	
	self.currentRequest = ko.observable();

        self.hasRequests = ko.computed(function(){
            if( self.results() !== null &&
                self.results() !== undefined)
            {
                return self.results().length > 0;
            }
            else{
                return false;
            }
        });

        self.queue = ko.computed(function(){
            return self.page() > 0;
        });

        self.first = ko.computed(function(){
            return self.page() !== 0;
        });

        self.backward = ko.computed(function(){
            return self.page() > 0;
        });

        self.forward = ko.computed(function(){
            pages = Math.floor(self.requestCount() / 10) 
            return self.page() < pages ;
        });

        self.last = ko.computed(function(){
            pages = Math.floor(self.requestCount() / 10) 
            return self.page() !== pages && 0 < pages;
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
            self.page(Math.floor(self.userCount()/10));
        }

        self.adminSubscription = null;

        self.shown = function(){
            if(!self._.shown){
                self._.shown = true;

                self.adminSubscription = self._.authenticationManager.admin.subscribe(function(admin){
                    self.isAdmin(admin);
                });
                self.isAdmin(self._.authenticationManager.admin());

                self.page(0);
                self.pageSubscription = self.page.subscribe(function(){
                    self.list()
                });


                self._.timer = setInterval(self.list, 10000);
                self.list()
            
            }
        };

        self.hidden = function(){
            if(self._.shown){
                self._.shown = false;

                clearInterval(self._.timer)
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self._.disposed = true;

                self._.nativeCommunicationManager.dispose();
                self._.nativecommunicationManager = null;
                
                self._.nativeCommunicationManager.dispose();
                self._.nativeCommunicationManager = null;

                clearInterval(self._.timer)
            }
        };

        self.list = function(){
            chain.get()
            .cc(function(context, error, next){
                if(self.results() === null){
                    self.loading(true);
                }
                self.error(null)
                next() 
            })
            .cc(function(context, error, next){
                self._.nativeCommunicationManager.sendNativeRequest(
                    self._.nativeCommunicationManager.endpoints.COUNT_REQUESTS,
                    function(response){
                        if("Error" in response){
                        self.error("Error: " + response.Error);
                                self.loading(false);
                            error()
                        }
                        else{
                            self.requestCount(response.result);
                            next()
                        }
                    },
                    null,
                    null);
            })
            .cc(function(context, error, next){
                self._.nativeCommunicationManager.sendNativeRequest(
                    self._.nativeCommunicationManager.endpoints.GET_REQUESTS,
                    function(response){
                        if("Error" in response){
                            self.error("Error: " + response.Error);
                            self.loading(false);
                            error()
                        }
                        else{
                            self.results(response.result);
                            next()
                        }
                    },
                    {
                        "page": self.page()
                    },
                    null);
            })
            .cc(function(context, error, next){

		self._.nativeCommunicationManager.sendNativeRequest(
		    self._.nativeCommunicationManager.endpoints.GET_CURRENT_REQUEST,
		    function(response){
			if("Error" in response){
			    self.errorMessage(response.Error);
			    self.loading(false);
			    error()
			}
			else{
			    if(response.result !== null){
				self.currentRequest(response.result);
			    }
			    else{
				self.currentRequest(null);
			    }
			    next()
			}
		    },
		    null,
		    null
		);

            })
            .end(null, function(){
                self.loading(false);
            })
        };

    }

    return {
        get: function(){
            return new QueueViewModel();
        },
        type: function(){
            return QueueViewModel;
        } 
    }
});
