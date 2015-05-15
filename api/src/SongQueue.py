from Models import *
from datetime import datetime
from flask import jsonify
import UserApi
import SearchApi
import json

def requestSong(json):
    user = json["userkey"]
    song = json["song"]
    data = {"key": song, "user": user}
    result = SearchApi.searchByKey(data["key"])
    returnedUser = UserApi.getUserDatabase(data["user"])
    returnedRequest = Request.create(youtubeKey=data["key"],
                   title=result["title"],
                   uploader=result["uploader"],
                   description=result["description"],
                   date=datetime.utcnow(),
                   user=returnedUser)
    return jsonify({"key":returnedRequest.key})

def getRequests():
    requests = []
    for req in Request.select().order_by(Request.date):
        requests.append({
            "title": req.title,
            "uploader": req.uploader,
            "youtubeKey": req.youtubeKey,
            "description": req.description,
            "date": str(req.date),
            "user": req.user.username,
            "key": req.key
        })
    return json.dumps(requests)

def removeRequest(key):
    try:
        Request.get(Request.key == key)
        Request.delete().where(Request.key == key).execute()
        return jsonify({"result": True})
    except:
        return jsonify({"result": False})


