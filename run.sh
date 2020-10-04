#!/bin/bash

if [ ! -d "/tmp/cert" ]; then    
    mkdir -p /tmp/cert
    openssl req -x509 -newkey rsa:4096 -keyout /tmp/cert/privkey.pem \
    -out /tmp/cert/fullchain.pem -days 365 --nodes    
fi

if [ ! -d "/tmp/dhparam" ]; then
    mkdir -p /tmp/dhparam    
    openssl dhparam -out /tmp/dhparam/dhparam-2048.pem 2048
fi

VER=latest docker-compose -f docker-compose.yml -f docker-compose-dev.yml up -d --force-recreate --build