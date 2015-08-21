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
        while True:
            if systemAuth(system_dj)["result"]:
                song, system_dj = checkIfStillLoggedIn(system_dj, requestApi, system_dj, "get", "/queue", "")
                if song:
                    playback, system_dj = checkIfStillLoggedIn(system_dj, requestApi, system_dj, "get", "/playback/state", "")
                    if playback["result"] == "stopped":
                        payload = {'song': song[0]["youtubeKey"]}
                        req, system_dj = checkIfStillLoggedIn(system_dj, requestApi, system_dj, "post2", "/playback/add", payload)
                        songLength = req["result"][0]["track"]["length"]
                        junk, system_dj = checkIfStillLoggedIn(system_dj, requestApi, system_dj, "get", "/playback/play", "")
                        sleep(songLength/1000.0)
                        junk, system_dj = checkIfStillLoggedIn(system_dj, requestApi, system_dj, "delete", "/queue/" +  str(song[0]["key"]), "")
            else:
                printl("SYSTEM_DJ's token expired, renewing...")
                system_dj = login()
            sleep(1)
    print "SYSTEM_DJ could not log in. Exiting."

def login():
    credentials = {"username":"SYSTEM_DJ", "password": "121"}
    system_djCredentials = requestApi("", "post1", "/authenticate", credentials)
    return system_djCredentials

def authHeader(token):
    return header.update({'Authorization': token})

def systemAuth(dj):
    token = {"token": dj["access_token"]}
    system_djToken = requestApi("", "post1", "/authenticate/verify/admin", token)
    return system_djToken

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

def checkIfStillLoggedIn(dj, callback, *args):
    if systemAuth(dj)["result"]:
        return callback(*args), dj
    else:
        dj = login()
        checkIfStillLoggedIn(dj, callback, *args)

def printl(msg):
    print msg
    sys.stdout.flush()

if __name__ == "__main__":
    main()