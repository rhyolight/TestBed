var sys = require('sys'),
    fs = require('fs')

exports.handleBody = function(b) {
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
};

exports.prepDirectory = function() {
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
}