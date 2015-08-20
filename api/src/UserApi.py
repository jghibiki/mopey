from GeneralApiException import GeneralApiException
from flask import jsonify
import hashlib
from Models import *

####################
## Public Methods ##
####################

def editUser(key, json):
    returnedUser = getUserDatabase(key)

    if "firstName" in json:
        returnedUser.firstName = json["firstName"]
    if "lastName" in json:
        returnedUser.lastName = json["lastName"]
    if "email" in json:
        returnedUser.email = json["email"]
    if "password" in json:
        returnedUser.password = json["password"]

    if(Admin.select().where(Admin.user == returnedUser).exists()):
        if "karma" in json:
            returnedUser.karma = json["karma"]
        if "strikes" in json:
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

def getUsers(page):
    returnedUsers = []
    for x in User.select().order_by(User.key).paginate(int(page)+1, 10):
        y = {}
        y["key"] = x.key
        y["username"] = x.username
        y["firstName"] = x.firstName
        y["lastName"] = x.lastName
        y["email"] = x.email
        y["karma"] = x.karma
        y["strikes"] = x.strikes
        returnedUsers.append(y)

    return jsonify({"result": returnedUsers})

def countUsers():
    count = User.select().count()
    return jsonify({"result" : count})


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
        raise GeneralApiException("User does not exist", status_code=200)

    return returnedUser


def getUserEmailDatabase(key):
    returnedUser = getUserDatabase(key)
    return returnedUser.email


def saveUser(user):
    try:
        user.save()
    except:
        raise GeneralApiException("Failed to save user", status_code=405)
