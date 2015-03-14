define(["ko", "jquery", "applicationState"], function(ko, $, applicationStateModule) {

	function RegisterSponsor() {
		var self = this;

		self._ = {
			dispose: false,
			shown: false,
			nameFeild: null,
			representativeFeild: null,
			descriptionFeild: null,
			phoneNumberFeild: null,
			websiteFeild: null,
			applicationState: applicationStateModule.get(),
			apiUrlBase: null,
			textData: null,
			firstLoaded: false,

			checkIfDisposed: function() {
				if(self._.dispose) {
					throw new Error("This instance of RegisterSponsor has already been disposed");
				}
			},

			validateName: function() {
				var text = "Name Field is empty";
				if(self.nameField() === "" && self._.firstLoaded) {
					self._.addError(text);
					return false;
				} else {
					self._.removeError(text);
					return true;
				}
			},

			validateRepresentative: function() {
				var text = "Representative Field is empty";
				if(self.representativeField() === "" && self._.firstLoaded) {
					self._.addError(text);
					return false;
				} else {
					self._.removeError(text);
					return true;
				}
			},

			validateDescription: function() {
				var text = "Description Field is empty";
				if(self.descriptionField() === "" && self._.firstLoaded) {
					self._.addError(text);
					return false;
				} else {
					self._.removeError(text);
					return true;
				}
			},

			validatePhoneNumber: function() {
				var text = "Phone Number Field is empty";
				if(self.phoneNumberField() === ""&& self._.firstLoaded) {
					self._.addError(text);
					return false;
				} else {
					self._.removeError(text);
					return true;
				}
			},

			validateWebsite: function() {
				var text = "Website Field is empty";
				if(self.websiteField() === ""&& self._.firstLoaded) {
					self._.addError(text);
					return false;
				} else {
					self._.removeError(text);
					return true;
				}
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
		self.representativeField = ko.observable("");
		self.descriptionField = ko.observable("");
		self.phoneNumberField = ko.observable("");
		self.websiteField = ko.observable("");
		self.error = ko.observableArray([]);

		self.nameValidator = ko.computed(self._.validateName);
		self.representativeValidator = ko.computed(self._.validateRepresentative);
		self.descriptionValidator = ko.computed(self._.validateDescription);
		self.phoneNumberValidator = ko.computed(self._.validatePhoneNumber);
		self.websiteValidator = ko.computed(self._.validateWebsite);

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
				self._.applicationState.dispose();
				self._.applicationState = null;
				self._.disposed = true;
			}
		};

		self.submit = function() {
			self._.firstLoaded = true;
			if(self._.validateName() &&
			   self._.validateWebsite() &&
			   self._.validateDescription() &&
			   self._.validateRepresentative() &&
			   self._.validatePhoneNumber()) {
			   	$.ajax({
			   		type: 'POST',
			   		contentType: 'application/json',
			   		data: JSON.stringify({
					name: self.nameField(),
					representative: self.representativeField(),
					description: self.descriptionField(),
					phoneNumber: self.phoneNumberField(),
					website: self.websiteField()}),
			   		dataType: 'json',
			   		url: self._.apiUrlBase + '/company'
			   	}).done(function(data) {
			   		self._.applicationState.currentRoute("#sponsors");
			   	});
			}
		};

	}

	return{
		get: function() {
			return new RegisterSponsor();
		},
		type: function() {
			return RegisterSponsor;
		}
	};

});