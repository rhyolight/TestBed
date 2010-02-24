#!/bin/bash

# TODO: allow for not only 'en1' but 'eth0'
ipAddress=`ifconfig en1 | grep 'inet ' | cut -d " " -f 2`
port=8003
selectors=$1
url="http://$ipAddress:$port"
webRoot=js/test/testbed/testBedServer/webroot
tmpDir=/tmp/testbed

if [ -n "$selectors" ]; then
    url=$url?$1
fi

if [ -e tmpDir ]; then
    rm -rf $tmpDir
fi

mkdir $tmpDir

# echo "--> removing existing webroot at $webRoot"
rm -rf $webRoot
# echo "--> copying to staging directory"
cp index.html $tmpDir
cp -r js $tmpDir
# echo "--> removing testbed server from stagin directory"
rm -rf $tmpDir/js/test/testbed/testBedServer
# echo "--> creating new webroot"
mkdir js/test/testbed/testBedServer/webroot
# echo "--> copying over stating into webroot"
cp -r $tmpDir/* $webRoot

# server will kill itself after it gets a request for static files
node js/test/testbed/testBedServer/testserver.js &

echo "Sending $url to Selenium server for testing..."
java -jar lib/yuitest-selenium-driver-0.5.2.jar --conf yui-test-driver.properties $url