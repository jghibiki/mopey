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

class Song(BaseModel):
    key = PrimaryKeyField()

    name = TextField()
    karma = IntegerField()

class RequestQue(BaseModel):
    key = PrimaryKeyField()

    song = ForeignKeyField(rel_model=Song)
    time = TextField()
    user = ForeignKeyField(rel_model=User, related_name="songsRequested")
