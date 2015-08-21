from Models import *
from datetime import datetime
from flask import jsonify
import UserApi
import SearchApi
import json

def requestSong(json, headers):

    token = headers['Authorization']
    returnedUser = AccessToken.get(AccessToken.token == token).user

    song = json["song"]

    result = SearchApi.searchByKey(song)

    returnedRequest = Request.create(youtubeKey=song,
                   title = result["title"],
                   uploader = result["uploader"],
                   description = result["description"],
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
            "date": str(req.date),
            "user": req.user.username,
            "key": req.key
        })
    return json.dumps({"result": requests})

def removeRequest(key):
    try:
        Request.get(Request.key == key)
        Request.delete().where(Request.key == key).execute()
        return jsonify({"result": True})
    except:
        return jsonify({"Error": "Failed to remove request."})


def countRequests():
    count = Request.select().count()
    return jsonify({"result": count})
