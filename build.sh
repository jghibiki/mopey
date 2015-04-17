#!/bin/bash

chmod 755 api/base/build.sh
chmod 755 client/base/build.sh
chmod 755 mopidy/base/build.sh

cd api/base/ && ./build.sh
cd ../..
cd client/base/ && ./build.sh
cd ../..
cd mopidy/base/ && ./build.sh
cd ../..
