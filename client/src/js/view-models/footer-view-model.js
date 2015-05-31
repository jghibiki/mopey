define(["ko"], function(ko){
    function FooterViewModel(){
        var self = this;

        self._={
            disposed: false,
            shown: false,
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
