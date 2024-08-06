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
* Class defining an array-like object supporting lazy materialization of random values.
*/
class LazyRandomArray {
	// Define private instance fields:
	#data;   // underlying data buffer

	/**
	* Returns a new lazy random array.
	*
	* @returns {LazyRandomArray} new instance
	*/
	constructor() {
		this.#data = [];
	}

	/**
	* Materializes array elements.
	*
	* @private
	* @param {number} len - array length
	*/
	#materialize( len ) {
		for ( let i = this.#data.length; i < len; i++ ) {
			this.#data.push( Math.random() );
		}
	}

	/**
	* Returns the array length.
	*
	* @returns {number} array length
	*/
	get length() {
		return this.#data.length;
	}

	/**
	* Returns an array element.
	*
	* @param {number} index - element index
	* @returns {*} element value
	*/
	get( index ) {
		if ( index < 0 ) {
			return;
		}
		if ( index >= this.#data.length ) {
			this.#materialize( index+1 );
		}
		return this.#data[ index ];
	}

	/**
	* Sets an array element.
	*
	* @param {*} value - value to set
	* @param {number} index - element index
	* @returns {void}
	*/
	set( value, index ) {
		if ( index < 0 ) {
			return;
		}
		if ( index >= this.#data.length ) {
			// Materialize `index+1` in order to ensure "fast" elements:
			this.#materialize( index+1 );
		}
		this.#data[ index ] = value;
	}
}

// Create a new lazy array:
const x = new LazyRandomArray();

// Retrieve the tenth element:
const v1 = x.get( 9 );
// returns <number>

console.log( v1 );

// Set the tenth element:
x.set( 4.0, 9 );

// Retrieve the tenth element:
const v2 = x.get( 9 );
// returns 4.0

console.log( v2 );

// Return the number of elements in the array:
const len = x.length;
// returns 10

console.log( len );
