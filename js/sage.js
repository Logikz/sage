var TraceLevel = {
	ERROR: 0,
	WARN: 1,
	INFO: 2,
	DEBUG: 3
}
var traceLevel = TraceLevel.ERROR;

function main(){
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
			position: 0,
			required: true
		} )
		.option( 'owner', {
			help: 'The owner of the repository.',
			position: 1,
			required: true
		} )
		.option( 'anonymous', {
			abbr: 'a',
			help: 'Include anonymous contributors',
			flag: true
		} )
		.help( "This module is designed to find a particular repository on github and return the top 10 contributors for that repository." )
		.parse()
	dprint( TraceLevel.INFO, "Arguments successfully parsed" );
	requestUrl( options.repository, options.owner, options.anonymous );
}

function requestUrl( repository, owner, includeAnonymous ){
	host = "api.github.com"
	var headers = {
		"host": host,
		"user-agent": "Logikz-Sage-Demo",
		"content-length":0
	};
	
	path = "/repos/" + owner + "/" + repository + "/contributors";
	if ( includeAnonymous ){
		path += '&anon=1';
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

function handleResponse( response ) {
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

function handleError( error ){
	dprint( TraceLevel.ERROR, error.message );
	dprint( TraceLevel.ERROR, error.stack );
}

function createReport( data ){
	dprint( TraceLevel.INFO, "Creating Report" );
	var contributors = JSON.parse( data )
	for (var i = 0; i < contributors.length && i < 10; ++i ){
		console.log( (i + 1) + ". " + contributors[i].login );
	}
}

function dprint( message_level, message ){
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