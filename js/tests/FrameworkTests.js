// requires TestBed.js
YUI.add('framework_tests', function(Y) {
    
    Y.TestBed.framework_tests = new Y.Test.Suite({
        name: 'Framework Tests Suite 1'
    });
    
    Y.TestBed.framework_tests.add(new Y.Test.Case({
        name: 'Framework test case 1', 
        
        testSomething_Frameworky: function() {
            Y.Assert.isTrue(false);
        }
    }));

    Y.TestBed.framework_tests.add(new Y.Test.Case({
        name: 'Framework test case 2', 
        
        testSomethingElse_Frameworky: function() {
            Y.Assert.isTrue(true);
        }
    }));
    
    // creating a shitload of test cases to test the nodejs server
    for (var i = 0; i < 50; i++) {
        var testNum = i + 1,
            testFuncName = 'testStuff_' + testNum,
            testCaseCfg = {};
            
        testCaseCfg.name = testNum + ' of 100 tests',
        testCaseCfg[testFuncName] = function() {
            Y.Assert.isTrue(true);
        };
        
        Y.TestBed.framework_tests.add(new Y.Test.Case(testCaseCfg));
    }

}, '1.0', { requires: ['testbed'] });