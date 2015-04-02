from Models import *

def createAdmin(key):
    new_admin = Admin.create(user=key)
    if(key is None):
        raise "Failed to make " + key + " an admin"


def checkIfAdmin(key):
    return getAdminDatabase(key)


def getAdminDatabase(key):
    returnedUser = None
    if(key == None):
        return 400
    try:
        returnedUser = Admin.get(Admin.key == key)
    except:
        try:
            returnedUser = Admin.get(Admin.user == key)
        except:
            returnedUser = None

    if(returnedUser == None):
        raise GeneralApiException("Error Admin does not exist", status_code=200)

    return returnedUser
