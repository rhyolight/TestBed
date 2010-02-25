// requires TestBed.js
YUI.add('service_tests', function(Y) {
    
    Y.TestBed.service_tests = new Y.Test.Suite({
        name: 'Service Tests Suite 1'
    });
    
    Y.TestBed.service_tests.add(new Y.Test.Case({
        name: 'Service test case 1', 
        
        testSome_Service_Thing: function() {
            Y.Assert.isTrue(true);
        }
    }));

    Y.TestBed.service_tests.add(new Y.Test.Case({
        name: 'Service test case 2', 
        
        testSomeOther_Service_Thing: function() {
            Y.Assert.isTrue(true);
        }
    }));

}, '1.0', { requires: ['testbed'] });