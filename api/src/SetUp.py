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
        Admin
        ]
    db.drop_tables(tables, safe=True)
    db.create_tables(tables, safe=True)
    print "Finished creating tables!"


    print "Adding user jghibiki..."
    jghibiki = User.create(
           username = "jghibiki",
           password = "cf719217b63d276f7e74047df2539449",
           firstName = "Jordan",
           lastName = "Goetze",
           email = "jghibiki.games@gmail.com",
           karma = 100000,
           strikes = 0,
        )
    if(jghibiki == None):
        raise "Failed to add user jghibiki"

    print "Making jghibiki an admin..."
    jghibiki_admin = Admin.create(user=jghibiki)
    if(jghibiki_admin == None):
        raise "Failed to make use jghibiki an admin"
    print "Success!"

    print "Adding user jpisabrony"
    jpisabrony = User.create(
           username = "jpisabrony",
           password = "9c4faf82d5d151461fe18b818f4a09f6",
           firstName = "Josh",
           lastName = "Pohl",
           email = "josh.pohl17@gmail.com",
           karma = 100000,
           strikes = 0,
        )
    if(jpisabrony == None):
        raise "Failed to add user jpisabrony"

    print "Making jghibiki an admin..."
    jpisabrony_admin = Admin.create(user=jpisabrony)
    if(jpisabrony == None):
        raise "Failed to make use jpisabrony an admin"
    print "Success!"

    print "############################"
    print "## Completed Server Setup ##"
    print "############################"



