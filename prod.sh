cp ./search-api.key ./api/src/search-api.key
cp ./prod-api.js ./client/src/js/api-mappings.js

/usr/local/bin/docker-compose -f prod.yml up stop;
/usr/local/bin/docker-compose -f prod.yml up -d --x-smart-recreate;
