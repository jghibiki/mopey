define(["ko", "jquery", "authenticationManager", "chain"], function(ko, $, AuthenticationManagerModule, chain){

    function SearchViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false,
            authenticationManager: AuthenticationManagerModule.get()
        };

        self.query = ko.observable()
        self.searchResults = ko.observableArray()
        self.errorMessage = ko.observable()

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
                            $.ajax({
                                url: "http://api.mopey.ndacm.org/search/" + self.query(),
                                type: "GET",
                                dataType: "json",
                                headers:{'Authorization': self._.authenticationManager.token()},
                                success: function(response){next({"response": response});}
                            });
                        })
                    .cc(function(context,error,next){
                        if("Error" in context.response){
                            self.errorMessage(context.response.Error);
                        }
                        else{
                            self.searchResults(context.response);
                        }
                        next();
                    })
                    .end();
            }
        };

        self.hidden = function(){
            if(self._.shown){
                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.disposed){
                self._.authenticationManager.dispose();
                self._.authenticationManager = null;
                self._.disposed = true;
            }
        };

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
