#!/usr/bin/python3

from trajectory import app

if __name__ == "__main__":
   app.run(port=80, host='0.0.0.0', ssl_context='adhoc')