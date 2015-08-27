from time import sleep
from datetime import datetime, timedelta
import traceback
import requests
import json
import sys, os


class ServiceCommand:
    skip = 0


class Service:
    def __init__(self):
        if os.environ.get("CONFIGURATION") is "PRODUCTION":
            self.baseUrl = "https://api:5000"
        else:
            self.baseUrl = "http://api:5000"

        self.header = {'Content-type': 'application/json', 'Accept': 'application/json'}
        self.auth = ""
        self.token = ""
        self.response = None
        self.maxTime = timedelta(minutes=6)
        self.ssl = os.environ.get("CONFIGURATION") is "DEBUG"


    def main(self):
       self.pre(self.get, "/playback/clear")
       self.pre(self.get, "/playback/next")
       self.pre(self.get, "/playback/consume")

       while True:

           self.pre(self.get, "/queue/count")
           if self.response["result"]:
               self.printl("There are " + str(self.response["result"]) + " songs in the queue.")

               self.printl("Getting queue...")
               self.pre(self.get, "/queue/0")
               song = None
               if len(self.response["result"]) > 0:
                   song = self.response["result"][0]

                   payload = {'song': song["youtubeKey"]}
                   self.pre(self.post, "/playback/add", payload=payload)
                   self.printl("Queueing song...")

                   self.pre(self.get, "/playback/list")
                   if len(self.response["result"]) > 0:
                       songLength = self.response["result"][0]["length"]
                       waitTime = timedelta(milliseconds=int(songLength))

                       self.pre(self.get, "/playback/play")
                       start = datetime.utcnow()
                       self.printl("Playing song...")

                       while True:

                           #calculate elapsed time
                           elapsed = datetime.utcnow() - start

                           self.pre(self.get, "/playback/state")
                           state = self.response

                           self.pre(self.get, "/service")
                           command = None
                           commandKey = None
                           if "result" in self.response and len(self.response["result"]) > 0:
                               command = self.response["result"][0]["command"]
                               commandKey = self.response["result"][0]["key"]

                           self.printl("Song length: " + str(waitTime) + " Play time: " + str(elapsed))

                           if  command is ServiceCommand.skip \
                               or waitTime > self.maxTime \
                               or state["result"] == "stopped" \
                               or elapsed >= waitTime:

                               if waitTime > self.maxTime:
                                    self.printl("Song too long. Skipping.")
                               elif command is not None:
                                    self.printl("Skipping song as requested.")
                                    self.pre(self.delete, "/service/" + str(commandKey))
                                    command = None
                                    commandKey = None
                               else:
                                    self.printl("Song ended. Removing from queue if it is still there.")

                               self.pre(self.get, "/queue/0")

                               newSong = None
                               if len(self.response["result"]) > 0:
                                   newSong = self.response["result"][0]


                               if(newSong is not None and  song["key"] == newSong["key"]):
                                   self.pre(self.delete, "/queue/" +  str(song["key"]))

                                   self.printl("Clearing mopidy queue...")
                                   self.pre(self.get, "/playback/clear")
                                   self.pre(self.get, "/playback/next")

                                   # break out if loop
                                   break
                           else:
                               self.printl("Waiting for song to end...")
                               sleep(2)

           else:
               self.printl("There are no songs in the queue.")
               sleep(10)



    def login(self):
        self.printl("SYSTEM_DJ logging in...")

        credentials = {"username":"SYSTEM_DJ", "password": "121"}

        req = None
        if self.ssl:
            req = requests.post(self.baseUrl + "/authenticate", data=json.dumps(credentials), headers=self.header, verify=False)
        else:
            req = requests.post(self.baseUrl + "/authenticate", data=json.dumps(credentials), headers=self.header)


        if "access_token" in req.json():
            self.token = req.json()["access_token"]
            self.auth = self.authHeader(self.token)
            self.printl("SYSTEM_DJ has logged in")

        else:
            self.printl("SYSTEM_DJ failed to login. Retrying...")
            sleep(5)
            self.login()



    def authHeader(self,token):
        return self.header.update({'Authorization': token})

    def verifyToken(self):
        token = {"token": self.token}

        req = None
        if self.ssl:
            req = requests.post(self.baseUrl + "/authenticate/verify/admin", data=json.dumps(token), headers=self.header, verify=False)
        else:
            req = requests.post(self.baseUrl + "/authenticate/verify/admin", data=json.dumps(token), headers=self.header)

        if "result" in req.json():
            return req.json()["result"]
        else:
            return False

    def  get(self, endpoint):
        req = None
        if self.ssl:
            req = requests.get(self.baseUrl + endpoint, headers=self.header, auth=self.auth, verify=False)
        else:
            req = requests.get(self.baseUrl + endpoint, headers=self.header, auth=self.auth)

        self.response = req.json()

    def post(self, endpoint, payload=""):
        req = None
        if self.ssl:
            req = requests.post(self.baseUrl + endpoint, data=json.dumps(payload), headers=self.header, auth=self.auth, verify=False)
        else:
            req = requests.post(self.baseUrl + endpoint, data=json.dumps(payload), headers=self.header, auth=self.auth)

        self.response = req.json()

    def delete(self, endpoint):
        req = None
        if self.ssl:
            req = requests.delete(self.baseUrl + endpoint, headers=self.header, auth=self.auth, verify=False)
        else:
            req = requests.delete(self.baseUrl + endpoint, headers=self.header, auth=self.auth)

        self.response = req.json()


    def pre(self, callback, *args, **kwargs):
        if self.verifyToken():
            return callback(*args, **kwargs)
        else:
            self.login()
            self.pre(callback, *args)

    def printl(self, msg):
        print msg
        #sys.stdout.flush()

if __name__ == "__main__":
    # wait for mopidy to start or else their is a connection error
    sleep(10)
    sys.stdout = os.fdopen(sys.stdout.fileno(), 'w', 0)
    Service().main()
