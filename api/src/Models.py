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
    #ghost property accessTokens

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
    date = DateTimeField()
    user = ForeignKeyField(rel_model=User, related_name="songsRequested")
