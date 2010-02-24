// requires TestBed.js
YUI.add('foo_tests', function(Y) {
    
    Y.TestBed.foo_tests = new Y.Test.Suite({
        name: 'Foo Tests Suite 1'
    });
    
    Y.TestBed.foo_tests.add(new Y.Test.Case({
        name: 'Foo test case 1', 
        
        testSomething_Fooy: function() {
            Y.Assert.isTrue(false);
        }
    }));

    Y.TestBed.foo_tests.add(new Y.Test.Case({
        name: 'Foo test case 2', 
        
        testSomethingElse_Fooy: function() {
            Y.Assert.isTrue(true);
        }
    }));

}, '1.0', { requires: ['testbed'] });