from flask import jsonify
from Models import *


def getFavorites(page, headers):
    token = headers['Authorization']
    requestUser = AccessToken.get(AccessToken.token == token).user

    favs = []
    for fav in requestUser.favorites.order_by(Favorite.key).paginate(page+1, 10):
        favs.append({
            "key": fav.key,
            "youtubeKey": fav.youtubeKey,
            "title": fav.title,
            "description": fav.description,
            "uploader": fav.uploader,
           })
    return jsonify({"result": favs})

def addFavorite(json, headers):
    token = headers['Authorization']
    requestUser = AccessToken.get(AccessToken.token == token).user

    fav = Favorite.create(youtubeKey=json["youtubeKey"],
                    title=json["title"],
                    uploader=json["uploader"],
                    description=json["description"],
                    user=requestUser)

    if fav is not None:
        return jsonify({"result": str(fav.key)})
    else:
        return jsonify({"Error": "Failed to add favorite"})


def removeFavorite(key):
    #try:
        Favorite.delete().where(Favorite.key == key).execute()
        return jsonify({"result": None})
    #except:
    #    return jsonify({"Error": "Failed to remove favorite."})

def countFavorites(headers):
    token = headers['Authorization']
    requestUser = AccessToken.get(AccessToken.token == token).user

    count = Favorite.select().where(Favorite.user == requestUser).count()

    return jsonify({"result": count})

