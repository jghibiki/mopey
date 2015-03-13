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
from GeneralApiHandler import GeneralApiException

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
    response.status_code = 200
    return response


###########
## Users ##
###########

@app.route('/users/<string:key>')
@nocache
def getUser(key):
    return jsonify(_getUser(request))



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
    return jsonify(_createUser(request))


@app.route('/users/editUser', methods=["POST"])
@nocache
def EditUser():
    return jsonify(_editUser(request))


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
    return  jsonify(_authentication(request))

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
