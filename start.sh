export PATH=~/.gem/ruby/2.2.0/bin:$PATH

cd ./client/src
compass compile

cd ./../../
cp ./search-api.key ./api/src/search-api.key
sudo docker-compose build;
sudo docker-compose stop;
sudo docker-compose up -d;
