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
        Regex,
        Request,
        CurrentRequest,
        Upvote,
        Downvote,
        Spam,
        SpamReport,
        Command
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
    if(jpisabrony_admin is None):
        raise "Failed to make use JPisaBrony an admin"
    print "Success!"

    print "Adding user SYSTEM_DJ"
    SYSTEM_DJ = User.create(
       username="SYSTEM_DJ",
       password="4c56ff4ce4aaf9573aa5dff913df997a",
       firstName="SYSTEM_DJ",
       lastName="SYSTEM_DJ",
       email="SYSTEM_DJ@nowhere.com",
       karma=0,
       strikes=0,
    )
    if(SYSTEM_DJ is None):
        raise "Failed to add user SYSTEM_DJ"

    print "Making SYSTEM_DJ an admin..."
    SYSTEM_DJ_admin = Admin.create(user=SYSTEM_DJ)
    if(SYSTEM_DJ_admin is None):
        raise "Failed to make use SYSTEM_DJ an admin"
    print "Success!"

    print "Adding default regexes"
    Regex.create(pattern=".*(C|c)(O|o)(C|c)(O|o).*")
    Regex.create(pattern=".*(S|s)(A|a)(N|n)(I|i)(C|c).*")
    Regex.create(pattern=".*(O|o)(\.)?(T|t)(\.)?.*(G|g)(E|e)(N|n)(E|e)(S|s)(I|i)(S|s).*")
    Regex.create(pattern=".*(R|r)(I|i)(C|c)(K|k).*(A|a)(S|s)(T|t)?(L|l)(E|e)(Y|y).*")
    Regex.create(pattern=".*(N|n)(E|e)(V|v)(E|e)(R|r).*(G|g)(U|u)((N|n))?(N|n)(A|a).*(G|g)(I|i)(V|v)(E|e).*((Y|y))?((O|o))?(U|u).*(U|u)(P|p).*")

    print "############################"
    print "## Completed Server Setup ##"
    print "############################"
