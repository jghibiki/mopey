define(["ko", "jquery", "applicationState", "registrationState"], function(ko, $, applicationStateModule, registrationStateModule) {

	function GroupJoin() {
		var self = this;

		self._ = {
			dispose: false,
			shown: false,
			apiUrlBase: null,
			applicationState: applicationStateModule.get(),
            registrationState: registrationStateModule.get(),
            request : null,
			
			checkIfDisposed: function() {
				if(self._.dispose) {
					throw new Error("This instance of GroupJoin has already been disposed");
				}
			},
            getGroups: function(){
                if(self._.request === null && self._.apiUrlBase !== null){
                    self._.null  = $.ajax({
                        type: "GET",
                        url: self._.apiUrlBase + "/groups/" + self.currentPage(),
                        dataType: "json",
                        content: "application/json",
                        error: function(){self._.request=null;}
                    }).done(function(data){
                        if(data.Error === undefined){
                            self._.proccessData(data);
                        }
                        else{
                            self.errors([]);
                            self._.addError(data.Error);
                        }
                    });
                }
            },
            hasPreviousPage : function(){
                if(self.previousPage() < 0){
                    return false;
                }
                else{
                    return true;
                }
            },
            hasNextPage : function(){
                if(self.previousPage() > self.totalPages()){
                    return false;
                }
                else{
                    return true;
                }
            },
            previousPage: function(){
                return self.currentPage() -1;
            },
            nextPage: function(){
                return self.currentPage() +1;
            },
            proccessData: function(data){
                var groups = [];
                for(var key in data.groups){
                    groups.push({
                        "name": data.groups[key].name, 
                        "members": data.groups[key].members
                    });
                }

                self.groups(groups);
                self.totalPages(data.pages);
            },
		};

        self.groups = ko.observableArray([]);
        self.currentPage = ko.observable(0);
        self.totalPages = ko.observableArray(0);
        self.error = ko.observableArray([]);

        self.previousPage = ko.computed(self._.previousPage);
        self.nextPage = ko.computed(self._.nextPage);

        self.hasPreviousPage = ko.computed(self._.hasPreviousPage);
        self.hasNextPage = ko.computed(self._.hasNextPage);


        self.currentPageChanged = ko.computed(self._.updateCurrentPage);

		self.shown = function() {
			self._.checkIfDisposed();
			if(!self._.shown) {
                self._.apiUrlBase = self._.applicationState.apiUrl();
                
                self._.getGroups();

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
				self._.applicationState.dispose();
				self._.applicationState = null;
                self._.registrationState.dispose();
                self._.registrationState = null;
				self._.disposed = true;
			}
		};
        
        self.updateCurrentPage = function(page){
            self.currentPage(page);
            self._.getGroups();
        };
	}

	return{
		get: function() {
			return new GroupJoin();
		},
		type: function() {
			return GroupJoin;
		}
	}

});
