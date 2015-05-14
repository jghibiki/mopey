define(["contentService", "underscore"], function(ContentServiceModule, _){

    function ContentManager(){
        var self = this;

        self._ = {
            disposed: false,

            contentService: ContentServiceModule.get(),

            checkIfDisposed: function(){
                if(!self._.disposed){
                    throw new Error("Content Manager is disposed.");
                }
            }
        };

        self.scheduleLoad = function(context, error, next){
            self._.contentService.scheduleLoad(context);
            next(context);
        };

        self.saveVM = function(viewModelName,viewModel){
            if(self._.contentService.loadedVMs[viewModelName] === undefined){
                self._.contentService.loadedVMs[viewModelName] = viewModel;
            }
        }

        self.dispose = function(){
            if(!self._.disposed){
                self._.contentService.dispose();
                self._.contentService = null;
                self._.disposed = false;
            };
        };
    }
    return{
        get: function(){
            return new ContentManager();
        },
        type: function(){
            return ContentManager;
        }
    };

});
