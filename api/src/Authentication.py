
def _authentication(request);
    returnedUser = getUserDatabase(request.json["username"])
    #return returnedUserpage

    if(returnedUser == None):
        raise GeneralApiException("Invalid user name and password combination.", status_code=400)

    md5 = hashlib.md5()
    md5.update(request.json["password"])

    if(returnedUser.password != str(md5.hexdigest())):
        raise GeneralApiException("Invalid user name and password combination.", status_code=400)

    returnedAccessToken = AccessToken.create(token=str(uuid4()), expirationDate=datetime.utcnow() + timedelta(hours=1), user=returnedUser)

    payload = {"access_token" : returnedAccessToken.token, "expiration_date" : returnedAccessToken.expirationDate}

    return payload
