define(["ko", "module", "jquery", "applicationState"], function(ko, module, $, applicationStateModule){
    
    function HomeViewModel(){
        var self = this;
        
        self._ = {
            dispose: false,
            shown: false,
            config: module.config(),
            timer: null,
            firstIteration: true,
            animationIndex: 0,
            animInOut: true,
            randomNum: 0,
            applicationState : applicationStateModule.get(),
            
            checkIfDisposed: function() {
                if(self._.dispose) {
                        throw new Error("This instance of HomeViewModel has already been disposed");
                }
            },
            
            animateText: function() {
                if(!self._.firstIteration) {
                    $("#animate-text").css("visibility", "hidden");
                    self.animatedText("");
                } else {
                    self._.firstIteration = false;
                }

                var text = self._.config["animatedText"][self._.animationIndex];

                if(self._.animInOut) {
                    self._.randomNum = Math.floor(Math.random() * self._.config["textAnimations"].length);
                    $("#animated-text").attr("class", "animated " + self._.config["textAnimations"][self._.randomNum][0]+ " jumboText");
                    self._.animInOut = false;
                } else {
                    self._.animationIndex++;
                    if(self._.animationIndex >= self._.config["animatedText"].length) {
                        self._.animationIndex = 0;
                    }
                    $("#animated-text").attr("class", "animated " + self._.config["textAnimations"][self._.randomNum][1] + " jumboText");
                    self._.animInOut = true;
                }

                self.animatedText(text);
                $("#animate-text").css("visibility", "visible");
            }
        }
        
        self.animatedText = ko.observable();

        self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown) {
                self._.applicationState.navigateRightLink("#conference");
                self._.applicationState.navigateLeftLink("");
                if(self._.applicationState.currentFlow() !== "main"){
                    self._.applicationState.currentFlow("main");
                }

                self._.animateText();
                self._.timer = setInterval(self._.animateText, 2000);
                self._.shown = true;
            }
        };

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown) {
                clearTimeout(self._.timer);
                self._.time = null;
                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.disposed) {
                self.animatedText = null;
                self._.disposed = true;
            }
        };
    }

    return{
        get: function(){
            return new HomeViewModel();
        },
        type: function(){
            return HomeViewModel;
        }
    };

});
