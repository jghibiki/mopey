define(["ko", "jquery", "applicationState"], function(ko, $, applicationStateModule) {

	function Default() {
		var self = this;

		self._ = {
			dispose: false,
			shown: false,
			apiUrlBase: null,
			applicationState: applicationStateModule.get(),
			
			checkIfDisposed: function() {
				if(self._.dispose) {
					throw new Error("This instance of Default has already been disposed");
				}
			},
		};

		self.shown = function() {
			self._.checkIfDisposed();
			if(!self._.shown) {
                self._.apiUrlBase = self._.applicationState.apiUrl();
				self._.shown = true;
			}
		};

		self.hidden = function() {
			self._.checkIfDisposed();
			if(self._.shown) {
				self._.shown = false;
			}
		};

		self.dispose = function() {
			if(!self._.disposed) {
				self._.appDefaultlicationState.dispose();
				self._.applicationState = null;
				self._.disposed = true;
			}
		};
	}

	return{
		get: function() {
			return new Default();
		},
		type: function() {
			return Default;
		}
	}

});