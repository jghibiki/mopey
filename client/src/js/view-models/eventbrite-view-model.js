define([], function() {

	function Default() {
		var self = this;

		self._ = {
			dispose: false,
			shown: false,
			apiUrlBase: null,
			
			checkIfDisposed: function() {
				if(self._.dispose) {
					throw new Error("This instance of Default has already been disposed");
				}
			},
		};

		self.shown = function() {
			self._.checkIfDisposed();
			if(!self._.shown) {
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
	};

});
