echo "Configuration: $CONFIGURATION";

if  [ "$CONFIGURATION" == "DEBUG" ]; then
    echo "Starting server in debug mode...";
    python Server.py 2>&1 | /node_modules/rtail/cli/rtail-client.js --id "API" --tty --host logs;
    echo "Server stopped.";
fi

if [ "$CONFIGURATION" == "PRODUCTION" ]; then
    echo "Starting server in production mode...";
    echo "Starting with $WORKERS workers.";
    gunicorn -w $WORKERS -b 0.0.0.0:5000 --keyfile=./ssl/ssl.key --certfile=./ssl/ssl.crt --log-file=- --log-level=DEBUG Server:app 2>&1 | /node_modules/rtail/cli/rtail-client.js --id "API" --tty --host logs;
    echo "Server stopped.";
fi
