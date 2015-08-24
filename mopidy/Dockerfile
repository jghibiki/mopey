FROM python:2.7
MAINTAINER jghibiki <jghibiki.games@gmail.com>


RUN wget -q -O - https://apt.mopidy.com/mopidy.gpg | apt-key add -
RUN wget -q -O /etc/apt/sources.list.d/mopidy.list https://apt.mopidy.com/mopidy.list
RUN apt-get update && apt-get install gstreamer0.10-plugins-bad python-requests python-setuptools python-pafy mopidy mopidy-youtube curl build-essential --assume-yes

RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -
RUN apt-get install --yes nodejs
RUN npm install rtail



RUN pip install pafy

RUN rm -rf /usr/lib/python2.7/dist-packages/pafy
RUN cp -rf /usr/local/lib/python2.7/site-packages/pafy /usr/lib/python2.7/dist-packages/pafy


ADD ./mopidy.conf /root/.config/mopidy/mopidy.conf

RUN /usr/bin/mopidy deps

CMD /usr/bin/mopidy -v 2>&1 | node_modules/rtail/cli/rtail-client.js --id "Mopidy" --tty --host logs 

