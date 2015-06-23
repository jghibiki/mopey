cp ./search-api.key ./api/src/search-api.key

/usr/local/bin/docker-compose -f prod.yml up -d --x-smart-recreate;
