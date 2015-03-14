from Models import *
from flask import jsonify
import hashlib
import UserApi
from GeneralApiException import GeneralApiException
from uuid import uuid4
from datetime import datetime, timedelta

def authentication(json):
    returnedUser = UserApi.getUserDatabase(json["username"])

    if(returnedUser == None):
        raise GeneralApiException("Invalid user name and password combination.", status_code=200)

    md5 = hashlib.md5()
    md5.update(json["password"])

    if(returnedUser.password != str(md5.hexdigest())):
        raise GeneralApiException("Invalid user name and password combination.", status_code=200)

    returnedAccessToken = AccessToken.create(token=str(uuid4()), expirationDate=datetime.utcnow() + timedelta(hours=1), user=returnedUser)

    payload = {"access_token" : returnedAccessToken.token, "expiration_date" : returnedAccessToken.expirationDate}

    return jsonify(payload)


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


def getAccessTokenDatabase(key):
    returnedAuth = None
    if(key == None):
        return 400
    try:
        returnedAuth = AccessToken.get(AccessToken.key == key)
    except:
        raise GeneralApiException("Error Authentication does not exist with key: " + key, status_code=200)

    return returnedAuth


