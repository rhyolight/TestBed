YUI().add('testbed', function(Y) {
    
    function extractParam(name) {
        var regex = null, 
            results = null;
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        regex = "[\\?&]"+name+"=([^&#]*)";
        regex = new RegExp( regex );
        results = regex.exec( window.location.href );
        if( results == null ) {
            return [];
        } else {
            if (results[1].indexOf(',') < 0) {
                return [results[1]];
            } else {
                return results[1].split(',');
            }
        }
    }
	
	Y.TestBed = {
        run: function(cfg) {
            var suites = extractParam('suites'),
                testnames = null,
                i = 0, j = 0, k = 0,
                testsuite = null; 
            
            if (suites.length) {
                // run only specified suites
                for(i = 0; i < suites.length; i++) {
                    Y.Test.Runner.add(this[suites[i]]);
                }
            } else {
                // run all suites
                for (testsuite in this) {
                    if (!(this[testsuite] instanceof Function)) {
                        Y.Test.Runner.add(this[testsuite]);
                    }
                }
            }
            
            // if there are testnames as well, turn off all tests in the suites
            // specified except the named tests
            testnames = extractParam('tests');
            if (testnames.length) {
                for (i = 0; i < Y.Test.Runner.masterSuite.items.length; i++) {
                    var mSuite = Y.Test.Runner.masterSuite.items[i];
                    var toRemove = [];
                    for (j = 0; j < mSuite.items.length; j++) {
                        var mTestCase = mSuite.items[j];
                        for (var func in mTestCase) {
                            if (mTestCase[func] instanceof Function && func.indexOf('test') == 0) {
                                var found = false;
                                for (k = 0; k < testnames.length; k++) {
                                    if (testnames[k] == func) {
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) {
                                    toRemove.push(j);
                                }
                            }
                        }
                    }
                    for (j = toRemove.length - 1; j >= 0; j--) {
                        // removing test case
                        mSuite.items.splice(toRemove[j], 1);
                    }
                }
            }
            
            if (cfg.report.screen) {
                //initialize the console and render
                new Y.Console(cfg.report.screen).render('#log');
            }

            //run the tests
            Y.Test.Runner.run();
        
        }
    };
}, '1.0', { requires: ['test', 'console'] });