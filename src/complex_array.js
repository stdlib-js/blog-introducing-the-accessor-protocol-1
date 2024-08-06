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
* Class defining a minimal immutable complex number.
*/
class Complex {
	// Define private instance fields:
	#re; // real component
	#im; // imaginary component

	/**
	* Returns a new complex number instance.
	*
	* @param {number} re - real component
	* @param {number} im - imaginary component
	* @returns {Complex} complex number instance
	*/
	constructor( re, im ) {
		this.#re = re;
		this.#im = im;
	}

	/**
	* Returns the real component of a complex number.
	*
	* @returns {number} real component
	*/
	get re() {
		return this.#re;
	}

	/**
	* Returns the imaginary component of a complex number.
	*
	* @returns {number} imaginary component
	*/
	get im() {
		return this.#im;
	}
}

/**
* Class defining a complex number array implementing the accessor protocol.
*/
class Complex128Array {
	// Define private instance fields:
	#length; // array length
	#data;   // underlying data buffer

	/**
	* Returns a new complex number array instance.
	*
	* @param {number} len - array length
	* @returns {Complex128Array} complex array instance
	*/
	constructor( len ) {
		this.#length = len;
		this.#data = new Float64Array( len*2 ); // accommodate interleaved components
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
	* @param {integer} index - element index
	* @returns {(Complex|void)} element value
	*/
	get( index ) {
		if ( index < 0 || index >= this.#length ) {
			return;
		}
		const ptr = index * 2; // account for interleaved components
		return new Complex( this.#data[ ptr ], this.#data[ ptr+1 ] );
	}

	/**
	* Sets an array element.
	*
	* @param {Complex} value - value to set
	* @param {integer} index - element index
	* @returns {void}
	*/
	set( value, index ) {
		if ( index < 0 || index >= this.#length ) {
			return;
		}
		const ptr = index * 2; // account for interleaved components
		this.#data[ ptr ] = value.re;
		this.#data[ ptr+1 ] = value.im;
	}
}

// Create a new complex number array:
const x = new Complex128Array( 10 );
// returns <Complex128Array>

// Retrieve the second element:
const z1 = x.get( 1 );
// returns <Complex>

const re1 = z1.re;
// returns 0.0

const im1 = z1.im;
// returns 0.0

console.log( '%d + %di', re1, im1 );

// Set the second element:
x.set( new Complex( 3.0, 4.0 ), 1 );

// Retrieve the second element:
const z2 = x.get( 1 );
// returns <Complex>

const re2 = z2.re;
// returns 3.0

const im2 = z2.im;
// returns 4.0

console.log( '%d + %di', re2, im2 );
