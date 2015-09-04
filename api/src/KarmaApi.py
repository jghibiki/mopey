from flask import jsonify
from Models import *


def resetCurrentSongKarmaTrackers():
    for upvote in Upvote.select().where(Upvote.key != None):
        upvote.delete_instance()

    for downvote in Downvote.select().where(Upvote.key != None):
        downvote.delete_instance()
