FROM python:2.7.9
MAINTAINER jghibiki <jghibiki.games@gmail.com>

RUN apt-get update 
RUN apt-get install --yes curl build-essential
RUN curl --silent --location https://deb.nodesource.com/setup_0.12 | bash -
RUN apt-get install --yes nodejs
RUN npm install -g rtail


RUN easy_install pip==1.2.1

ADD ./requirements.txt /data/requirements.txt

RUN pip install -r /data/requirements.txt

ADD ./src /data/src

RUN chmod 755 /data/src/start.sh
