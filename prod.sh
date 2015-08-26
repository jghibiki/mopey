cp ./search-api.key ./api/src/search-api.key
cp ./prod-api.js ./client/src/js/api-mappings.js

# copy ssl files
mkdir -p ./api/src/ssl
cp ./ssl.key ./api/src/ssl/
cp ./ssl.crt ./api/src/ssl/

mkdir -p ./client/src/ssl
cp ./ssl.key ./client/src/ssl/
cp ./ssl.crt ./client/src/ssl/

mkdir -p ./service/src/ssl
cp ./ssl.key ./service/src/ssl/
cp ./ssl.crt ./service/src/ssl/

 
/usr/local/bin/docker-compose -f prod.yml stop;
/usr/local/bin/docker-compose -f prod.yml up -d;
