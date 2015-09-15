from peewee import *
from playhouse.csv_loader import *
from Models import *
import os

def backupDb():
    directory = "backup"
    if not os.path.exists(directory):
        os.mkdir(directory)

    # Export User
    out = "username,password,firstName,lastName,email,karma,strikes\n"
    for user in User.select().order_by(User.key):
        line = user.username + "," \
                + user.password + "," \
                + user.firstName + "," \
                + user.lastName + "," \
                + user.email + "," \
                + str(user.karma) + "," \
                + str(user.strikes) + "\n"
        out += line
    fh = open("backup/User.csv", "w")
    fh.write(out)
    fh.close()

    # Export Admins
    out = "user\n"
    for admin in Admin.select().order_by(Admin.key):
        line = str(admin.user.key) + "\n"
        out += line
    fh = open("backup/Admin.csv", "w")
    fh.write(out)
    fh.close()


    # Export Regexes
    out = "pattern\n"
    for regex in Regex.select().order_by(Regex.key):
        line = regex.pattern + "\n"
        out += line
    fh = open("backup/Regex.csv", "w")
    fh.write(out)
    fh.close()


    # Export SpamReport
    out = "offender,reporter,youtubeKey,title,uploader,description,date\n"
    for spamReport in SpamReport.select().order_by(SpamReport.key):
        line = str(pamReport.offender.key) + "," \
             + str(spamReport.reporter.key) + "," \
             + spamReport.youtubeKey + "," \
             + spamReport.title.replace(",", "&#44;").encodE('utf-8') + "," \
             + spamReport.uploader.replace(",", "&#44;").encodE('utf-8') + "," \
             + spamReport.description.replace(",", "&#44;").encodE('utf-8') + "," \
             + str(spamReport.date) + "\n"
        out += line
    fh = open("backup/SpamReport.csv", "w")
    fh.write(out)
    fh.close()


    # Export Favorites
    out = "youtubeKey,title,uploader,description,user\n"
    for favorite in Favorite.select().order_by(Favorite.key):
        line = favorite.youtubeKey.encode('utf-8') + "," 
	line += favorite.title.replace(",", "&#44;").encode('utf-8') + "," 
	line += favorite.uploader.replace(",", "&#44;").encode('utf-8') + "," 
	line += favorite.description.replace(",", "&#44;").encode('utf-8') + "," 
	line +=  str(favorite.user.key) + "\n"
        out += line
    fh = open("backup/Favorite.csv", "w")
    fh.write(out)
    fh.close()




def importDb():
    directory = "import"

    if os.path.exists(directory):
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
            Command,
	    Favorite
            ]
        db.drop_tables(tables, safe=True)
        db.create_tables(tables, safe=True)

        load_csv(User, "import/User.csv")
        load_csv(Admin, "import/Admin.csv")
        load_csv(Regex, "import/Regex.csv")
        load_csv(SpamReport, "import/SpamReport.csv")
        load_csv(Favorite, "import/Favorite.csv")
        return "Imported Models"
    else:
        return "No import dir"





