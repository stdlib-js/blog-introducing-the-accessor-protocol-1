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
* Class emulating built-in bracket notation for lazy materialization without subclassing.
*/
class LazyArray {
	// Define private instance fields:
	#data; // memoized value cache

	/**
	* Returns a new fixed-length "lazy" array.
	*
	* @param {number} len - number of elements
	* @returns {LazyArray} lazy array instance
	*/
	constructor( len ) {
		Object.defineProperty( this, 'length', {
			'configurable': false,
			'enumerable': false,
			'writable': false,
			'value': len
		});
		for ( let i = 0; i < len; i++ ) {
			Object.defineProperty( this, i, {
				'configurable': false,
				'enumerable': true,
				'get': this.#get( i ),
				'set': this.#set( i )
			});
		}
		this.#data = {};
	}

	/**
	* Returns a getter.
	*
	* @private
	* @param {number} index - index
	* @returns {Function} getter
	*/
	#get( index ) {
		return get;

		/**
		* Returns an element.
		*
		* @private
		* @returns {*} element
		*/
		function get() {
			const v = this.#data[ index ];
			if ( v === void 0 ) {
				// Perform "lazy" materialization:
				this.#data[ index ] = index;
				return index;
			}
			return v;
		}
	}

	/**
	* Returns a setter.
	*
	* @private
	* @param {number} index - index
	* @returns {Function} setter
	*/
	#set( index ) {
		return set;

		/**
		* Sets an element value.
		*
		* @private
		* @param {*} value - value to set
		* @returns {boolean} boolean indicating whether a value was set
		*/
		function set( value ) {
			this.#data[ index ] = value;
			return true;
		}
	}
}

// Create a new "lazy" array:
const x = new LazyArray( 10 );

// Print the list of elements:
for ( let i = 0; i < x.length; i++ ) {
	console.log( x[ i ] );
}
