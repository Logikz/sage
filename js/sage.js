var TraceLevel = {
	ERROR: 0,
	WARN: 1,
	INFO: 2,
	DEBUG: 3
}
var traceLevel = TraceLevel.ERROR;

var main = function (){
	var options = require( "nomnom" )
		.option( 'trace_level', {
			abbr: 't',
			choices: [0, 1, 2, 3],
			help: 'Sets the trace level of the program.  Default is 0(Errors only). Available options are 0-3.',
			callback:function( trace_level ){
				switch( trace_level ){
					case '0':
						traceLevel = TraceLevel.ERROR;
						break;
					case '1':
						traceLevel = TraceLevel.WARN;
						break;
					case '2':
						traceLevel = TraceLevel.INFO;
						break;
					case '3':
						traceLevel = TraceLevel.DEBUG;
						break;
				}
			}
		} )
		.option( 'repository', {
			help: 'The repository to list the top 10 contributors.',
			position: 0
		} )
		.option( 'owner', {
			help: 'The owner of the repository.',
			position: 1
		} )
		.option( 'anonymous', {
			abbr: 'a',
			help: 'Include anonymous contributors',
			flag: true
		} )
		.help( "This module is designed to find a particular repository on github and return the top 10 contributors for that repository." )
		.parse()
	dprint( TraceLevel.INFO, "Arguments successfully parsed" );
	if(options.repository == null && options.owner == null ){
		dprint( TraceLevel.ERROR , "Repository and owner are required.  For more information please run with -h option" );
	} else {
		requestUrl( options.repository, options.owner, options.anonymous );	
	}
	
}

var requestUrl = function ( repository, owner, includeAnonymous ){
	host = "api.github.com"
	var headers = {
		"host": host,
		"user-agent": "Logikz-Sage-Demo",
		"content-length":0
	};
	
	path = "/repos/" + owner + "/" + repository + "/contributors";
	if ( includeAnonymous ){
		path += '?anon=1';
	}
	options = {
		host: host,
		port: 443,
		path: path,
		headers: headers
	};
	var https = require( 'https' );
	dprint( TraceLevel.DEBUG, "Requesting URL: " + host + path );
	https.get( options, handleResponse )
	.on( 'error', handleError );
}

var handleResponse = function ( response ) {
	dprint( TraceLevel.DEBUG, "Got Response: " + response.statusCode );
	dprint( TraceLevel.DEBUG, "Got Headers: " + JSON.stringify( response.headers) );
	response.setEncoding( "utf8" );
	var data = "";
	response.on( 'data', function ( chunk ){
		dprint( TraceLevel.DEBUG, "Got chunk" );
		data += chunk;
	} );
	response.on( 'end', function(){
		createReport( data )
	} );
}

var handleError = function ( error ){
	dprint( TraceLevel.ERROR, error.message );
	dprint( TraceLevel.ERROR, error.stack );
}

var createReport = function ( data ){
	if ( data != null || data != '') {
		dprint( TraceLevel.INFO, "Creating Report" );
		var contributors = JSON.parse( data )
		var report = "";
		var sprintf = require( 'sprintf-js' ).sprintf;
		var format = "%02f. %-39s %10s\n";
		for (var i = 0; i < contributors.length && i < 10; ++i ){
			if ( contributors[ i ].type == 'User' ){
				//regular user
				report += sprintf( format, i + 1, contributors[ i ].login, contributors[ i ].contributions );
			} else {
				//anonymous user
				report += sprintf( format, i + 1, contributors[ i ].name, contributors[ i ].contributions );
			}			
		}

		console.log( report );
	}
}

var dprint = function ( message_level, message ){
	if( message_level <= traceLevel ){
		console.log( getLevelString( message_level ) + message );
	}
}

function getLevelString( message_level ){
	result = ""
	switch( message_level ){
		case TraceLevel.ERROR:
			result = "[ERROR]";
			break;
		case TraceLevel.WARN:
			result = "[WARN]";
			break;
		case TraceLevel.INFO:
			result = "[INFO]";
			break;
		case TraceLevel.DEBUG:
			result = "[DEBUG]";
			break;
	}
	return result;
}

main();

exports.createReport = createReport;
exports.handleResponse = handleResponse;
