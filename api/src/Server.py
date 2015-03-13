from flask import Flask, jsonify, request, abort
from flask.ext.cors import CORS
from werkzeug.contrib.fixers import ProxyFix
from Models import *
import peewee
from datetime import datetime, timedelta
from uuid import uuid4
import hashlib
from nocache import nocache
from User import *

##################
## Server SetUp ##
##################

db = peewee.PostgresqlDatabase('postgres', host='db', user='postgres')
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)
CORS(app, headers=['Content-Type'])

####################
## Errror Handler ##
####################

class GeneralApiException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['Error'] = self.message
        return rv


@app.errorhandler(GeneralApiException)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

###########
## Users ##
###########

@app.route('/users/<int:key>')
@nocache
def getUser(key):
    returnedUser = getUserDatabase(key)
    return jsonify({"username":returnedUser.username, "firstName":returnedUser.firstName, "lastName":returnedUser.lastName, "email":returnedUser.email, "karma":returnedUser.karma, "strikes":returnedUser.strikes})


@app.route('/users/username/<string:key>')
@nocache
def getUsername(key):
    user = getUserDatabase(key)
    return jsonify({"key": user.key})


@app.route('/users', methods=["POST"])
@nocache
def CreateUser():
    """
    {
        "username":"jdoe"
        "password":"boi",
        "firstName":"john",
        "lastName": "doe",
        "email": "jdoe@jdoe.com",
        "karma": "0",
        "strikes": "0"
    }
    """
    returnedUser = None

    try:
        md5 = hashlib.md5()
        md5.update(request.json["password"])
    except:
        return jsonify({"Error": "failed to hash password"})

    try:
        returnedUser = User.create(username=request.json["username"], password=md5.hexdigest(), firstName=request.json["firstName"], lastName=request.json["lastName"], email=request.json["email"], karma=request.json["karma"], strikes=request.json["strikes"])
    except Exception,e:
        return jsonify({"Error":"Failed to create user. error: "+ str(e)})

    return jsonify({"key":returnedUser.key})


@app.route('/users/editUser', methods=["POST"])
@nocache
def EditUser():
    returnedUser = getUserDatabase(request.json["user"])
    validateUserAuthentication(returnedUser, request.json["access_token"])

    returnedUser.password = request.json["password"]
    returnedUser.firstName = request.json["firstName"]
    returnedUser.lastName = request.json["lastName"]
    returnedUser.email = request.json["email"]
    returnedUser.karma = request.json["karma"]
    returnedUser.strikes = request.json["strikes"]

    try:
        returnedUser.save()
    except:
        raise GeneralApiException("Failed to save user", status_code=405)

    returnedUser.save()
    return jsonify({"Success":"Changed user with " + str(returnedUser.key)})


####################
## Authentication ##
####################

@app.route('/authenticate', methods=["POST"])
@nocache
def Authentication():
    """
    {
        "username":"jdoe",
        "password":"boi",
    }
    """
    returnedUser = getUserDatabase(request.json["username"])
    #return returnedUserpage

    if(returnedUser == None):
        raise GeneralApiException("Invalid user name and password combination.", status_code=400)

    md5 = hashlib.md5()
    md5.update(request.json["password"])

    if(returnedUser.password != str(md5.hexdigest())):
        raise GeneralApiException("Invalid user name and password combination.", status_code=400)

    returnedAccessToken = AccessToken.create(token=str(uuid4()), expirationDate=datetime.utcnow() + timedelta(hours=1), user=returnedUser)

    payload = {"access_token" : returnedAccessToken.token, "expiration_date" : returnedAccessToken.expirationDate}

    return jsonify(payload)

####################
## Build Database ##
####################

@app.route('/buildDb')
@nocache
def BuildDb():
    tables = [
        User,
        AccessToken
        ]
    db.drop_tables(tables, safe=True)
    db.create_tables(tables, safe=True)
    return "Database rebuilt"


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
