FROM mwallasch/docker-ruby-node
MAINTAINER jghibiki <jghibiki.games@gmail.com>

RUN npm install -g http-server

RUN gem install sass compass

ADD ./src /data/src

RUN cd /data/src && compass compile

