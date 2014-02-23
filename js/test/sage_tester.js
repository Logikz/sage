try {
	var reporter = require('nodeunit').reporters.default;
} catch(e) {
	console.log("Cannot find nodeunit module.");
    console.log("You can download submodules for this project by doing:");
    console.log("");
    console.log("    git submodule init");
    console.log("    git submodule update");
    console.log("");
    process.exit();
}

var sage = require('../sage.js');

var dataWithAnonymous = '[{"login":"nick","id":123456, "contributions": 150, "type":"User"},{"login":"logikz", "id":123457, "contributions":125, "type":"User"},{"type":"Anonymous", "name":"Bob Smith", "contributions":100}]';
var dataWithoutAnonymous = '[{"login":"nick","id":123456, "contributions": 150, "type":"User"},{"login":"logikz", "id":123457, "contributions":125, "type":"User"}]';
var incompleteData = '[{"login":"nic';

exports['Test Data with Anonymous data'] = function( test ){
	test.expect( 1 );
	var _log = console.log;
	console.log = function( str ) {
		test.equal(str, '1. nick\t150\n2. logikz\t125\n3. Bob Smith\t100\n');
	}
	sage.createReport( dataWithAnonymous );
	console.log = _log;
	test.done();
}

exports['Test Data without Anonymous data'] = function( test ){
	test.expect( 1 );
	var _log = console.log;
	console.log = function( str ) {
		test.equal(str, '1. nick\t150\n2. logikz\t125\n');
	}
	sage.createReport( dataWithoutAnonymous );
	console.log = _log;
	test.done();
}

exports['Test with bad data'] = function ( test ) {
	test.expect( 5 );
	test.throws( function() { sage.createReport( incompleteData ); } );
	test.throws( function() { sage.createReport( "" ); } );
	test.throws( function() { sage.createReport( "sdfkjasdoj1236sdf61@!%@" ); } );
	test.throws( function() { sage.createReport( null ); } );
	test.throws( function() { sage.createReport( undefined ); } );
	test.done();
}

exports['Test Response'] = function ( test ) {
	test.expect( 1 );
	var nock = require('nock');
	var path = '/repos/nick/test/contributors';
	var mockUrl = nock('http://sage-test.com')
		.get(path)
		.reply(200, {"login":"nick","id":123456, "contributions": 150, "type":"User"});

	var http = require('http');
	var options = {
		host: 'sage-test.com',
		path: path,
		method: 'GET'
	}
	var request = http.request( options, function( response ) {
		test.doesNotThrow(function() { sage.handleResponse(response); } );
		test.done();
	});

	request.end();
}