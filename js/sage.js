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
		.help( "This module is designed to find a particular repository on github and return the top 10 contributors for that repository." )
		.parse()
	dprint( TraceLevel.INFO, "Arguments successfully parsed" );
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