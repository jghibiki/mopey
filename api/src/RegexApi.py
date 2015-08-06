from Models import Regex
from GeneralApiException import GeneralApiException
import re
from flask import jsonify

def addRegex(pattern):
    regex = None

    try:
        regex = re.compile(pattern)
    except:
        raise GeneralApiException("Failed to test compile pattern: '" + pattern + "'", status_code=405)

    createdRegex = None
    try:
        createdRegex = Regex.create(pattern=pattern)
    except:
        raise GeneralApiException("Failed to create regex with pattern '" + pattern + "'", status_code=200)

    return jsonify({"key":createdRegex.key})

def removeRegex(key):
    returnedRegex = None

    try:
        Regex.delete().where(Regex.key == key).execute()
    except Exception,e:
        raise GeneralApiException("Failed to remove regex with key '" + key + "'.\n" + e.message, status_code=200)

    return jsonify({"key":key})


def getRegex(page):

    returnedRegexs = []
    for x in Regex.select().order_by(Regex.key).paginate(int(page)+1, 10):
        y = {}
        y["key"] = x.key
        y["pattern"] = x.pattern
        returnedRegexs.append(y)

    return jsonify({"result":returnedRegexs})
