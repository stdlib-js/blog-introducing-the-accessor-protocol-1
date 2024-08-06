#!/usr/bin/env node

/**
* @license Apache-2.0
*
* Copyright (c) 2024 The Stdlib Authors.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

/* eslint-disable node/no-unsupported-features/es-syntax */

'use strict';

// MODULES //

const resolve = require( 'path' ).resolve;
const readDir = require( '@stdlib/fs-read-dir' ).sync;
const readFileList = require( '@stdlib/fs-read-file-list' ).sync;
const RE_EOL = require( '@stdlib/regexp-eol' ).REGEXP;
const isArray = require( '@stdlib/assert-is-array' );
const isSameArray = require( '@stdlib/assert-is-same-array' );
const max = require( '@stdlib/stats-base-max' );
const entries = require( '@stdlib/utils-entries' );
const format = require( '@stdlib/string-format' );
const floor = require( '@stdlib/math-base-special-floor' );
const roundn = require( '@stdlib/math-base-special-roundn' );


// VARIABLES //

const DIR = resolve( __dirname, '..', 'benchmark' );
const RE_FILE = /benchmark\.sum\.(.+)\.results\.txt$/;
const FOPTS = {
	'encoding': 'utf8'
};
const NAME_TABLE = {
	'accessor_protocol': 'Accessor Protocol',
	'indexed_collection': 'Indexed Collection',
	'iterator': 'Iterator',
	'property_accessors': 'Property Accessors',
	'proxy': 'Proxy'
};
const RE_LEN = /len=(\d+)/;
const RE_RATE = /rate: ([.\d]+)/;


// FUNCTIONS //

/**
* Converts a list of relative file paths to absolute file paths.
*
* @private
* @param {Array<string>} files - list of files
* @returns {Array<string>} list of absolute file paths
*/
function rel2abs( files ) {
	const out = [];
	for ( const f of files ) {
		out.push( resolve( DIR, f ) );
	}
	return out;
}

/**
* Filters a file list for results files.
*
* @private
* @param {Array<string>} files - list of files
* @returns {Array<string>} filtered list
*/
function filter( files ) {
	const out = [];
	for ( const f of files ) {
		if ( RE_FILE.test( f ) ) {
			out.push( f );
		}
	}
	return out;
}

/**
* Resolves a benchmark name.
*
* @private
* @param {string} fpath - file path
* @returns {string} benchmark name
*/
function resolveName( fpath ) {
	const m = fpath.match( RE_FILE );
	if ( m ) {
		return NAME_TABLE[ m[ 1 ] ];
	}
	return '(unknown)';
}

/**
* Processes raw results data in order to extract benchmark results.
*
* @private
* @param {string} txt - raw results data
* @returns {Array} results as a strided array
*/
function processRawData( txt ) {
	const lines = txt.split( RE_EOL );
	const out = [];
	for ( const line of lines ) {
		let m = line.match( RE_LEN );
		if ( m ) {
			out.push( parseInt( m[ 1 ], 10 ) );
			continue;
		}
		m = line.match( RE_RATE );
		if ( m ) {
			out.push( parseFloat( m[ 1 ] ) );
		}
	}
	return out;
}

/**
* Groups benchmark results.
*
* @private
* @param {Array} x - strided array of results
* @returns {Object} grouped results
*/
function groupResults( x ) {
	const out = {};
	for ( let i = 0; i < x.length; i += 2 ) {
		const len = x[ i ];
		const o = out[ len ];
		if ( isArray( o ) ) {
			o.push( x[ i+1 ] );
		} else {
			out[ len ] = [ x[ i+1 ] ];
		}
	}
	return out;
}

/**
* Computes the maximum rate for each group.
*
* @private
* @param {Object} results - object containing grouped results
* @returns {Object} finalized results
*/
function computeMaximumRates( results ) {
	const out = {
		'lengths': [],
		'rates': []
	};
	for ( const res of entries( results ) ) {
		out.lengths.push( parseInt( res[ 0 ], 10 ) );

		const data = res[ 1 ];
		out.rates.push( floor( max( data.length, data, 1 ) ) );
	}
	return out;
}

/**
* Processes file objects.
*
* ## Notes
*
* -   This function mutates the input array.
*
* @private
* @param {Array<Object>} files - file objects
* @returns {Array<Object>} input list of file objects
*/
function processFiles( files ) {
	for ( const f of files ) {
		f.name = resolveName( f.file );
		f.raw_results = processRawData( f.data );
		f.grouped_results = groupResults( f.raw_results );
		f.results = computeMaximumRates( f.grouped_results );
	}
	return files;
}

/**
* Simplifies processed result data.
*
* @private
* @param {Array<Object>} data - result data
* @returns {Array<Object>} results
*/
function simplifyResults( data ) {
	const out = [];
	for ( const d of data ) {
		const o = {
			'name': d.name,
			'lengths': d.results.lengths,
			'rates': d.results.rates
		};
		out.push( o );
	}
	return out;
}

/**
* Zips results together.
*
* @private
* @param {Array<Object>} data - processed results
* @throws {Error} unexpected error
* @returns {Array<Object>} zipped results
*/
function zip( data ) {
	const out = [];

	// Find "indexed collection" data...
	let lens;
	for ( let i = 0; i < data.length; i++ ) {
		if ( data[ i ].name === 'Indexed Collection' ) {
			lens = data[ i ].lengths;
			break;
		}
	}
	// Initialize results...
	for ( const N of lens ) {
		out.push({
			'Length': N
		});
	}
	// Zip the data...
	for ( const d of data ) {
		if ( !isSameArray( d.lengths, lens ) ) {
			throw new Error( format( 'unexpected error. Results have different sets of lengths. Name: `%d`. Lengths: [%s].', d.name, d.lengths.join( ',' ) ) );
		}
		for ( let i = 0; i < d.lengths.length; i++ ) {
			out[ i ][ d.name ] = d.rates[ i ];
		}
	}
	return out;
}

/**
* Normalizes result data.
*
* @private
* @param {Array<Object>} data - zipped results
* @returns {Array<Object>} normalized results
*/
function normalizeResults( data ) {
	const out = [];
	for ( const d of data ) {
		const tmp = {
			'Length': d.Length
		};
		for ( const o of entries( d ) ) {
			if ( o[ 0 ] === 'Length' ) {
				continue;
			}
			tmp[ o[0] ] = roundn( o[ 1 ] / d[ 'Indexed Collection' ], -3 );
		}
		out.push( tmp );
	}
	return out;
}


// MAIN //

/**
* Main execution sequence.
*
* @private
*/
function main() {
	let data;

	data = readDir( DIR );
	data = filter( data );
	data = rel2abs( data );
	data = readFileList( data, FOPTS );
	data = processFiles( data );
	data = simplifyResults( data );
	data = zip( data );
	console.log( JSON.stringify( data ) );

	data = normalizeResults( data );
	console.log( JSON.stringify( data ) );
}

main();
