from time import sleep
import requests
import json
import sys

baseUrl = "http://api:5000"
header = {'Content-type': 'application/json', 'Accept': 'application/json'}
djpon3 = ""

def main():
    # wait for mopidy to start or else their is a connection error
    sleep(10)
    print "DJPon3 logging in and getting the turntable ready for action..."
    sys.stdout.flush()
    djpon3 = login()
    if djpon3["access_token"]:
        print "DJPon3 is logged in and the turntable is ready to play"
        sys.stdout.flush()
        while True:
            djpon3Token = {"token": djpon3["access_token"]}
            djpon3Verify = requests.post(baseUrl + "/authenticate/verify/admin", data=json.dumps(djpon3Token), headers=header)
            djpon3Verify = djpon3Verify.json()
            if djpon3Verify["result"]:
                r = requests.get(baseUrl + "/queue")
                song = r.json()
                if song:
                    playback = requests.get(baseUrl + "/playback/state")
                    playback = playback.json()
                    if playback["result"] == "stopped":
                        payload = {'song': song[0]["youtubeKey"]}
                        authHead = authHeader(djpon3["access_token"])
                        req = requests.post(baseUrl + "/playback/add", data=json.dumps(payload), headers=header, auth=authHead)
                        req = req.json()
                        songLength = req["result"][0]["track"]["length"]
                        requests.get(baseUrl + "/playback/play", headers=header, auth=authHead)
                        sleep(songLength/1000.0)
                        requests.delete(baseUrl + "/queue/" + str(song[0]["key"]), headers=header, auth=authHead)
            else:
                print "DJPon3's turntable broke down. fixing..."
                sys.stdout.flush()
                djpon3 = login()
            sleep(1)
    print "DJPon3 could not log in and is having technical difficulties with getting the turntable setup"

def login():
    djpon3Credentials = {"username":"DJPon3", "password": "121"}
    djpon3 = requests.post(baseUrl + "/authenticate", data=json.dumps(djpon3Credentials), headers=header)
    return djpon3.json()

def authHeader(token):
    return header.update({'Authorization': token})

if __name__ == "__main__":
    main()