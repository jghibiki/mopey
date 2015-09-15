define(["ko", "chain", "nativeCommunicationManager", "navigationManager"], function(ko, chain, NativeCommunicationManagerModule, NavigationManagerModule){

    function SearchViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            nativeCommunicationManager: NativeCommunicationManagerModule.get(),
            navigationManager: NavigationManagerModule.get()
        };

        self.query = ko.observable();
        self.searchResults = ko.observableArray();
        self.errorMessage = ko.observable();
        self.searching = ko.observable(false);
        self.loading = ko.observable(false);

        self.shown = function(){
            if(!self._.shown){
                self._.shown = true;

                parameters = location.hash.split("?")[1].split("&");

                for(var x=0; x<parameters.length; x++){

                    keyValuePair = parameters[x].split("=");
                    if (keyValuePair[0] === "q"){
                        self.query(keyValuePair[1]);
                        break;
                    }
                }
                
                self.errorMessage("");
                chain.get()
                    .cc(function(context, error, next){
                            self.searching(true);
                            self._.nativeCommunicationManager.sendNativeRequest(
                                self._.nativeCommunicationManager.endpoints.SEARCH,
                                function(response){
                                    next({"response": response})
                                },
                                {
                                    "q":self.query()
                                },
                                null);
                        })
                    .cc(function(context,error,next){
                        if("Error" in context.response){
                            self.errorMessage("Error: " + context.response.Error);
                        }
                        else{
                            self.searchResults(context.response);
                        }
                        self.searching(false);
                        next();
                    })
                    .end();
            }
        };

        self.hidden = function(){
            if(self._.shown){
                self._.shown = false;
                self.searchResults(null);
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self._.nativeCommunicationManager.dispose();
                self._.nativeCommunicationManager = null;
                self._.disposed = true;
            }
        };

        self.requestSong = function(song){
            self.errorMessage(null);

            self._.nativeCommunicationManager.sendNativeRequest(
                self._.nativeCommunicationManager.endpoints.CREATE_REQUEST,
                function(response){
                    if("Error" in response){
                        self.errorMessage("Error: " + response.Error); 
                    }
                    else{
                        alert("'" + song.title + "' requested!");
                        self._.navigationManager.setRoute("queue");
                    }
                },
                null,
                {
                    "song": song.id
                }
            );
        }

        self.favorite = function(song){
            chain.get()
                .cc(function(context, error, next){
                    self.errorMessage(null);
                    self.loading(true);
                    next()
                })
                .cc(function(context, error, next){
                    self._.nativeCommunicationManager.sendNativeRequest(
                        self._.nativeCommunicationManager.endpoints.ADD_FAVORITE,
                        function(response){
                            if("Error" in response){
                                self.errorMessage("Error: " + response.Error);
                            }
                            else{
                                alert("Successfully added " + song.title + "to favorites"); 
                                next()
                            }
                        },
                        null,
                        {
                            "youtubeKey": song.id, 
                            "title": song.title,
                            "description": song.description,
                            "thumbnail": song.thumbnail,
                            "uploader": song.uploader,
                        })
                })
                .end(null, function(){
                    self.loading(false)
                });
        }
    }

    return {
        get: function(){
            return new SearchViewModel();
        },
        type: function(){
            return SearchViewModel;
        }
    };

});
