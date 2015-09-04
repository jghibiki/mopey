from flask import jsonify
from Models import *

def resetCurrentSongSpamTrackers():
    for spam in Spam.select().where():
        spam.delete_instance()

