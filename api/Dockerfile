FROM python:2.7.9
MAINTAINER jghibiki <jghibiki.games@gmail.com>

RUN easy_install pip==1.2.1

ADD ./requirements.txt /data/requirements.txt

RUN pip install -r /data/requirements.txt

ADD ./src /data/src
