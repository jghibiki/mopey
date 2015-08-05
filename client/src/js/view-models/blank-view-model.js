define(function(){
    function BlankViewModel(){
        var self = this;

        self.shown = function(){}
        self.hidden = function(){}
        self.dispose = function(){}
    }

    return{
        get: function(){
            return new BlankViewModel();
        },
        type: function(){
            return BlankViewModel;
        }
    };
});
