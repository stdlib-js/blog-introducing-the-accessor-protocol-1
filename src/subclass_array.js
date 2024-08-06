/**
* @license Apache-2.0
*
* Copyright (c) 2023 The Stdlib Authors.
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

/* eslint-disable node/no-unsupported-features/es-syntax, no-restricted-syntax */

'use strict';

/**
* Class which subclasses the built-in Array class.
*/
class SpecialArray extends Array {
	/**
	* Performs in-place element-wise addition.
	*
	* @param {ArrayLikeObject} other - input array
	* @throws {RangeError} must have the same number of elements
	* @returns {SpecialArray} the mutated array
	*/
	add( other ) {
		if ( other.length !== this.length ) {
			throw new RangeError( 'Must provide an array having the same length.' );
		}
		for ( let i = 0; i < this.length; i++ ) {
			this[ i ] += other[ i ];
		}
		return this;
	}
}

// Create a new SpecialArray instance:
const x = new SpecialArray( 10 );

// Call an inherited method to fill the array:
x.fill( 5 );

// Retrieve the second element:
const v1 = x[ 1 ];
// returns 5

console.log( v1 );

// Create an array to add:
const y = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

// Perform element-wise addition:
x.add( y );

// Retrieve the second element:
const v2 = x[ 1 ];
// returns 7

console.log( v2 );
