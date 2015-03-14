define(["ko","applicationState", "registrationState"], function(ko,applicationStateModule,registrationStateModule){

	function RegisterUserViewModel(){
		var self = this;
		self._ = {
			disposed: false,
			shown: false,
			data: null,
            request: null,
            serverError: "There was a problem with the server, please try again later.",
            usernameTakenError: "Username already taken, please choose another.",
            validUsername: null,

			applicationState: applicationStateModule.get(),
            registrationState: registrationStateModule.get(),
            apiUrlBase: null,
			checkIfShown: function(){
				if(self._.disposed){
                  throw new Error("This instance of RegisterUserViewModel has already been disposed!");
				}
			},
			validateUsername : function(){
                var emptyFieldError = "Username field is empty";
                if(self.username() === "") {
                    self._.addError(emptyFieldError);
					return false;
				} 
                else {
                    self._.removeError(emptyFieldError);
                }
                if(!(self._.validUsername === self.username())){
                    self._.request = $.ajax({
                        type: 'GET',
                        contentType: 'application/json',
                        dataType: 'json',
                        url: self._.apiUrlBase + '/users/username/' + self.username(),
                        error: function(){
                            self._.request = null;
                        }
                    }).done(function(data) {
                        if(typeof data.key === "number"){
                            self._.addError(self._.usernameTakenError);
                        }
                        else{
                            self._.removeError(self._.usernameTakenError);
                            self._.validUsername = self.username();
                        }
                        self._.request = null;
                    });
                }
                return true;
			},
			validatePassword : function(){
                var emptyFieldError = "Password field is empty";
                var minLengthError = "Passwords must be atleast 6 characters";
                var passwordMatchError = "Password field values do not match.";
				if(self.password() === "") {
                    self._.addError(emptyFieldError);
					return false;
                }
                else {
                    self._.removeError(emptyFieldError);
                }
                if(self.password().length < 6){
                    self._.addError(minLengthError);
					return false;
				} 
                else {
                    self._.removeError(minLengthError);
                }
                if(self.password() !== self.confirmPassword()){
                    self._.addError(passwordMatchError);
                    return false;
                }
                else{
                    self._.removeError(passwordMatchError);
                }
                return true;
			},
			validateEmail : function(){
                var emptyFieldError = "Email field is empty.";
                var invalidEmail = "Invalid email format.";
                var emailConfirmError = "Email fields do not match.";
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                
				if(self.email() === "") {
                    self._.addError(emptyFieldError);
					return false;
                }
                else { 
                    self._.removeError(emptyFieldError);
                }
                if(!re.test(self.email())){
                    self._.addError(invalidEmail);                 
                    return false;
                }
                else{
                    self._.removeError(invalidEmail);
                }
                if(!(self.email() === self.confirmEmail())){
                    self._.addError(emailConfirmError);     
                    return false;
                }
                else {
                    self._.removeError(emailConfirmError);
                }
                return true;
                
				
			},
			validateFirstName : function(){
                var emptyFieldError = "First name field is empty";
				if(self.firstName() === "") {
                    self._.addError(emptyFieldError);
					return false;
                }
                else{
                    self._.removeError(emptyFieldError);
                    return true;
                }
			},
			validateLastName : function(){
                var emptyFieldError = "Last name field is empty.";
				if(self.lastName() === "") {
                    self._.addError(emptyFieldError);
					return false;
				} 
                else {
                    self._.removeError(emptyFieldError);
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

        self.username = ko.observable("");
        self.password = ko.observable("");
        self.confirmPassword = ko.observable("");
        self.email = ko.observable("");
        self.confirmEmail = ko.observable("");
        self.firstName = ko.observable("");
        self.lastName = ko.observable("");
        self.error = ko.observableArray([]);

        self.validateUsername = ko.computed(self._.validateUsername) //.extend({rateLimit: {timeout: 0, method: "notifyWhenChangesStop"}});
        self.validatePassword = ko.computed(self._.validatePassword)
        self.validateEmail = ko.computed(self._.validateEmail)
        self.validateFirstName = ko.computed(self._.validateFirstName)
        self.validateLastName = ko.computed(self._.validateLastName)
        self.areThereErrors = ko.computed(function(){
            if(self.error().length > 0){
                return true;
            }
            else{
                return false;
            }
        });

		self.shown = function() {
			if(!self._.shown){
                self._.apiUrlBase = self._.applicationState.apiUrl();
                self._.applicationState.currentFlow("register");
                self._.applicationState.navigateLeftLink("");
                self._.applicationState.navigateRightLink("");
				self._.shown = true;
			}
		}

		self.hidden = function() {
			if(self._.shown){
				self._.shown = false;
			}
		}
		self.dispose = function() {
			if(!self._.disposed){
				self._.disposed = true;
			}
		}
		self.submit = function(){
			if(self._.validateUsername()
				&& self.validatePassword()
				&& self.validateEmail()
				&& self.validateFirstName()
				&& self.validateLastName()
                && self.error().length === 0) {
                while(self._.request !== null){/*busy wait*/}
                self._.request = $.ajax({
                    type: 'POST',
                    url: self._.applicationState.apiUrl() + "/users",
                    data: JSON.stringify({
                        userName: self.username(),
                        password: self.password(),
                        firstName: self.firstName(),
                        lastName: self.lastName(),
                        email: self.email(),
                        group: self._.registrationState.groupKey()
                    }),
                    dataType : 'json',
                    contentType: 'application/json'
                }).done(function(data){
                    if(data.Error === undefined)
                    {
                        self._.userkey = data.key;
                        self._.applicationState.currentRoute("#eventbrite");
                        location.window = self._.applicationState.clientUrl() + "/#eventbrite";
                    }
                    else {
                        self.errors([]);
                        self._.addError(data.Error);
                    }
                    self._.request = null;
                });
			}
		};
	}

	return {
		get: function(){
			return new RegisterUserViewModel();
		},
		type: function(){
			return RegisterUserViewModel;
		}
	};
});
