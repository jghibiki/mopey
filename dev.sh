cp ./search-api.key ./api/src/search-api.key;

if [ -f ./dev-api.js ] 
then
    cp ./dev-api.js ./client/src/js/api-mappings.js;
else
    echo "No dev-api.js found, using prod-api.js instead";
    cp ./prod-api.js ./client/src/js/api-mappings.js;
fi

docker-compose -f dev.yml stop;
docker-compose -f dev.yml up -d ;
