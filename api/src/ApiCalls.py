from flask import jsonify
from GeneralApiException import GeneralApiException
from sh import curl
import json

blankCommand = '{"jsonrpc": "2.0", "id": 1, "method": '
endpoint = "http://mopidy:6680/mopidy/rpc"

def addSong(requestedSong):
    song = blankCommand + '"core.tracklist.add", "params": {"uri":"yt:https://youtube.com/watch?v=' + requestedSong + '"}}'
    return jsonify(sendRequest(song))

def playSong():
    song = blankCommand + '"core.playback.play"}'
    return jsonify(sendRequest(song))

def pauseSong():
    song = blankCommand + '"core.playback.pause"}'
    return jsonify(sendRequest(song))

def stopSong():
    song = blankCommand + '"core.playback.stop"}'
    return jsonify(sendRequest(song))

def nextSong():
    song = blankCommand + '"core.playback.next"}'
    return jsonify(sendRequest(song))

def clearSongs():
    song = blankCommand + '"core.tracklist.clear"}'
    return jsonify(sendRequest(song))

def getTracks():
    tracks = blankCommand + '"core.tracklist.get_tracks"}'
    return jsonify(sendRequest(tracks))

def getState():
    state = blankCommand + '"core.playback.get_state"}'
    return jsonify(sendRequest(state))

def sendRequest(payload):
    psub = curl("-d " + payload, endpoint)
    data = json.loads(str(psub))
    return {"result": data['result']}
