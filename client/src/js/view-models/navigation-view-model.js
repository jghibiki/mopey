define(["ko", "jquery", "navigationManager"], function(ko, $, NavigationManagerModule) {

	function NavigationViewModel() {
		var self = this;

		self._ = {
			dispose: false,
			shown: false,
            navigationManager: NavigationManagerModule.get(),
			
			checkIfDisposed: function() {
				if(self._.dispose) {
					throw new Error("This instance of NavigationViewModel has already been disposed");
				}
			},
		};

        self.navOptions = ko.observableArray([]);

		self.shown = function() {
			self._.checkIfDisposed();
			if(!self._.shown) {

                self.navOptions(self._.navigationManager.getRoutes());

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

                self._.navigationManager.dispose();
                self._.navidationManager = null;

				self._.disposed = true;
			}
		};
	}

	return{
		get: function() {
			return new NavigationViewModel();
		},
		type: function() {
			return NavigationViewModel;
		}
	};

});
