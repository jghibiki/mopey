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
from AuthenticationApi import *
import SetUp
from SearchApi import youtubeSearch
from RegexApi import *
from SongQueue import *
from SongApi import *


##################
## Server SetUp ##
##################

db = peewee.PostgresqlDatabase('postgres', host='db', user='postgres')
app = Flask(__name__)
app.wsgi_app = ProxyFix(app.wsgi_app)
CORS(app, headers=['Content-Type, Authorization'])
app.hasSetConsume = False # a bool to set consome songs the first time an add song request is made


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


@app.route('/user', methods=["POST"])
@nocache
@requireAdmin
def CreateUser():
    """
    {
        "username":"jdoe"
        "password":"boi",
        "firstName":"john",
        "lastName": "doe",
        "email": "jdoe@jdoe.com",
    }

    Requires admin authentication
    """
    return UserApi.createUser(request.json)


@app.route('/user/<string:key>/edit', methods=["POST"])
@nocache
@requireAdmin
def EditUser(key):
    """
    Requires authentication
    """
    return UserApi.editUser(key, request.json)


@app.route('/karma/<string:key>', methods=["GET"])
@nocache
@requireAuth
def GetUserKarma(key):
    """
    Requires authentication
    """
    return UserApi.getUserKarma(key)


@app.route('/karma/<string:key>', methods=["POST"])
@nocache
@requireAdmin
def SetUserKarma(key):
    """
    Requires authentication
    """
    return UserApi.setUserKarma(key, request.json)


@app.route('/user/upvote/<string:key>', methods=["POST"])
@nocache
@requireAuth
def UpVoteUser(key):
    """
    Requires authentication
    """
    return UserApi.upVote(key)


@app.route('/user/downvote/<string:key>', methods=["POST"])
@nocache
@requireAuth
def DownVoteUser(key):
    """
    Requires authentication
    """
    return UserApi.downVote(key)


@app.route('/user/<string:key>/ban', methods=["GET"])
@nocache
@requireAdmin
def BanUser(key):
    """
    Requires authentication
    """
    return UserApi.banUser(key)


@app.route('/user/<string:key>/unban', methods=["GET"])
@nocache
@requireAdmin
def UnbanUser(key):
    """
    Requires authentication
    """
    return UserApi.unbanUser(key)


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
    return authentication(request.json)

@app.route('/authenticate/verify', methods=["POST"])
@nocache
def VerifyToken():
    """
    {
    Verifies that a user token is valid.

    Example Call:

        "token": "83f72e63-2e9a-4bba-9b1f-f386f0c633c7"
    }
    """
    return jsonify({'result': validateAuthToken(request.json["token"], False)})


@app.route('/authenticate/verify/admin', methods=["POST"])
@nocache
def VerifyAdminToken():
    """
    {
    Verifies that a user token is a valid admin token.

    Example Call:

        "token": "83f72e63-2e9a-4bba-9b1f-f386f0c633c7"
    }
    """
    return jsonify({'result': validateAuthToken(request.json["token"], True)})

############
## Search ##
############

@app.route('/search/<string:query>', methods=["GET"])
@nocache
@requireAuth
def Search(query):
    """
    Requires authentication
    """
    return youtubeSearch(query)

#############
## Regexes ##
#############


@app.route('/regex/<string:page>', methods=["GET"])
@nocache
@requireAdmin
def GetRegex(page):
    """
    Requires authentication
    """
    return getRegex(page)


@app.route('/regex', methods=["POST"])
@nocache
@requireAdmin
def AddRegex():
    """
    Example Request Object:
    {
        "pattern":"a*b*c*"
    }
    Requires admin authentication
    """
    regex = addRegex(request.json["pattern"])
    return regex


@app.route('/regex', methods=["DELETE"])
@nocache
@requireAdmin
def RemoveRegex():
    """
    Example Request Objexts:
    {
        "key":"1234"
    }
    Require admin authentication
    """
    return removeRegex(request.json["key"])

###############
## Api Calls ##
###############


@app.route('/playback/add', methods=["POST"])
@nocache
@requireAuth #<- temp permissions should requireAdmin
def AddSong():
    """
    Requires Auth
    """
    song = request.json['song']
    if not app.hasSetConsume:
        setConsume()
        app.hasSetConsume = True

    return addSong(song)

@app.route('/playback/play', methods=["GET"])
@nocache
#@requireAdmin <- permissions for final version
@requireAuth #<- temp permissions
def PlaySong():
    """
    Requires Admin Authentication
    """
    return playSong()

@app.route('/playback/pause', methods=["GET"])
@nocache
#@requireAdmin
def PauseSong():
    """
    Requires Admin Authentication
    """
    return pauseSong()

@app.route('/playback/stop', methods=["GET"])
@nocache
@requireAdmin
def StopSong():
    """
    Requires Admin Authentication
    """
    return stopSong()

@app.route('/playback/next', methods=["GET"])
@nocache
@requireAdmin
def NextSong():
    """
    Requires Admin Authenciation
    """
    return nextSong()

@app.route('/playback/clear', methods=["GET"])
@nocache
@requireAdmin
def ClearSongs():
    """
    Requires Admin Authentication
    """
    return clearSongs()

@app.route('/playback/list', methods=["GET"])
@nocache
@requireAdmin
def GetTracks():
    """
    Require Admin Authentication
    """
    return getTracks()

@app.route('/playback/state', methods=["GET"])
@nocache
#@requireAdmin
def GetState():
    """
    Require Admin Authentication
    """
    return getState()

@app.route('/volume/up', methods=["GET"])
@nocache
#@requireAdmin
def IncreaseVolume():
    """
    Require Admin Authentication
    """
    return increaseVolume()

@app.route('/volume/down', methods=["GET"])
@nocache
#@requireAdmin
def DecreaseVolume():
    """
    Require Admin Authentication
    """
    return decreaseVolume()

@app.route('/volume', methods=["GET"])
@nocache
#@requireAdmin
def GetVolume():
    """
    Require Admin Authentication
    """
    return jsonify(getVolume())

@app.route('/volume', methods=["POST"])
@nocache
#@requireAdmin
def SetVolume():
    """
    Require Admin Authentication
    """
    return jsonify(setVolume(request.json["key"]))

@app.route('/queue', methods=["GET"])
@nocache
#@requireAdmin
def GetRequests():
    """
    Require Admin Authentication
    """
    return getRequests()

@app.route('/queue', methods=["DELETE"])
@nocache
#@requireAdmin
def RemoveRequest():
    """
    Require Admin Authentication
    """
    return removeRequest(request.json["key"])

@app.route('/queue', methods=["POST"])
@nocache
#@requireAdmin
def AddRequest():
    """
    Require Admin Authentication
    """
    return requestSong(request.json)


####################
## Build Database ##
####################

@app.route('/buildDb')
@nocache
#@requireAdmin
def BuildDb():
    """
    Requires Admin Authentication
    """
    SetUp.main()
    return "Database rebuilt"


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)

