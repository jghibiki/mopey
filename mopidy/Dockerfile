FROM python:2.7
MAINTAINER jghibiki <jghibiki.games@gmail.com>


RUN wget -q -O - https://apt.mopidy.com/mopidy.gpg | apt-key add -
RUN wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/mopidy.list
RUN apt-get update && apt-get install mopidy  gstreamer0.10-plugins-bad  python-requests python-setuptools python-pafy --assume-yes

RUN pip install pafy 
#mopidy-youtube 

RUN git clone https://github.com/dz0ny/mopidy-youtube.git
RUN cd mopidy-youtube && python setup.py install
RUN cp mopidy-youtube/Mopidy_Youtube.egg-info/ /usr/lib/python2.7/dist-packages/ -rf
RUN cp mopidy-youtube/mopidy_youtube/ /usr/lib/python2.7/dist-packages/ -rf

ADD ./mopidy.conf /root/.config/mopidy/mopidy.conf

RUN /usr/bin/mopidy deps

CMD /usr/bin/mopidy

