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

        # wait for mopidy to start or else their is a connection error
        sleep(10)

        while True:
            # if nothing is playing...
            self.pre(self.get, "/playback/state")
            if "result" in self.response \
                    and  self.response["result"] == "stopped":

                # see if there is anything in the queue...
                self.pre(self.get, "/queue/count")
                if self.response["result"]:

                    # if there is get the first entry...
                    self.pre(self.get, "/queue/0")
                    song = self.response

                    # and add it to the tracklist...
                    payload = {'song': song[0]["youtubeKey"]}
                    self.pre(self.post, "/playback/add", payload=payload)

                    #and play it...
                    self.pre(self.get, "/playback/play")
                    junk = self.response


                    while True:
                        # check if it is done...
                        self.pre(self.get, "/playback/state")
                        if self.response["result"] == "stopped":

                            # if it is remove it from the queue...
                            junk = self.pre(self.delete, "/queue/" +  str(song[0]["key"]))
                            break

                else:
                    sleep(2)
            else:
                sleep(2)

        print "There was an error. Exiting."




    def login(self):
        self.printl("SYSTEM_DJ logging in...")

        credentials = {"username":"SYSTEM_DJ", "password": "121"}

        req = requests.post(self.baseUrl + "/authenticate", data=json.dumps(credentials), headers=self.header)

        self.printl(req.json())
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
