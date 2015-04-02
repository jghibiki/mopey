# mopey
A mopidy web client and api stack intended for a user request based music system. Will include a karma and user management system to help mitigate spam requests.

Notes:
- Requires a file called search-api.key in the root of the repository. This file should contain a google application api key that has been granted access to the youtube api.
- Many of the api calls require authentication. Additionally several require the authenticated user to be an admin.



Example Authentication Calls:
1. To get an authentication token call:
    - Request:
        - httpie:
            ```shell
            $ http POST :8080/authenticate username="jdoe" password="pass"
            ```

        - curl:
            ```shell
            $ curl -X POST -d '{"username":"jdoe", "password":"pass"}' localhost:8080/authenticate
            ```
    - Response:
        ```json
        {
            "access_token": "3eeaa1bc-ec9f-430f-bfe9-69abd2d9f9e6",
            "expiration_date": "Thu, 02 Apr 2015 19:00:00 GMT"
        }
        ```
2. To determine if an access token is still valid and not expired:
    - Request:
        - httpie:
            ```shell
            $ http POST :8080/authenticate/verify token="3eeaa1bc-ec9f-430f-bfe9-69abd2d9f9e6"
            ```
        - curl:
            ```shell
            $ curl -X POST -d '{"token":"3eeaa1bc-ec9f-430f-bfe9-69abd2d9f9e6"}' localhost:8080/authenticate/verify
            ```
    - Response:
        ```json
        {
            "result":"true" //access token is valid
        }
        ```
        or

        ```json
        {
            "result":"false" //access token is invalid or expired
        }
        ```
3. To determine if an authenticated user is an admin:
    - Request:
        - httpie:
            ```shell
            $ http POST :8080/authenticate/verify/admin token="3eeaa1bc-ec9f-430f-bfe9-69abd2d9f9e6"
            ```
        - curl:
            ```shell
            $ curl -X POST -d '{"token":"3eeaa1bc-ec9f-430f-bfe9-69abd2d9f9e6"}' localhost:8080/authenticate/verify/admin
            ```
    - Response:
        ```json
        {
            "result":"true" //user is an admin
        }
        ```
        or

        ```json
        {
            "result":"false" //user is not an admin
        }
        ```
4. To make a call using an auth token:
    - httpie:
        ```shell
        $ http {VERB} :8080/{API-ENDPOINT} Authorization:'3eeaa1bc-ec9f-430f-bfe9-69abd2d9f9e6'"
        ```
    - curl:
        ```shell
        $ curl -X {VERB} -H "Authorization:3eeaa1bc-ec9f-430f-bfe9-69abd2d9f9e6" localhost:8080/{API-ENDPOINT} 
        ```

