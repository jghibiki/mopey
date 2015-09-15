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

    for regex in Regex.select():
        if re.search(regex.pattern, result["title"]):
            raise GeneralApiException("Search request for query='" + query + "' has been denied, requested query failed to pass acceptance testing.")

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
    request = CurrentRequest.first(Request.key != None)

    try:
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

    except:
        return jsonify({"Error": "Failed to get current request."})

def setCurrentRequest(json):

    currentRequest = CurrentRequest.get(CurrentRequest.key != None)

    if not currentRequest:
            requestKey = json["key"]

            returnedRequest = Request.get(Request.key == requestKey)

            if not returnedRequest:

                try:
                    newRequest = CurrentRequest.create(request=returnedRequest)
                    return jsonify({"result": currentRequest.key})
                except:
                    return jsonify({"Error": "Failed to set current request"})
            else:
                return jsonify({"Error": "Could not find a valid request with a key matchng the one provided."})
    else:
        return jsonify({"Error": "There is already another song listed as the current song."})

