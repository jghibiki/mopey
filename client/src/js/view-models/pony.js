define(["ko", "applicationState"], function(ko, applicationStateModule){

	function Pony() {
		var self = this;

		self._ = {
            dispose: false,
            shown: false,
            applicationState: applicationStateModule.get(),
            clientUrlBase: null,
            
			checkIfDisposed: function() {
                if(self._.dispose) {
                	throw new Error("This instance of the Pony has already been disposed");
                }
            },
		}

		self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown) {
                self._.clientUrlBase = self._.applicationState.clientUrl();
                var css = document.getElementById("cssSwap");
                css.href = "pony-css/screen.css";
                window.location =  self._.clientUrlBase + "/#home";
                self._.shown = true;
            }
        };

        self.hidden = function(){
            self._.checkIfDisposed();
            if(self._.shown) {
                self._.shown = false;
            }
        };

        self.dispose = function(){
            if(!self._.disposed) {
                self._.disposed = true;
            }
        };
	}

	return{
        get: function(){
            return new Pony();
        },
        type: function(){
            return Pony;
        }
	};

});
