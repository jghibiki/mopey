define(["ko", "nativeCommunicationManager", "chain"], function(ko, NativeCommunicationManagerModule, chain){

    function FavoritesViewModel(){
        var self = this;

        self._ = {
            started: false,
            disposed: false,

            nativeCommunicationManager: NativeCommunicationManagerModule.get(),
        }

        self.favorites = ko.observable();
        self.error = ko.observable(null);
        self.loading = ko.observable(false)
        self.page = ko.observable();
        self.favoriteCount = ko.observable();

        self.hasFavorites = ko.computed(function(){
            return self.favorites() !== undefined && self.favorites() !== null && self.favorites().length > 0
        });

        self.first = ko.computed(function(){
            return self.page() !== 0;
        });

        self.backward = ko.computed(function(){
            return self.page() > 0;
        });

        self.forward = ko.computed(function(){
            pages = Math.floor(self.favoriteCount() / 10) 
            return self.page() < pages ;
        });

        self.last = ko.computed(function(){
            return self.page() !== Math.floor(self.userCount() /10);
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


        self.shown = function(){
            if(!self._.shown){
                self._.shown = true;

                self.page(0);
                self.pageSubscription = self.page.subscribe(function(){
                    self.list()
                });

                self.list();

            }
        };

        self.hidden = function(){
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
                    self.error(null);
                    self.loading(true);
                    next();
                })
                .cc(function(context, error, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.COUNT_FAVORITES,
                        function(response){
                            if("Error" in response){
                                self.error("Error: " + response.Error);
                                self.loading(false);
                                error()
                            }
                            else{
                                self.favoriteCount(response.result);
                                next()
                            }
                        },
                        null,
                        null
                    );
                })
                .cc(function(context, error, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.GET_FAVORITES,
                        function(response){
                            if("Error" in response){
                                self.error("Error: " + response.Error);
                                self.loading(false);
                                error()
                            }
                            else{
                                self.favorites(response.result);
                                next()
                            }
                        },
                        {
                            "page": self.page()
                        },
                        null
                    );
                })
                .end(null, function(){
                    self.loading(false);
                });
        }

        self.requestSong = function(song){
            chain.get()
                .cc(function(conext, error, next){
                    self.loading(true);
                    self.error(null);
                    next()
                })
                .cc(function(context, error, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.CREATE_REQUEST,
                        function(response){
                            if("Error" in response){
                                self.error("Error: " + response.Error);
                                self.loading(false);
                                error()
                            }
                            else{
                                alert("Sucessfully requested " + song.title + "!");
                                next()
                            }
                        },
                        null,
                        {
                            "song": song.youtubeKey,
                            "title": song.title,
                            "uploader": song.uploader,
                            "description": song.description
                        }
                    );
                })
                .end(null, function(){
                    self.loading(false); 
                });
        }

        self.removeSong = function(song){
            chain.get()
                .cc(function(context, error, next){
                    self.loading(true);
                    self.error(false);
                    next();
                })
                .cc(function(context, error, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.REMOVE_FAVORITE,
                        function(response){
                            if("Error" in response){
                                self.error("Error: " + response.Error);
                                self.loading(false);
                                error();
                            }
                            else{
                                alert("Removed " + song.title + " from favorites.");
                                next();
                            }
                        },
                        {
                            "key": song.key
                        },
                        null
                    );
                })
                .end(null, function(){
                    self.loading(false)
                    self.list()
                }); 
        }
    }

    return {
        get: function(){
            return new FavoritesViewModel();
        },
        type: function(){
            return FavoritesViewModel;
        }
    }
});
