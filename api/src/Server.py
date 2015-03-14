from flask import Flask, request, abort, jsonify
from flask.ext.cors import CORS
from werkzeug.contrib.fixers import ProxyFix
from Models import *
import peewee
from datetime import datetime, timedelta
from uuid import uuid4
import hashlib
from nocache import nocache
from GeneralApiException import GeneralApiException
import UserApi
import AuthenticationApi


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


@app.errorhandler(GeneralApiException)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = 200
    return response


###########
## Users ##
###########

@app.route('/users/<string:key>')
@nocache
def getUser(key):
    return UserApi.getUser(key)


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
    return UserApi.createUser(request.json)


@app.route('/users/editUser', methods=["POST"])
@nocache
def EditUser():
    return UserApi.editUser(request.json)


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
    return AuthenticationApi.authentication(request.json)

####################
## Build Database ##
####################

@app.route('/buildDb')
@nocache
def BuildDb():
    tables = [
        User,
        AccessToken,
        Admin
        ]
    db.drop_tables(tables, safe=True)
    db.create_tables(tables, safe=True)
    return "Database rebuilt"


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
