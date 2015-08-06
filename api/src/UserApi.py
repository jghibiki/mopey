from GeneralApiException import GeneralApiException
from flask import jsonify
import hashlib
from Models import *
from AuthenticationApi import *

####################
## Public Methods ##
####################

def editUser(json):
    returnedUser = getUserDatabase(json["user"])
    AuthenticationApi.validateUserAuthentication(returnedUser, json["access_token"])

    returnedUser.password = json["password"]
    returnedUser.firstName = json["firstName"]
    returnedUser.lastName = json["lastName"]
    returnedUser.email = json["email"]
    returnedUser.karma = json["karma"]
    returnedUser.strikes = json["strikes"]

    saveUser(returnedUser)

    return jsonify({"Success":"Changed user with " + str(returnedUser.key)})


def createUser(json):
    returnedUser = None

    try:
        md5 = hashlib.md5(json["password"])
    except:
        return jsonify({"Error": "failed to hash password"})

    try:
        returnedUser = User.create(
                username = json["username"],
                password = md5.hexdigest(),
                firstName = json["firstName"],
                lastName = json["lastName"],
                email = json["email"],
                karma = 0,
                strikes = 0
                )

    except Exception,e:
        return jsonify({"Error":"Failed to create user. error: " + str(e)})

    return jsonify({"key":returnedUser.key})


def getUser(key):
    returnedUser = getUserDatabase(key)
    return jsonify({
            "username" : returnedUser.username,
            "firstName" : returnedUser.firstName,
            "lastName" : returnedUser.lastName,
            "email" : returnedUser.email,
            "karma" : returnedUser.karma,
            "strikes" : returnedUser.strikes
            })


def getUserKarma(key):
    returnedUser = getUserDatabase(key)
    return jsonify({"karma" : returnedUser.karma})


def setUserKarma(key, json):
    returnedUser = getUserDatabase(key)
    returnedUser.karma = json["karma"]
    saveUser(returnedUser)
    return jsonify({'result': returnedUser.karma})


def banUser(key):
    returnedUser = getUserDatabase(key)
    returnedUser.strikes = 3
    saveUser(returnedUser)
    return jsonify({'result': returnedUser.strikes})


def unbanUser(key):
    returnedUser = getUserDatabase(key)
    returnedUser.strikes = 0
    saveUser(returnedUser)
    return jsonify({'result': returnedUser.strikes})


def upVote(key):
    returnedUser = getUserDatabase(key)
    returnedUser.karma += 1
    saveUser(returnedUser)
    return jsonify({'result': returnedUser.karma})


def downVote(key):
    returnedUser = getUserDatabase(key)
    returnedUser.karma -= 1
    saveUser(returnedUser)
    return jsonify({'result': returnedUser.karma})


#####################
## Private Methods ##
#####################

def getUserDatabase(key):
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


def getUserEmailDatabase(key):
    returnedUser = getUserDatabase(key)
    return returnedUser.email


def saveUser(user):
    try:
        user.save()
    except:
        raise GeneralApiException("Failed to save user", status_code=405)