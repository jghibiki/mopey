define(["ko", "chain", "nativeCommunicationManager"], function(ko, chain, NativeCommunicationManagerModule){

    function SearchViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            nativeCommunicationManager: NativeCommunicationManagerModule.get()
        };

        self.query = ko.observable();
        self.searchResults = ko.observableArray();
        self.errorMessage = ko.observable();
        self.searching = ko.observable(false);

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
                chain.get()
                    .cc(function(context, error, next){
                        self._.nativeCommunicationManager.sendNativeRequest(
                            self._.nativeCommunicationManager.endpoints.PLAYBACK_ADD_SONG,
                            function(response){
                                context.response = response
                                next(context);
                            },
                            null,
                            {"song": song.id}
                        );
                    })
                    .cc(function(context,error,next){
                        if("Error" in context.response){
                            alert(context.response.Error);
                        }
                        else{
                            self._.nativeCommunicationManager.sendNativeRequest(
                                self._.nativeCommunicationManager.endpoints.PLAYBACK_STATE,
                                function(response){
                                    context.response = response
                                    next(context);
                            });
                        }
                    })
                    .cc(function(context,error,next){
                        if("Error" in context.response){
                            alert(context.response.Error);
                            next();
                        }
                        else{
                            if(context.response.result !== "playing"){
                                self._.nativeCommunicationManager.sendNativeRequest(
                                    self._.nativeCommunicationManager.endpoints.PLAYBACK_PLAY,
                                    function(response){
                                        context.response = response
                                        next(context);
                                    });
                            }
                            else{
                                next();
                            }
                        }
                    })
                    .end();
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
