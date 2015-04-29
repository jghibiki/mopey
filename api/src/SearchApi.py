from apiclient.discovery import build
from Models import *
from GeneralApiException import GeneralApiException
import re
import json


# Set DEVELOPER_KEY to the API key value from the APIs & auth > Registered apps
# tab of
#   https://cloud.google.com/console
# Please ensure that you have enabled the YouTube Data API for your project.
devKeyFile = open("search-api.key", "rb")
DEVELOPER_KEY = devKeyFile.read()
devKeyFile.close()
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

def youtubeSearch(query, maxResults=50):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION,
    developerKey=DEVELOPER_KEY)

    validateQuery(query)

    # Call the search.list method to retrieve results matching the specified
    # query term.
    search_request = youtube.search().list(
    part="id,snippet",
    q=query,
    type="video",
    maxResults=maxResults,
    order="relevance"
    )

    searchResponse = json.dumps(search_request.execute(), separators=[',',':'])
    searchData = json.loads(searchResponse)

    filteredData = filterData(searchData)
    filteredResponse = json.dumps(filteredData)

    return filteredResponse

def filterData(original):
    filtered = []

    for item in original["items"]:
        temp = {}
        temp["title"] = item["snippet"]["title"]
        temp["descriptipn"] = item["snippet"]["description"]
        temp["uploader"] = item["snippet"]["channelTitle"]
        temp["id"] = item["id"]["videoId"]
        filtered.append(temp)


    return filtered

def validateQuery(query):
    for regex in Regex.select():
        if not re.search(regex.pattern, query):
            raise GeneralApiException("Search request for query='" + query + "' has been denied, requested query failed to pass acceptance testing.")




