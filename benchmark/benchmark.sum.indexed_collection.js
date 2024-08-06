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
* Creates a benchmark function.
*
* @private
* @param {PositiveInteger} N - array length
* @returns {Function} benchmark function
*/
function createBenchmark( N ) {
	const x = discreteUniform( N, -100, 100, OPTS );
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
		bench( 'sum::indexed_collection:dtype=generic,len='+N, f );
	}
}

main();