#!/bin/bash

# https://werkzeug.palletsprojects.com/en/3.0.x/serving/

python manage.py runserver_plus --cert-file ./statics/ssl-fake/cert.pem --key-file ./statics/ssl-fake/key.pem 0.0.0.0:443