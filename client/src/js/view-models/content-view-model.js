define(["ko", "applicationState", "navigationManager"], function(ko, applicationStateModule, navigationManagerModule){
    function ContentViewModel(){
        var self = this;

        self._={
            disposed: false,
            shown: false,
            applicationState : applicationStateModule.get(),
            NavigationManager: navigationManagerModule.get(),

            checkIfDisposed : function(){
                if(self._.disposed){
                    throw new Error("This instance of content view model is already disposd.");
                }
            }
        };

        self.subViewModel=null;
        self.viewModelLoaded = ko.observable(false);

        self.currentContentSubscription = self._.applicationState.currentContent.subscribe(function(newValue){
            if(typeof self.subViewModel === "object" && self.subViewModel !== null){
                self.subViewModel.hidden();
            }
            self.viewModelLoaded(false);
            require([newValue], function(newContentVM){
                self.subViewModel = newContentVM.get();
                if(typeof self.subViewModel.initalize === "function") {
                    self.subViewModel.initalize();
                }
                self.subViewModel.shown();
                self.viewModelLoaded(true);

            });
        });

        self.leftLink = ko.observable("");
        self.rightLink = ko.observable("");

        self.showLeftLink = ko.computed(function(){
            if(self.leftLink() === ""){
                return false;
            }
            else{
                return true;
            }
        });

        self.showRightLink = ko.computed(function(){
            if(self.rightLink() === ""){
                return false;
            }
            else{
                return true;
            }
        });
        
        self.leftLinkChangedSubscription = self._.applicationState.navigateLeftLink.subscribe(function(newValue){
            self.leftLink(newValue);
        });

        self.rightLinkChangedSubscription = self._.applicationState.navigateRightLink.subscribe(function(newValue){
            self.rightLink(newValue);
        });


        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown){
                self._.shown = true;
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
                self._.applicationState.dispose();
                self._.applicationState = null;

                self.currentContentSubscription.dipose();
                self.currentContentSubscription = null;

                self.leftLinkChangedSubscription.dipose();
                self.leftLinkChangedSubscription = null;

                self.rightLinkChangedSubscription.dipose();
                self.rightLinkChangedSubscription = null;

                self.showLeftLink = null;
                self.showRightLink = null;

                self.viewModelLoaded = null;

                self._.disposed = true;
            }
        };
        

    }
    
    return {
        get: function(){
            return new ContentViewModel();
        },
        type: function(){
            return ContentViewModel;
        }
    };
});
