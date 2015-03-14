define(["ko", "applicationState"], function(ko, applicationStateModule){
    function FooterViewModel(){
        var self = this;

        self._={
            disposed: false,
            shown: false,
            applicationState: applicationStateModule.get()
        };

        self.navItems = ko.observableArray([]);

        self.navItemsChangedSubscription = self._.applicationState.navItems.subscribe(function(newValue){

            var newNavItems = [];

            for(link in newValue){
                var tempObj = {"link":link, "name": newValue[link]["title"]};
                newNavItems.push(tempObj);
            }

            self.navItems(newNavItems);
        });

        self.shown = function(){
            if(!self._.shown){
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
                self._.applicationState.dispose();
                self._.applicationState = null;

                self.navItemsChangedSubscription.dispose();
                self.navItemsChangedSubscription = null;
                self.navItems = null;

                self._.disposed = true;
            }
        };
        

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
