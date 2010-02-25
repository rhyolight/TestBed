var
  sys = require('sys'),
  path = require('path'),
  http = require('http'),
  reportwriter = require('./lib/reportwriter'),
  url = require('url'),
  fs = require('fs'),
  multipart = require('multipart'),
  paperboy = require('./lib/paperboy'),
  seppuku = require('./lib/seppuku'),
  PORT = 8003,
  TIME_TO_SEPPUKU = 15000,
  WEBROOT = path.join(path.dirname(__filename), 'webroot');
  
http.createServer(function(req, res) {
    var partCnt = 0, outputFile = undefined, fullBody = '', mp = undefined;
    
    if (req.method == 'POST') {
        mp = multipart.parse(req);
        mp.addListener("error", function(er) {
            res.sendHeader(400, {"content-type": "text/plain"});
            res.write("You sent a bad message!n" + er.message);
            res.close();
        });
        mp.addListener("partBegin", function(part) {
            //sys.puts('part begin: ' + sys.inspect(part.headers));
        });
        mp.addListener("body", function(chunk) {
            sys.puts('RECEIVING BODY PART ' + ++partCnt);
            fullBody += chunk;
        });
        mp.addListener("complete", function() {
            sys.puts('COMPLETE');
            reportwriter.handleBody(fullBody);
            sys.puts('sending header');
            res.sendHeader(200, {
                "content-type": "text/plain",
                "content-length": 0
            });
            res.write('');
            sys.puts('closing request');
            res.close();
            seppuku.suicideWatch();
        });
    } else {
        paperboy
            .deliver(WEBROOT, req, res)
            .before(function() {
                sys.puts('paperboy about to deliver ' + req.url);
            })
            .after(function() {
                sys.puts('paperboy delivered ' + req.url);
                seppuku.suicideWatch();
            })
            .error(function() {
                sys.puts('paperboy could not deliver ' + req.url);
            })
            .otherwise(function() {
                res.sendHeader(404, {'Content-Type': 'text/plain'});
                res.write('Sorry, no paper this morning!');
                res.close();
            });
    }
    
}).listen(PORT);

sys.puts("Server running at http://127.0.0.1:" + PORT + "/");

reportwriter.prepDirectory();