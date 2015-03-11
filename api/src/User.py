def getUserDatabase(key):
    returnedUser = None
    if(key == None):
        return 400
    try:
        returnedUser = User.get(User.key == key)
    except:
        try:
            returnedUser = User.get(User.userName == key)
        except:
            try:
                returnedUser = User.get(User.email == key)
            except:
                returnedUser = None

    if(returnedUser == None):
        raise GeneralApiException("Error User does not exist", status_code=200)

    return returnedUser


def getUserEmailDatabase(key):
    returnedUser = getUserDatabase(key)
    return jsonify(returnedUser.email)


def getAccessTokenDatabase(key):
    returnedAuth = None
    if(key == None):
        return 400
    try:
        returnedAuth = AccessToken.get(AccessToken.key == key)
    except:
        raise GeneralApiException("Error Authentication does not exist with key: " + key, status_code=200)

    return returnedAuth


def validateUserAuthentication(returnedUser, accessTokenPassed):
    validAccessToken = False

    for access_token in returnedUser.accessTokens:
        if(accessTokenPassed == access_token.token):
            if(access_token.expirationDate > datetime.utcnow()):
               validAccessToken = True
               break

    if(validAccessToken == False):
        raise GeneralApiException("Authentication error", status_code=200)

    return
