var sys = require('sys'),
    timeOfLastReq = 0,
    TIME_TO_SEPPUKU = 15000;

exports.suicideWatch = function() {
    if (timeOfLastReq === 0) {
          setInterval(function() {
              // sys.puts('the time for my death draws near...');
              if ((new Date().getTime() - timeOfLastReq) > TIME_TO_SEPPUKU) {
                  sys.puts('testbed server committing seppuku... URGHUP!!  (such noble death)');
                  process.exit();                                                                        
              }
          }, (TIME_TO_SEPPUKU / 2));
      }
      timeOfLastReq = new Date().getTime();
};