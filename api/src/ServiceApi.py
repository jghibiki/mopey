from flask import jsonify
from Models import *
from datetime import datetime

class ServiceCommand():
    skip = 0


def serviceSkipSong():
    try:
        returnedCommand = Command.create(command=ServiceCommand.skip, date=datetime.utcnow())
        return jsonify({"result": returnedCommand.key})
    except:
        return jsonify({"Error": "Failed to add skip song command."})


def getServiceCommands():
    commands = []
    for command in Command.select().order_by(Command.date):
        commands.append({
            "key" : command.key,
            "command": command.command,
            "date": command.date
        })

    return jsonify({"result": commands})

def removeServiceCommand(key):
    command = Command.get(Command.key == key)

    if command:
        command.delete_instance()
        return jsonify({"result":None})

    else:
        return jsonify({"Error": "Failed to remove command."})
