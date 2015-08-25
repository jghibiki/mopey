echo "Configuration: $CONFIGURATION";


if  [ "$CONFIGURATION" == "DEBUG" ]; then
    echo "Starting server in debug mode...";
    stdbuf -oL python -u Service.py 2>&1 | rtail --id "Service" --tty --host logs;
    echo "Server stopped.";
fi

if [ "$CONFIGURATION" == "PRODUCTION" ]; then
    echo "Starting server in production mode...";
    python Service.py 2>&1 | rtail --id "Service" --tty --host logs;
    echo "Server stopped.";
fi
