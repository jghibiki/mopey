export PATH=~/.gem/ruby/2.2.0/bin:$PATH

cd ./client/src
compass compile

cd ./../../
cp ./search-api.key ./api/src/search-api.key

/usr/local/bin/docker-compose build;
/usr/local/bin/docker-compose stop;
/usr/local/bin/docker-compose up -d;
