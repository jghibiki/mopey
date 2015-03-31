FROM python:2.7
MAINTAINER jghibiki <jghibiki.games@gmail.com>


RUN wget -q -O - https://apt.mopidy.com/mopidy.gpg | apt-key add -
RUN wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/mopidy.list
RUN apt-get update && apt-get install mopidy  gstreamer0.10-plugins-bad  --assume-yes

RUN pip install mopidy-youtube pafy 

ADD ./mopidy.conf /root/.config/mopidy/mopidy.conf



CMD mopidy

