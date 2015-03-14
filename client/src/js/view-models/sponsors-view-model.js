define(["ko", "applicationState"], function(ko, applicationStateModule){

	function SponsorsViewModel() {
		var self = this;

		self._ = {
			applicationState : applicationStateModule.get(),
            sponsors: null,
            apiUrlBase: null,

			checkIfDisposed: function() {
                if(self._.dispose) {
                	throw new Error("This instance of SponsorsViewModel has already been disposed");
                }
            },

            displaySponsors: function() {
                $.get(self._.apiUrlBase + self.currentPage(), function(data){
                    self.sponsors(data["companys"]);
                    self.totalPages(data["pages"]);
                });
            },
		}

        self.sponsors = ko.observableArray([]);
        self.totalPages = ko.observable(1);
        self.currentPage = ko.observable(0);

        self.initialize = function() {
            self._.displaySponsors();
        }

		self.shown = function(){
            self._.checkIfDisposed();
            if(!self._.shown) {
            	self._.applicationState.navigateRightLink("");
            	self._.applicationState.navigateLeftLink("#schedule");
                self._.apiUrlBase = self._.applicationState.apiUrl();
                if(self._.applicationState.currentFlow() !== "main"){
                    self._.applicationState.currentFlow("main");
                }
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
            	self._.applicationState.dispose();
                self._.disposed = true;
            }
        };
	}

	return{
        get: function(){
            return new SponsorsViewModel();
        },
        type: function(){
            return SponsorsViewModel;
        }
	};

});
