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

'use strict';

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
const x1 = new StridedArray( 4, buf, 2, 1 );

// Retrieve the second element:
const v1 = x1.get( 1 );
// returns 4.0

console.log( v1 );

// Mutate the second element:
x1.set( v1*10.0, 1 );

// Retrieve the second element:
const v2 = x1.get( 1 );
// returns 40.0

console.log( v2 );

// Create a new strided view over the same data buffer, but reverse the elements:
const x2 = new StridedArray( 4, buf, -2, buf.length-1 );

// Retrieve the second element:
const v3 = x2.get( 1 );
// returns 6.0

console.log( v3 );

// Mutate the second element:
x2.set( v3*10.0, 1 );

// Retrieve the second element:
const v4 = x2.get( 1 );
// returns 60.0

console.log( v4 );

// Retrieve the third element from the first array view:
const v5 = x1.get( 2 );
// returns 60.0

console.log( v5 );
