#!/bin/bash

docker run --rm -it --name certbot_info \
-v certbot-etc:/etc/letsencrypt \
-v certbot-var:/var/lib/letsencrypt \
-v certbot-www:/usr/share/letsencrypt \
certbot/certbot \
--staging \
certificates
