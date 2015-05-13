from Models import *
from datetime import datetime
from flask import jsonify
import UserApi
import SearchApi
import json

def requestSong(data):
    result = SearchApi.searchByKey(data["key"])
    returnedUser = UserApi.getUserDatabase(data["user"])
    returnedRequest = Request.create(youtubeKey=data["key"],
                   title=result["title"],
                   uploader=result["uploader"],
                   description=result["description"],
                   time=datetime.utcnow(),
                   user=returnedUser)
    return jsonify({"key":returnedRequest.key})

def getRequests():
    requests = []
    for req in Request.select():
        requests.append({
            "tile": req.title,
            "uploader": req.uploader,
            "youtubeKey": req.youtubeKey,
            "description": req.description,
            "time": str(req.time),
            "user": req.user.username
        })
    return json.dumps(requests)

def removeFirstSong():
    queue.pop(0)

def Test():
    data = {"key": "F6BDvfgRF4s", "user": 2}
    return requestSong(data)

