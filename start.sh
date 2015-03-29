export PATH=~/.gem/ruby/2.2.0/bin:$PATH

cd ./client/src
compass compile

cd ./../../
cp ./search-api.key ./api/src/search-api.key
docker-compose build;
docker-compose stop;
docker-compose up -d;
