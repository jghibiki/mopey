#!/bin/bash
#post-receice

cd /home/git/mopey

cd api/base
sh build.sh
cd ../..

cd client/base
sh build.sh
cd ../..

sh start.sh
