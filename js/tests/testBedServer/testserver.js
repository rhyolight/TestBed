var
  sys = require('sys'),
  path = require('path'),
  http = require('http'),
  url = require('url'),
  fs = require('fs'),
  multipart = require("multipart"),
  //paperboy = require('../lib/paperboy'),
  PORT = 8003;
  
function handleBody(b) {
    sys.puts('writing body of request to file...');
    var pieces = b.split('&'), params = {};
    pieces.forEach(function(piece) {
        var p = piece.split('=');
        params[p[0]] = p[1];
    });
    var filepath = '../reports/' + params.suitename + '.xml';
    sys.puts('... to ' + filepath);
    fs.unlink(filepath)
        .addCallback(function() { sys.puts('old ' + filepath + ' deleted.')})
        .addErrback(function(err) { sys.puts('could not delete ' + filepath + ': ' + err)});
    sys.exec('touch ' + filepath).addCallback(function() {
        sys.puts(filepath + ' was created.');
    });
    fs.open(filepath, 'w+', 0777).addCallback(function(openFd) {
        var spaceReplace = params.results.replace(/\+/g,' ');
        fs.write(openFd, unescape(spaceReplace)).addCallback(function(bytesWritten) {
            sys.puts(bytesWritten + ' to ' + filepath);
            fs.close(openFd).addCallback(function() {
                sys.puts(filepath + ' closed.');
            }).addErrback(function() {
                sys.puts(filepath + ' could not be closed!');
            });
        }).addErrback(function() {
            sys.puts(filename + ' could not be written to.');
        });
    }).addErrback(function(err) {
        sys.puts('error creating ' + filepath + ': ' + err);
    });
}

http.createServer(function(req, res) {
    var partCnt = 0, outputFile = undefined, fullBody = '';

    var mp = multipart.parse(req),
        fields = {},
        name,
        filename;
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
        handleBody(fullBody);
        sys.puts('sending header');
        res.sendHeader(200, {
            "content-type": "text/plain",
            "content-length": 0
        });
        res.write('');
        sys.puts('closing request');
        res.close();
    });
}).listen(PORT);

sys.puts("Server running at http://127.0.0.1:" + PORT + "/");

(function() {
    var reportMaker = function() {
        fs.mkdir('../reports', 0777).addCallback(function() {
            sys.puts('empty reports directory created.');
        });
    };
    fs.stat('../reports').addCallback(function(stats) {
        sys.puts('removing existing reports directory...');
        process.createChildProcess('rm', ['-rf', '../reports']).addListener('exit', function() {
            sys.puts('../reports deleted.');
            reportMaker();
        }).addListener('error', function(err) {
            if (err) {
                sys.puts('error removing reports directory: ' + err);            
            }
        });
    }).addErrback(reportMaker);
}());