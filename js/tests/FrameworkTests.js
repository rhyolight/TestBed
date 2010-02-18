// requires TestBed.js
YUI.add('framework_tests', function(Y) {
    
    Y.TestBed.framework_tests = new Y.Test.Suite({
        name: 'Framework Tests Suite 1'
    });
    
    Y.TestBed.framework_tests.add(new Y.Test.Case({
        name: 'Framework test case 1', 
        
        testSomething_Frameworky: function() {
            Y.Assert.isTrue(true);
        }
    }));

    Y.TestBed.framework_tests.add(new Y.Test.Case({
        name: 'Framework test case 2', 
        
        testSomethingElse_Frameworky: function() {
            Y.Assert.isTrue(true);
        }
    }));

}, '1.0', { requires: ['testbed'] });