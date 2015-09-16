from Models import *
from datetime import datetime
from flask import jsonify
import UserApi
import SearchApi
import json
import re

def requestSong(json, headers):

    token = headers['Authorization']
    returnedUser = AccessToken.get(AccessToken.token == token).user

    song = json["song"]

    result = SearchApi.searchByKey(song)

    for regex in Regex.select():
        if re.search(regex.pattern, result["title"]):
            return jsonify({"Error": "Search request for '" + result["title"] + "' has been denied, requested query failed to pass acceptance testing."})

    returnedRequest = Request.create(youtubeKey=song,
                   title = result["title"],
                   uploader = result["uploader"],
                   description = result["description"],
                   thumbnail = result["thumbnail"],
                   date = datetime.utcnow(),
                   user = returnedUser)

    return jsonify({"key":returnedRequest.key})


def getRequests(page):
    requests = []
    for req in Request.select().order_by(Request.date).paginate(page, 10):
        requests.append({
            "title": req.title,
            "uploader": req.uploader,
            "youtubeKey": req.youtubeKey,
            "description": req.description,
            "thumbnail": req.thumbnail,
            "date": str(req.date),
            "user": req.user.key,
            "key": req.key
        })
    return json.dumps({"result": requests})

def removeRequest(key):
    try:
        Request.get(Request.key == key)
        Request.delete().where(Request.key == key).execute()
        return jsonify({"result": None})
    except:
        return jsonify({"Error": "Failed to remove request."})


def countRequests():
    count = Request.select().count()
    return jsonify({"result": count})

def getCurrentRequest():
    request = None

    try:
        request = CurrentRequest.select().where(CurrentRequest.key != None).first()

    except:
        return jsonify({"Error": "Failed to get current request."})

    if request:
        resp = {
            "title": request.title,
            "uploader": request.uploader,
            "youtubeKey": request.youtubeKey,
            "description": request.description,
            "thumbnail": request.thumbnail,
            "date": request.date,
            "user": request.user.key,
            "key": request.key
        }

        return jsonify({"result": resp})
    else:
        return jsonify({"result": None})


def setCurrentRequest(json):

    currentRequest = None
    try:
        currentRequest = CurrentRequest.get(CurrentRequest.key != None)
    except:
        pass

    if currentRequest is None:

        returnedUser = User.get(User.key == int(json["user"]))

        newRequest = CurrentRequest.create(
            youtubeKey=json["youtubeKey"],
            title=json["title"],
            uploader=json["uploader"],
            description=json["description"],
            thumbnail=json["thumbnail"],
            date=datetime.utcnow(),
            user=returnedUser
        )
        return jsonify({"result": newRequest.key})
    else:
        return jsonify({"Error": "There is already another song listed as the current song."})


def deleteCurrentRequest():
    currentRequest = CurrentRequest.select().where(CurrentRequest.key != None).first()

    try:
        currentRequest.delete_instance()
        return jsonify({"return": None})
    except:
        return jsonify({"Error": "Failed to delete current request"})
