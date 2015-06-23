echo "Configuration: $CONFIGURATION";

if  [ "$CONFIGURATION" == "DEBUG" ]; then
    echo "Starting server in debug mode...";
    python Server.py
    echo "Server stopped.";
fi

if [ "$CONFIGURATION" == "PRODUCTION" ]; then
    echo "Starting server in production mode...";
    echo "Starting with $WORKERS workers.";
    gunicorn -w $WORKERS -b 0.0.0.0:5000 Server:app
    echo "Server stopped.";
fi
