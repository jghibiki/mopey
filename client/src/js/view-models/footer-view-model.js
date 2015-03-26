define(["ko", "applicationState"], function(ko, applicationStateModule){
    function FooterViewModel(){
        var self = this;

        self._={
            disposed: false,
            shown: false,
            applicationState: applicationStateModule.get()
        };

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
