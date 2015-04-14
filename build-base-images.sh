#!/bin/bash

cd api/base/ && ./build.sh
cd ../..
cd client/base/ && ./build.sh
cd ../..
cd mopidy/base/ && ./build.sh
cd ../..
