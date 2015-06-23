compass compile "/data/src";

echo "Configuration: $CONFIGURATION";

if  [ "$CONFIGURATION" == "DEBUG" ]; then
    echo "Starting server in debug mode...";
    http-server .  -c-1 --cors;
    echo "Server stopped.";
fi

if [ "$CONFIGURATION" == "PRODUCTION" ]; then
    echo "Starting server in production mode...";
    http-server .  -c-1 --cors;
    echo "Server stopped.";
fi
