####################
## Public Methods ##
####################

def _editUser(request):
    returnedUser = __getUserDatabase(request.json["user"])
    __validateUserAuthentication(returnedUser, request.json["access_token"])

    returnedUser.password = request.json["password"]
    returnedUser.firstName = request.json["firstName"]
    returnedUser.lastName = request.json["lastName"]
    returnedUser.email = request.json["email"]

    try:
        returnedUser.save()
    except:
        raise GeneralApiException("Failed to save user", status_code=405)

    returnedUser.save()

    return {"Success":"Changed user with " + str(returnedUser.key)}


def _createUser(request):
    returnedUser = None

    try:
        md5 = hashlib.md5()
        md5.update(request.json["password"])
    except:
        return jsonify({"Error": "failed to hash password"})

    try:
        returnedUser = User.create(
                userName=request.json["userName"],
                password=md5.hexdigest(),
                firstName=request.json["firstName"],
                lastName=request.json["lastName"],
                email=request.json["email"],
                group=returnedGroup,
                registrationDate=datetime.utcnow())

    except Exception,e:
        return jsonify({"Error":"Failed to create user. error: "+ str(e)})

    return {"key":returnedUser.key}



def _getUser(request):
    returnedUser = getUserDatabase(key)
    return {
            "userName":returnedUser.userName,
            "firstName":returnedUser.firstName,
            "lastName":returnedUser.lastName,
            "email":returnedUser.email,
            "group":returnedUser.group.key
            }


#####################
## Private Methods ##
#####################

def __getUserDatabase(key):
    returnedUser = None
    if(key == None):
        return 400
    try:
        returnedUser = User.get(User.key == key)
    except:
        try:
            returnedUser = User.get(User.username == key)
        except:
            try:
                returnedUser = User.get(User.email == key)
            except:
                returnedUser = None

    if(returnedUser == None):
        raise GeneralApiException("Error User does not exist", status_code=200)

    return returnedUser


def __getUserEmailDatabase(key):
    returnedUser = getUserDatabase(key)
    return jsonify(returnedUser.email)


def __getAccessTokenDatabase(key):
    returnedAuth = None
    if(key == None):
        return 400
    try:
        returnedAuth = AccessToken.get(AccessToken.key == key)
    except:
        raise GeneralApiException("Error Authentication does not exist with key: " + key, status_code=200)

    return returnedAuth


def __validateUserAuthentication(returnedUser, accessTokenPassed):
    validAccessToken = False

    for access_token in returnedUser.accessTokens:
        if(accessTokenPassed == access_token.token):
            if(access_token.expirationDate > datetime.utcnow()):
               validAccessToken = True
               break

    if(validAccessToken == False):
        raise GeneralApiException("Authentication error", status_code=200)

    return
