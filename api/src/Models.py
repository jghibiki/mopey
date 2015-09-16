from peewee import *

db = PostgresqlDatabase('postgres', host='db', user='postgres')

class BaseModel(Model):
    class Meta:
        database = db

class User(BaseModel):
    key = PrimaryKeyField()

    username = TextField(unique=True, index=True)
    password = TextField()
    firstName = TextField()
    lastName = TextField()
    email = TextField(unique=True)
    karma = IntegerField()
    strikes = IntegerField()

    # ghost property accessTokens
    # ghost property upvote
    # ghost property downvote
    # ghost property spam

class AccessToken(BaseModel):
    key = PrimaryKeyField()

    token = TextField()
    expirationDate = DateTimeField()

    user = ForeignKeyField(rel_model=User, related_name="accessTokens")

class Admin(BaseModel):
    key = PrimaryKeyField()

    user = ForeignKeyField(rel_model=User)

class Regex(BaseModel):
    key = PrimaryKeyField()
    pattern = TextField(unique=True, index=True)

class Request(BaseModel):
    key = PrimaryKeyField()

    youtubeKey = TextField()
    title = TextField()
    uploader = TextField()
    description = TextField()
    thumbnail = TextField()
    date = DateTimeField()
    user = ForeignKeyField(rel_model=User, related_name="songsRequested")

class CurrentRequest(BaseModel):
    key = PrimaryKeyField()

    youtubeKey = TextField()
    title = TextField()
    uploader = TextField()
    description = TextField()
    thumbnail = TextField()
    date = DateTimeField()
    user = ForeignKeyField(rel_model=User, related_name="currentRequest")


class Upvote(BaseModel):
    key = PrimaryKeyField()

    request = ForeignKeyField(rel_model=CurrentRequest, related_name="upvotes")
    user = ForeignKeyField(rel_model=User, related_name="upvotes")

class Downvote(BaseModel):
    key = PrimaryKeyField()

    request = ForeignKeyField(rel_model=CurrentRequest, related_name="downvotes")
    user = ForeignKeyField(rel_model=User, related_name="downvotes")

class Spam(BaseModel):
    key = PrimaryKeyField()

    request = ForeignKeyField(rel_model=CurrentRequest, related_name="spams")
    user = ForeignKeyField(rel_model=User, related_name="spams")

class SpamReport(BaseModel):
    key = PrimaryKeyField()

    offender = ForeignKeyField(rel_model=User, related_name="offenses")
    reporter = ForeignKeyField(rel_model=User, related_name="reports")

    youtubekey = TextField()
    title = TextField()
    uploader = TextField()
    description = TextField()
    date = DateTimeField()

    comment = TextField()

class Command(BaseModel):
    key = PrimaryKeyField()

    command = IntegerField()
    date = DateTimeField()

class Favorite(BaseModel):
    key = PrimaryKeyField()

    youtubeKey = TextField()
    title = TextField()
    uploader = TextField()
    description = TextField()
    thumbnail = TextField()
    user = ForeignKeyField(rel_model=User, related_name="favorites")

