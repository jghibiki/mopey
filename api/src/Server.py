from flask import Flask, request, abort, jsonify
from flask.ext.cors import CORS
from werkzeug.contrib.fixers import ProxyFix
from Models import *
import peewee
from uuid import uuid4
import hashlib
from nocache import nocache
from GeneralApiException import GeneralApiException
import UserApi
import AuthenticationApi
import SetUp
from SearchApi import youtubeSearch
from RegexApi import *
from ApiCalls import *


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

############
## Search ##
############

@app.route('/search/<string:query>', methods=["GET"])
@nocache
def Search(query):
    return youtubeSearch(query)

#############
## Regexes ##
#############

@app.route('/regex/<string:key>', methods=["GET"])
@nocache
def GetRegex(key):
    return getRegex(key)

@app.route('/regex', methods=["POST"])
@nocache
def AddRegex():
    """
    Example Request Object:
    {
        "pattern":"a*b*c*"
    }
    """
    return addRegex(request.json["pattern"])

@app.route('/regex', methods=["DELETE"])
@nocache
def RemoveRegex():
    """
    Example Request Objexts:
    {
        "key":"1234"
    }
    """
    return removeRegex(request.json["key"])

###############
## Api Calls ##
###############

@app.route('/song', methods=["POST"])
@nocache
def AddSong():
    song = request.json['song']
    return addSong(song)

@app.route('/song/play', methods=["GET"])
@nocache
def PlaySong():
    return playSong()

@app.route('/song/pause', methods=["GET"])
@nocache
def PauseSong():
    return pauseSong()

@app.route('/song/stop', methods=["GET"])
@nocache
def StopSong():
    return stopSong()

@app.route('/song/next', methods=["GET"])
@nocache
def NextSong():
    return nextSong()

@app.route('/song/clear', methods=["GET"])
@nocache
def ClearSongs():
    return clearSongs()

@app.route('/song/state', methods=["GET"])
@nocache
def GetState():
    return getState()



####################
## Build Database ##
####################

@app.route('/buildDb')
@nocache
def BuildDb():
    SetUp.main()
    return "Database rebuilt"


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
