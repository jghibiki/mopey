from time import sleep
import requests
import json
import sys

baseUrl = "http://api:5000"
header = {'Content-type': 'application/json', 'Accept': 'application/json'}
system_dj = ""

def main():
    # wait for mopidy to start or else their is a connection error
    sleep(10)
    printl("SYSTEM_DJ logging in...")
    system_dj = login()
    if system_dj["access_token"]:
        printl("SYSTEM_DJ has logged in")
        song = 0
        currentSong = 0
        state = 0
        while True:
            if state == 0:
                song = requestApi(system_dj, "get", "/queue/1", "")
                if song.get("Error"):
                    printl("Logining in at get queue state")
                    system_dj = login()
                elif song["result"]:
                    state += 1
            if state == 1:
                playback = requestApi(system_dj, "get", "/playback/state", "")
                if playback.get("Error"):
                    printl("Logining in at playback state")
                    system_dj = login()
                elif playback["result"] == "stopped":
                    state += 1
            if state == 2:
                payload = {"song": song["result"][0]["youtubeKey"]}
                currentSong = requestApi(system_dj, "post2", "/playback/add", payload)
                if currentSong.get("Error"):
                    printl("Logining in at add state")
                    system_dj = login()
                else:
                    state += 1
            if state == 3:
                play = requestApi(system_dj, "get", "/playback/play", "")
                if play.get("Error"):
                    printl("Logining in at play state")
                    system_dj = login()
                else:
                    songLength = currentSong["result"][0]["track"]["length"]
                    sleep(songLength/1000.0)
                    state += 1
            if state == 4:
                delete = requestApi(system_dj, "delete", "/queue/" + str(song["result"][0]["key"]), "")
                if delete.get("Error"):
                    printl("Logining in at delete queue state")
                    system_dj = login()
                else:
                    state = 0
            sleep(1)
    print "SYSTEM_DJ could not log in. Exiting."

def login():
    credentials = {"username":"SYSTEM_DJ", "password": "121"}
    system_djCredentials = requestApi("", "post1", "/authenticate", credentials)
    return system_djCredentials

def authHeader(token):
    return header.update({'Authorization': token})

def requestApi(dj, call, endpoint, payload):
    if call == "get":
        req = requests.get(baseUrl + endpoint, headers=header, auth=authHeader(dj["access_token"]))
        return req.json()
    elif call == "post1":
        req = requests.post(baseUrl + endpoint, data=json.dumps(payload), headers=header)
        return req.json()
    elif call == "post2":
        req = requests.post(baseUrl + endpoint, data=json.dumps(payload), headers=header, auth=authHeader(dj["access_token"]))
        return req.json()
    elif call == "delete":
        req = requests.delete(baseUrl + endpoint, headers=header, auth=authHeader(dj["access_token"]))
        return req.json()

def printl(msg):
    print msg
    sys.stdout.flush()

if __name__ == "__main__":
    main()