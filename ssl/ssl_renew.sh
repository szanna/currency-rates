#!/bin/bash

docker run --rm -it --name certbotrenew \
-v "certbot-etc:/etc/letsencrypt" \
-v "certbot-var:/var/lib/letsencrypt" \
-v "certbot-www:/usr/share/letsencrypt" \
--mount src="$(pwd)",target=/var/log/letsencrypt,type=bind \
certbot/certbot renew --webroot -w /usr/share/letsencrypt --quiet && \
docker exec front nginx -s reload



