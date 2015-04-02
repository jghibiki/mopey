import peewee
from Models import *
from uuid import uuid4
import hashlib

def main():
    print "###########################"
    print "## Starting Server Setup ##"
    print "###########################"

    db = peewee.PostgresqlDatabase('postgres', host='db', user='postgres')

    print "Wiping database and creating tables..."
    tables = [
        User,
        AccessToken,
        Admin,
        RequestQue,
        Regex
        ]
    db.drop_tables(tables, safe=True)
    db.create_tables(tables, safe=True)
    print "Finished creating tables!"

    print "Adding user jghibiki..."
    jghibiki = User.create(
       username="jghibiki",
       password="7418acc26027cf4a026c35d21f468329",
       firstName="Jordan",
       lastName="Goetze",
       email="jghibiki.games@gmail.com",
       karma=100000,
       strikes=0,
    )
    if(jghibiki is None):
        raise "Failed to add user jghibiki"

    print "Making jghibiki an admin..."
    jghibiki_admin = Admin.create(user=jghibiki)
    if(jghibiki_admin is None):
        raise "Failed to make use jghibiki an admin"
    print "Success!"

    print "Adding user JPisaBrony"
    jpisabrony = User.create(
       username="JPisaBrony",
       password="4c56ff4ce4aaf9573aa5dff913df997a",
       firstName="Josh",
       lastName="Pohl",
       email="jdpohl789@gmail.com",
       karma=100000,
       strikes=0,
    )
    if(jpisabrony is None):
        raise "Failed to add user JPisaBrony"

    print "Making JPisaBrony an admin..."
    jpisabrony_admin = Admin.create(user=jpisabrony)
    if(jpisabrony is None):
        raise "Failed to make use JPisaBrony an admin"
    print "Success!"

    print "############################"
    print "## Completed Server Setup ##"
    print "############################"
