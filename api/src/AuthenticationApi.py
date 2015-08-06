from Models import *
from flask import jsonify, request, make_response
import hashlib
import UserApi
from GeneralApiException import GeneralApiException
from uuid import uuid4
from datetime import datetime, timedelta
from functools import wraps, update_wrapper

def authentication(json):
    username = json["username"]
    password = json["password"]
    if username is None or username is "":
        return GeneralApiException("Bad request", status_code=400)
    if password is None or password is "":
        return GeneralApiException("Bad request", status_code=400)

    returnedUser = None
    try:
        returnedUser = User.get(User.username == username)
    except:
        try:
            returnedUser = User.get(User.email == username)
        except:
            returnedUser = None

    if(returnedUser == None):
        raise GeneralApiException("Invalid user name and password combination.", status_code=200)

    return returnedUser
    if(returnedUser == None):
        raise GeneralApiException("Invalid user name and password combination.", status_code=200)

    md5 = hashlib.md5(password).hexdigest()
    if(returnedUser.password != str(md5)):
        raise GeneralApiException("Invalid user name and password combination.", status_code=200)

    # Issue the new token
    returnedAccessToken = AccessToken.create(token=str(uuid4()), expirationDate=datetime.utcnow() + timedelta(hours=1), user=returnedUser)

    payload = {"access_token" : returnedAccessToken.token, "expiration_date" : returnedAccessToken.expirationDate}
    return jsonify(payload)


def getAccessTokenDatabase(key):
    returnedAuth = None
    if(key == None):
        return GeneralApiException("Bad request", status_code=400)
    try:
        returnedAuth = AccessToken.get(AccessToken.key == key)
    except:
        raise GeneralApiException("Error Authentication does not exist with key: " + key, status_code=200)

    return returnedAuth


def validateAuthToken(token, isAdmin=False):
    if token is None:
        return False

    realToken = None
    try:
        realToken = AccessToken.get(AccessToken.token == token)
    except:
        return False

    if(realToken.expirationDate < datetime.utcnow()):
        return False

    if isAdmin:
        try:
            Admin.get(Admin.user == realToken.user)
        except:
            return False

    return True  # returning means that we have a valid token


def requireAuth(view):
    @wraps(view)
    def require_auth(*args, **kwargs):
        token = None
        try:
            token = request.headers['Authorization']
        except:
            raise GeneralApiException("Access denied", status_code=200)

        if not validateAuthToken(token, True):
            raise GeneralApiException("Access denied", status_code=200)

        return view(*args, **kwargs)
    return require_auth


def requireAdmin(view):
    @wraps(view)
    def require_auth(*args, **kwargs):
        token = None
        try:
            token = request.headers['Authorization']
        except:
            raise GeneralApiException("Access denied", status_code=200)

        if not validateAuthToken(token, True):
            raise GeneralApiException("Access denied", status_code=200)

        return view(*args, **kwargs)
    return require_auth
