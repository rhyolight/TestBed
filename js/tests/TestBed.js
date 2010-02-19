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
                    var toIgnore = [];
                    for (j = 0; j < mSuite.items.length; j++) {
                        var mTestCase = mSuite.items[j];
                        if (!mTestCase._should.ignore) {
                            mTestCase._should.ignore = {};
                        }
                        for (var func in mTestCase) {
                            if (mTestCase[func] instanceof Function && func.indexOf('test') == 0) {
                                var found = false;
                                for (k = 0; k < testnames.length; k++) {
                                    if (testnames[k] != func) {
                                        mTestCase._should.ignore[func] = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            if (cfg.report.screen) {
                //initialize the console and render
                new Y.Console(cfg.report.screen).render('#log');
            } 
            if (cfg.report.post) {
                var reporter = new Y.Test.Reporter(cfg.report.post.url);
				var resultsHandler = function(testResults) {
				    // before doing the reporting, I want to add another param to the 
				    // reporter's POST containing the test suite name, this way I don't 
				    // have to parse the results to get the name on the test server
                    reporter._fields.suitename = testResults.testSuite.name;
					reporter.report(testResults.results);
				};
                
                Y.Test.Runner.subscribe(Y.Test.Runner.TEST_SUITE_COMPLETE_EVENT, resultsHandler);
            }
            
            //run the tests
            Y.Test.Runner.run();
        }
    };
}, '1.0', { requires: ['test', 'console', 'event'] });