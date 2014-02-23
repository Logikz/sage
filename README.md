sage
====

NodeJS project for Sage Interview by Nick Cuneo.  

This demo queries a Git repository and prints a report of the top 10 contributors for a particular repository.

Installation
------------
Clone/download the project from 

	https://github.com/Logikz/sage.git


Install the required submodules

	git submodule init
	git submodule update


Usage
-----
To run the script using node from command line:

	node sage <repository> <owner/user> [-t #] [-a]


	Usage: node sage [repository] [owner] [options]

	repository     The repository to list the top 10 contributors.
	owner          The owner of the repository.

	Options:
	   -t, --trace_level   Sets the trace level of the program.  Default is 0(Errors
	only). Available options are 0-3.
	   -a, --anonymous     Include anonymous contributors

This module is designed to find a particular repository on github and return the
 top 10 contributors for that repository.

 Unit Tests
 ----------
 * Unit tests were created using nodeunit( https://github.com/caolan/nodeunit ).  
 * HTTP server mocking was done with Nock ( https://github.com/pgte/nock )

 To run the unit tests:
 	nodeunit sage-test.js
