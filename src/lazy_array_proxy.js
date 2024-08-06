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

/* eslint-disable node/no-unsupported-features/es-syntax, node/no-unsupported-features/es-builtins, no-restricted-syntax, stdlib/require-globals */

'use strict';

/**
* Tests whether a string contains only integer values.
*
* @private
* @param {string} str - input string
* @returns {boolean} boolean indicating whether a string contains only integer values
*/
function isDigitString( str ) {
	return /^\d+$/.test( str );
}

/**
* Returns a proxied array-like object.
*
* @param {number} len - array length
* @returns {Proxy} proxy object
*/
function lazyArray( len ) {
	const target = {
		'length': len
	};
	return new Proxy( target, {
		'get': ( target, property ) => {
			if ( isDigitString( property ) ) {
				return parseInt( property, 10 );
			}
			return target[ property ];
		},
		'set': ( target, property, value ) => {
			target[ property ] = value;
			return true;
		}
	});
}

// Create a new "lazy" array:
const x = lazyArray( 10 );

// Print the list of elements:
for ( let i = 0; i < x.length; i++ ) {
	console.log( x[ i ] );
}
