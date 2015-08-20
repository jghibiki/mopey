echo "Configuration: $CONFIGURATION";

if  [ "$CONFIGURATION" == "DEBUG" ]; then
    echo "Starting server in debug mode...";
    python Service.py
    echo "Server stopped.";
fi

if [ "$CONFIGURATION" == "PRODUCTION" ]; then
    echo "Starting server in production mode...";
    python Service.py
    echo "Server stopped.";
fi
