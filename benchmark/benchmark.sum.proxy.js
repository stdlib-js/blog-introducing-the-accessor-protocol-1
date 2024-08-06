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

const bench = require( '@stdlib/bench-harness' );
const discreteUniform = require( '@stdlib/random-array-discrete-uniform' );
const Proxy = require( '@stdlib/proxy-ctor' );
const isnan = require( '@stdlib/math-base-assert-is-nan' );
const pow = require( '@stdlib/math-base-special-pow' );


// VARIABLES //

const OPTS = {
	'dtype': 'generic'
};


// FUNCTIONS //

/**
* Computes the sum.
*
* @private
* @param {ArrayLikeObject} x - input array
* @returns {number} sum
*/
function sum( x ) {
	let total = 0;
	for ( let i = 0; i < x.length; i++ ) {
		total += x[ i ];
	}
	return total;
}

/**
* Trap for retrieving property values.
*
* @private
* @param {ArrayLikeObject} target - target object
* @param {string} property - property name
* @param {Object} receiver - receiver object
* @returns {*} property value
*/
function get( target, property ) {
	return target[ property ];
}

/**
* Trap for setting property values.
*
* @private
* @param {ArrayLikeObject} target - target object
* @param {string} property - property name
* @param {*} value - value to set
* @param {Object} receiver - receiver object
* @returns {boolean} boolean indicating success
*/
function set( target, property, value ) {
	target[ property ] = value;
	return true;
}

/**
* Returns a proxied array-like object.
*
* @private
* @param {ArrayLikeObject} x - array-like object to proxy
* @returns {Proxy} proxy object
*/
function array2proxy( x ) {
	return new Proxy( x, {
		'get': get,
		'set': set
	});
}

/**
* Creates a benchmark function.
*
* @private
* @param {PositiveInteger} N - array length
* @returns {Function} benchmark function
*/
function createBenchmark( N ) {
	const x = array2proxy( discreteUniform( N, -100, 100, OPTS ) );
	return benchmark;

	/**
	* Benchmark function.
	*
	* @private
	* @param {Benchmark} b - benchmark instance
	*/
	function benchmark( b ) {
		let v;
		let i;

		b.tic();
		for ( i = 0; i < b.iterations; i++ ) {
			v = sum( x );
			if ( isnan( v ) ) {
				b.fail( 'should not return NaN' );
			}
		}
		b.toc();
		if ( isnan( v ) ) {
			b.fail( 'should not return NaN' );
		}
		b.pass( 'benchmark finished' );
		b.end();
	}
}


// MAIN //

/**
* Main execution sequence.
*
* @private
*/
function main() {
	let N;
	let f;
	let i;

	const min = 1; // 10^min
	const max = 6; // 10^max

	for ( i = min; i <= max; i++ ) {
		N = pow( 10, i );
		f = createBenchmark( N );
		bench( 'sum::proxy:dtype=generic,len='+N, f );
	}
}

main();
