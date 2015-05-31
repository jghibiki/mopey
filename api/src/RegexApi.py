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


def getRegex(key):
    returnedRegex = None
    try:
        returnedRegex = Regex.get(Regex.key == key)
    except:
        try:
            returnedRegex = Regex.get(Regex.pattern == key)
        except:
            raise GeneralApiException("Regex with pattern '" + pattern + "' does not exist.", status_code=405)

    return jsonify({"key":returnedRegex.key, "pattern":returnedRegex.pattern})
