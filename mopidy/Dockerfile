FROM python:2.7
MAINTAINER jghibiki <jghibiki.games@gmail.com>


RUN wget -q -O - https://apt.mopidy.com/mopidy.gpg | apt-key add -
RUN wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/mopidy.list
RUN apt-get update && apt-get install gstreamer0.10 gstreamer0.10-plugins-bad gstreamer0.10-plugins-base gstreamer0.10-plugins-good gstreamer0.10-plugins-ugly gstreamer1.0 gstreamer0.10-plugins-bad python-requests python-setuptools python-pafy mopidy mopidy-youtube --assume-yes



ADD ./mopidy.conf /root/.config/mopidy/mopidy.conf

RUN /usr/bin/mopidy deps

CMD /usr/bin/mopidy -v

