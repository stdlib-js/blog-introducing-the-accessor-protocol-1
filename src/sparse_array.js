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

/**
* Class defining a sparse array implementing the accessor protocol.
*/
class SparseArray {
	// Define private instance fields:
	#length; // array length
	#data;   // dictionary containing array elements
	#fill;   // fill value

	/**
	* Returns a new sparse array instance.
	*
	* @param {number} len - array length
	* @param {*} fill - fill value
	* @returns {SparseArray} sparse array instance
	*/
	constructor( len, fill ) {
		this.#length = len;
		this.#data = {};
		this.#fill = fill;
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
	* Returns an array element.
	*
	* @param {number} index - element index
	* @returns {*} element value
	*/
	get( index ) {
		if ( index < 0 || index >= this.#length ) {
			return;
		}
		const v = this.#data[ index ];
		if ( v === void 0 ) {
			return this.#fill;
		}
		return v;
	}

	/**
	* Sets an array element.
	*
	* @param {*} value - value to set
	* @param {number} index - element index
	* @returns {void}
	*/
	set( value, index ) {
		if ( index < 0 || index >= this.#length ) {
			return;
		}
		this.#data[ index ] = value;
	}
}

// Create a new sparse array:
const x = new SparseArray( 10, 0.0 );

// Retrieve the second element:
const v1 = x.get( 1 );
// returns 0.0

console.log( v1 );

// Set the second element:
x.set( 4.0, 1 );

// Retrieve the second element:
const v2 = x.get( 1 );
// returns 4.0

console.log( v2 );
