cp ./search-api.key ./api/src/search-api.key

/usr/local/bin/docker-compose build ;
/usr/local/bin/docker-compose stop;
/usr/local/bin/docker-compose up -d --x-smart-recreate;
