define(["ko"], function(ko){
    function AccountViewModel(){
        var self = this;

        self._ = {
            shown: false,
            disposed: false
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
            return new AccountViewModel();
        },
        type: function(){
            return AccountViewModel;
        }
    }
});
