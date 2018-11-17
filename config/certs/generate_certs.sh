#!/usr/bin/env bash
echo "Generating Certs for express app"

openssl req -nodes -new -x509 -keyout server.key -out server.cert