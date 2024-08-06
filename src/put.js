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

'use strict';

const put = require( '@stdlib/array-put' );

/**
* Class defining a strided array.
*/
class StridedArray {
	// Define private instance fields:
	#length; // array length
	#data;   // underlying data buffer
	#stride; // step size (i.e., the index increment between successive values)
	#offset; // index of the first indexed value in the data buffer

	/**
	* Returns a new StridedArray instance.
	*
	* @param {integer} N - number of indexed elements
	* @param {ArrayLikeObject} data - underlying data buffer
	* @param {number} stride - step size
	* @param {number} offset - index of the first indexed value in the data buffer
	* @returns {StridedArray} strided array instance
	*/
	constructor( N, data, stride, offset ) {
		this.#length = N;
		this.#data = data;
		this.#stride = stride;
		this.#offset = offset;
	}

	/**
	* Returns the array length.
	*
	* @returns {number} array length
	*/
	get length() {
		return this.#length;
	}

	/**
	* Returns the element located at a specified index.
	*
	* @param {number} index - element index
	* @returns {(void|*)} element value
	*/
	get( index ) {
		return this.#data[ this.#offset + index*this.#stride ];
	}

	/**
	* Sets the value for an element located at a specified index.
	*
	* @param {*} value - value to set
	* @param {number} index - element index
	*/
	set( value, index ) {
		this.#data[ this.#offset + index*this.#stride ] = value;
	}
}

// Define a data buffer:
const buf = new Float64Array( [ 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0 ] );

// Create a strided view over the data buffer:
const x = new StridedArray( 4, buf, 2, 1 );

// Retrieve the second element:
const v1 = x.get( 1 );
// returns 4.0

console.log( v1 );

// Retrieve the fourth element:
const v2 = x.get( 3 );
// returns 8.0

console.log( v2 );

// Replace the second and fourth elements with new values:
put( x, [ 1, 3 ], [ -v1, -v2 ] );

// Retrieve the second element:
const v3 = x.get( 1 );
// returns -4.0

console.log( v3 );

// Retrieve the fourth element:
const v4 = x.get( 3 );
// returns -8.0

console.log( v4 );
