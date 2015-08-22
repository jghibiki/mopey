from time import sleep
import requests
import json
import sys



class Service:
    def __init__(self):
        self.baseUrl = "http://api:5000"
        self.header = {'Content-type': 'application/json', 'Accept': 'application/json'}
        self.auth = ""
        self.token = ""
        self.response = None

    def main(self):

        try:
            # wait for mopidy to start or else their is a connection error
            sleep(10)

            self.pre(self.get, "/playback/clear")
            self.pre(self.get, "/playback/next")
            self.pre(self.get, "/playback/consume")

            while True:
                self.pre(self.get, "/playback/state")
                if "result" in self.response \
                        and  self.response["result"] == "stopped":
                    self.printl("Nothing is playing...")

                    self.pre(self.get, "/queue/count")
                    if self.response["result"]:
                        self.printl("There are " + str(self.response["result"]) + " songs in the queue.")

                        self.printl("Getting queue...")
                        self.pre(self.get, "/queue/0")
                        song = self.response["result"][0]

                        payload = {'song': song["youtubeKey"]}
                        self.pre(self.post, "/playback/add", payload=payload)
                        self.printl("Queueing song...")

                        self.pre(self.get, "/playback/play")
                        junk = self.response
                        self.printl("Playing song...")


                        while True:
                            # check if it is done...
                            self.pre(self.get, "/playback/state")
                            if self.response["result"] == "stopped":
                                self.printl("Song ended. Removing from queue if it is still there.")

                                self.printl("Getting queue...")
                                self.pre(self.get, "/queue/0")
                                song = self.response["result"][0]

                                self.printl("junk: " + str(junk))
                                self.printl("key: " + str(song["key"]))
                                if(junk == song["key"]):
                                    junk = self.pre(self.delete, "/queue/" +  str(song[0]["key"]))

                                self.printl("Clearing mopidy queue...")
                                self.pre(self.get, "/playback/clear")
                                break
                            else:
                                self.printl("Waiting for song to end...")
                                sleep(5)

                    else:
                        self.printl("There are no songs in the queue.")
                        sleep(2)
                else:
                    self.printl("Something is playing...")
                    sleep(2)

        except:
            self.printl("There was an error. Restarting.")
            self.main()




    def login(self):
        self.printl("SYSTEM_DJ logging in...")

        credentials = {"username":"SYSTEM_DJ", "password": "121"}

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
        req = requests.post(self.baseUrl + "/authenticate/verify/admin", data=json.dumps(token), headers=self.header)
        if "result" in req.json():
            return req.json()["result"]
        else:
            return False

    def  get(self, endpoint):
        req = requests.get(self.baseUrl + endpoint, headers=self.header, auth=self.auth)
        self.response = req.json()

    def post(self, endpoint, payload=""):
        req = requests.post(self.baseUrl + endpoint, data=json.dumps(payload), headers=self.header, auth=self.auth)
        self.response = req.json()

    def delete(self, endpoint):
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
        sys.stdout.flush()

if __name__ == "__main__":
    Service().main()
