cp ./search-api.key ./api/src/search-api.key

/usr/local/bin/docker-compose -f dev.yml up -d --x-smart-recreate;
