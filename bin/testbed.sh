#!/bin/bash

# TODO: allow for not only 'en1' but 'eth0'
MYIP=`ifconfig en1 | grep 'inet ' | cut -d " " -f 2`
WEBROOT=js/test/testbed/testBedServer/webroot
TMP=/tmp/testbed

if [ -e TMP ]; then
    rm -rf $TMP
fi

mkdir $TMP

# echo "--> removing existing webroot at $WEBROOT"
rm -rf $WEBROOT
# echo "--> copying to staging directory"
cp index.html $TMP
cp -r js $TMP
# echo "--> removing testbed server from stagin directory"
rm -rf $TMP/js/test/testbed/testBedServer
# echo "--> creating new webroot"
mkdir js/test/testbed/testBedServer/webroot
# echo "--> copying over stating into webroot"
cp -r $TMP/* $WEBROOT

# server will kill itself after it gets a request for static files
node js/test/testbed/testBedServer/testserver.js &

java -jar lib/yuitest-selenium-driver-0.5.2.jar --conf yui-test-driver.properties http://$MYIP:8003