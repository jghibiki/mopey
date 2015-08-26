compass compile "/data/src";

echo "Configuration: $CONFIGURATION";

if  [ "$CONFIGURATION" == "DEBUG" ]; then
    echo "Starting server in debug mode...";
    http-server .  -c-1 --cors 2>&1 | node_modules/rtail/cli/rtail-client.js --id "Client" --tty --host logs;
    echo "Server stopped.";
fi

if [ "$CONFIGURATION" == "PRODUCTION" ]; then
    echo "Starting server in production mode...";
    http-server .  -c-1 --cors -S -C ./ssl/ssl.crt -K ./ssl/ssl.key  2>&1 | node_modules/rtail/cli/rtail-client.js --id "Client" --tty --host logs;
    echo "Server stopped.";
fi
