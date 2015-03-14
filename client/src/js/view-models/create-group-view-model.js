define(["ko", "jquery", "applicationState", "registrationState"], function(ko, $, applicationStateModule, registrationStateModule) {

	function GroupCreate() {
		var self = this;

		self._ = {
			dispose: false,
			shown: false,
			apiUrlBase: null,
			request: null,
			nameFeild: null,
            groupAlreadyExistsError : "Group name is already taken.",

			applicationState: applicationStateModule.get(),
            registrationState : registrationStateModule.get(),
			
			checkIfDisposed: function() {
				if(self._.dispose) {
					throw new Error("This instance of GroupCreate has already been disposed");
				}
			},

			validateName: function() {
				var emptyFieldError = "Name Field is empty";
                

				if(self.nameField() === "") {
					self._.addError(emptyFieldError);
					return false;
				} else {
					self._.removeError(emptyFieldError);
				}
				self._.request = $.ajax({
	 		   		type: 'GET',
			   		contentType: 'application/json',
			   		dataType: 'json',
			   		url: self._.apiUrlBase + '/groups/groupname/' + self.nameField(),
                    error: function(){
                        self._.request = null;
                    }
			   	}).done(function(data) {
                    if(typeof data.key === "number"){
                        self._.addError(self._.groupAlreadyExistsError);
                    }
                    else{
                        self._.removeError(self._.groupAlreadyExistsError);
                    }
                    self._.request = null;
                });
                return true;
			},

			addError: function(message){
                var index = self.error.indexOf(message);
                if(index === -1){
                    self.error.push(message);
                }
            },

            removeError: function(message){
                var index = self.error.indexOf(message);
                if(index !== -1){
                    self.error.remove(self.error()[index]);
                }
            },
		};

		self.nameField = ko.observable("");
		self.error = ko.observableArray([]).extend({rateLimit: {timeout: 500, method: "notifyWhenChangesStop"}});
		self.validateName = ko.computed(self._.validateName);

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
                self._.registrationState.dispose();
                self._.applicationState = null;
				self._.disposed = true;
			}
		};

		self.submit = function() {
			if(self.validateName()
                && self.error().length === 0) {
				$.ajax({
	 		   		type: 'POST',
			   		contentType: 'application/json',
			   		data: JSON.stringify({
                        name: self.nameField()
                    }),
			   		dataType: 'json',
			   		url: self._.apiUrlBase + '/groups'
			   	}).done(function(data) {
                    if(data.Error === undefined){
                        self._.registrationState.groupKey(data.key);
                        self._.applicationState.currentRoute("#register-user");
                        window.location = self._.applicationState.clientUrl() + "/#register-user";
                    }
                    else{
                        self._.addError(data.error);
                    }
                    self._.request = null;
			   	});
		   }
		};
	}

	return{
		get: function() {
			return new GroupCreate();
		},
		type: function() {
			return GroupCreate;
		}
	}

});
