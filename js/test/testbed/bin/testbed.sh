#!/bin/bash

# TODO: allow for not only 'en1' but 'eth0'
ipAddress=`ifconfig en1 | grep 'inet ' | cut -d " " -f 2`
port=8003
selectors=$1
url="http://$ipAddress:$port"
webroot=js/test/testbed/testBedServer/webroot
tmpDir=/tmp/testbed

testhtml=''
isLocal=false
testnames=''
suitenames=''

# cmd line options processing
processOptions () {
  while getopts "lt:s:" optname
    do
      case "$optname" in
        "l")
          isLocal=true
          ;;
        "t")
          testnames=$OPTARG
          ;;
        "s")
          suitenames=$OPTARG
          ;;
        "?")
          # TODO: print usage
          exit
          ;;
        ":")
          # TODO: print usage
          exit
          ;;
        *)
          # Should not occur
          # TODO: print usage
          exit
          ;;
      esac
    done
  return $OPTIND
}
# cmd line argument processing
processArguments() {
  testhtml="$1"
}

processOptions "$@"
argstart=$?
processArguments "${@:argstart}"

echo "test html: $testhtml"
echo "testnames: $testnames"
echo "suitenames: $suitenames"

if [ -n "$testhtml" ]; then
    url+="/$testhtml"
fi
if [ -n "$suitenames" ]; then
    url=$url?suites=$suitenames
fi
if [ -n "$testnames" ]; then
    delimit='?'
    if [ -n "$suitenames" ]; then
        delimit='&'
    fi
    url+="${delimit}tests=${testnames}"
fi

echo "URL: $url"

if [ -e tmpDir ]; then
    rm -rf $tmpDir
fi

mkdir $tmpDir

echo "--> removing existing webroot at $webroot"
rm -rf $webroot
echo "--> copying to staging directory"
tar -C . --wildcards --wildcards-match-slash --exclude={reports,.git,*yui*/src,*yui*/api,*yui*/as-api,*yui*/sandbox,yui*/src} -hcf - . | tar -C $tmpDir -xpf -
echo "--> removing testbed server from stagin directory"
rm -rf $tmpDir/js/test/testbed/testBedServer $tmpDir/js/test/testbed/bin $tmpDir/js/test/testbed/lib
echo "--> creating new webroot"
mkdir js/test/testbed/testBedServer/webroot
echo "--> copying over staging into webroot"
cp -r $tmpDir/* $webroot
echo "--> removing tmpdir at $tmpDir"
rm -rf $tmpDir

# server will kill itself after not getting any requests for awhile
node js/test/testbed/testBedServer/testserver.js &

echo "Sending $url to Selenium server for testing..."
java -jar js/test/testbed/lib/yuitest-selenium-driver-0.5.2.jar --conf js/test/testbed/yui-test-driver.properties $url