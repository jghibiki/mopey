from flask import jsonify
from GeneralApiException import GeneralApiException
import subprocess
import json

blankCommand = '"{"jsonrpc": "2.0", "id": 1, "method": '
endpoint = "http://localhost:8082/mopidy/rpc"

def addSong(requestedSong):
    song = blankCommand + '"core.tracklist.add", "params": {"uri":"yt:' + requestedSong + '"}}"'
    return sendRequest(song)

def playSong():
    song = blankCommand + "'core.playback.play'}"
    return sendRequest(song)

def pauseSong():
    song = blankCommand + "'core.playback.pause'}"
    return sendRequest(song)

def stopSong():
    song = blankCommand + "'core.playback.stop'}"
    return sendRequest(song)

def nextSong():
    song = blankCommand + "'core.playback.next'}"
    return sendRequest(song)

def clearSongs():
    song = blankCommand + "'core.tracklist.clear'}"
    return sendRequest(song)

def getState():
    state = blankCommand + "'core.tracklist.get_state'}"
    return sendRequest(state)

def sendRequest(payload):
    psub = subprocess.Popen(["curl", "-d", payload, endpoint], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    curlstdout, curlstderr = psub.communicate()
    response = str(curlstdout)
    response2 = str(curlstderr)
    raise GeneralApiException(response + " " + response2)
    data = json.loads(response)
    return data['result']
