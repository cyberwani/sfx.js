/*!
 * SFX v0.9.0
 * https://github.com/Darsain/sfx.js
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/MIT
 */
window.SFX = function( directory, forceType ){
	'use strict';

	/** Private variables */
	var	self = this,
		sfx = {},
		support = false,
		dir = '',
		type = 'ogg',
		globalVolume = 1,
		globalMute = false;


	/**
	 * Add sound effect
	 *
	 * @public
	 *
	 * @param {String} sName  Effect name
	 * @param {Mixed}  file   Filename, or array with filenames
	 * @param {Int}    volume Sound volume in 0-100 range
	 * @param {Int}    layers Number of requested layers
	 */
	self.add = function( sName, file, volume, layers ){

		if( !support ) return;

		if( typeof sName === 'object' ){

			for( var key in sName ){

				self.add.apply( this, [key].concat( isArray( sName[key] ) ? sName[key] : [sName[key]] ) );

			}

			return;

		}

		var files = isArray( file ) ? file : [file],
			paths = [],
			layers = layers > files.length ? layers : files.length;;

		// Extend filenames into valid paths
		for( var f = 0; f < files.length; f++ ){

			paths.push( ( files[f].match(/^\//) ? files[f] : dir + '/' + files[f] ).replace(/\.[a-z0-9]{1,4}$/i, '') + '.' + type );

		}

		// Create sound object
		sfx[sName] = [];
		sfx[sName].lastPlayed = -1;
		sfx[sName].muted = false;

		// Populate sound layers
		for( var i = 0; i < layers; i++ ){

			var audio = new Audio( paths[ i % paths.length ] );

			audio.volume = isNumber( volume ) ? volume / 100 : globalVolume;

			sfx[sName].push( audio );

		}

	};


	/**
	 * Remove sound effect
	 *
	 * @public
	 *
	 * @param  {String} sName Effect name to be removed
	 */
	self.remove = function( sName ){

		delete sfx[sName];

	};


	/**
	 * Play sound effect
	 *
	 * @public
	 *
	 * @param  {String} sName  Effect name
	 * @param  {Bool}   random Randomize selection of a file that is going to be played
	 */
	self.play = function( sName, random ){

		if( !support || globalMute || !sfx[sName] || sfx[sName].muted ) return;

		var index = 0;

		// Cycle through sound layers if there are any
		if( sfx[sName].length > 1 ){

			// Pick sound layer randomly from available (paused) layers
			if( random ){

				var available = [];

				// Populate array with indexes of available layers
				for( var i = 0; i < sfx[sName].length; i++ ){

					if( sfx[sName][i].paused ){

						available.push( i );

					}

				}

				// Pick one layer randomly
				index = available.length > 0 ? available[ Math.floor( Math.random()*available.length ) ] : Math.floor( Math.random()*sfx[sName].length );

			} else {

				// Cycle through layers
				index = sfx[sName].lastPlayed = ++sfx[sName].lastPlayed >= sfx[sName].length ? 0 : sfx[sName].lastPlayed;

			}

		}

		// Play sound effect
		sfx[sName][index].play();

	};


	/**
	 * Play sound effect in loop
	 *
	 * @public
	 *
	 * @param  {String} sName  Effect name
	 * @param  {Random} random Randomize selection of a file that is going to be played
	 */
	self.loop = function( sName, random ){

		// Enable looping on all sName layers
		setProp( sName, 'loop', true );

		// Reset duration to fix the silent audio bug in google chrome
		setProp( sName, 'currentTime', 0 );

		// Play sound effect
		self.play( sName, random );

	};


	/**
	 * Pause playing sound effect
	 *
	 * @public
	 *
	 * @param  {String} sName Effect name
	 * @param  {Bool}   reset Whether to reset current playing position to start
	 */
	self.pause = function( sName, reset ){

		if( !support || !sfx[sName] ) return;

		// Pause, disable looping, and optionally reset all sName layers
		for( var i = 0; i < sfx[sName].length; i++ ){

			sfx[sName][i].pause();
			sfx[sName][i].loop = false;

			if( reset ){

				sfx[sName][i].currentTime = 0;

			}

		}

	};


	/**
	 * Stop playing sound effect
	 *
	 * @public
	 *
	 * @param  {String} sName Effect name
	 */
	self.stop = function( sName ){

		self.pause( sName, 1 );

	};


	/**
	 * Set global or effect specific sound volume
	 *
	 * @public
	 *
	 * @param  {Mixed} sName  Effect name, or straight integer [0-100] to set global volume
	 * @param  {Int}   volume Volume from 0 to 100
	 *
	 * @example
	 *  sfxObject.volume( 'bgmusic', 50 ) => sets volume to 50% for 'bgmusic' sound effect
	 *  sfxObject.volume( 50 )            => sets volume to 50% for all sound effects in sfxObject
	 */
	self.volume = function( sName, volume ){

		if( !support ) return;

		volume = ( isNumber( sName ) ? sName : volume ) / 100;
		sName = typeof sName === 'string' ? sName : false;

		if( sName ){

			// If specified, modify volume only for one sound effect
			setProp( sName, 'volume', volume );

			if( !!volume ){

				sfx[sName].muted = 1;

			}

		} else {

			// Modify global volume
			for( var key in sfx ){

				setProp( key, 'volume', volume );

			}

			globalVolume = volume;

			globalMute = !volume;

		}

	};


	/**
	 * Mute/Disable sounds
	 *
	 * @public
	 *
	 * @param {String} sName Effect name to be removed
	 * @param {Bool}   mute  Pass false to disable mute
	 */
	self.mute = function( sName, mute ){

		mute = typeof mute === 'boolean' ? mute : typeof sName === 'boolean' ? sName : true;
		sName = typeof sName === 'string' ? sName : false;

		if( sName ){

			if( mute ){

				self.pause( sName );

			}

			sfx[sName].muted = mute;

		} else {

			if( mute ){

				// Modify global volume
				for( var key in sfx ){

					self.pause( key );

				}

			}

			globalMute = mute;

		}

	};


	/**
	 * Sets property for all layers of one sound effect
	 *
	 * @private
	 *
	 * @param {Strong} sName Effect name
	 * @param {String} prop  Property name
	 * @param {Mixed}  value New property value
	 */
	function setProp( sName, prop, value ){

		if( !support || !sfx[sName] ) return;

		for( var i = 0; i < sfx[sName].length; i++ ){

			sfx[sName][i][prop] = value;

		}

	}


	/**
	 * Check whether the value is a number
	 *
	 * @private
	 *
	 * @param  {Mixed}  value Value to be checked
	 *
	 * @return {Boolean} True if number, false if not
	 */
	function isNumber( value ){

		return !isNaN( parseFloat( value ) ) && isFinite( value );

	}


	/**
	 * Check whether the value is an array
	 *
	 * @private
	 *
	 * @param  {Mixed}  value Value to be checked
	 *
	 * @return {Boolean} True if array, false if not
	 */
	function isArray( value ){

		return Object.prototype.toString.call( value ) === '[object Array]';

	}


	/** Construct */
	(function(){

		// Audio support detection
		var elem = document.createElement('audio');

		try {

			if ( support = !!elem.canPlayType ) {

				support      = new Boolean(support);
				support.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
				support.mp3  = elem.canPlayType('audio/mpeg;').replace(/^no$/,'');

			}

		} catch( e ){}

		// Force specific audio type
		if( forceType ){

			support = !!support[forceType.toLowerCase()];

		}

		// Set files type
		type = forceType ? forceType.toLowerCase() : !!support.ogg ? 'ogg' : 'mp3';

		// Set directory
		dir = directory ? directory.replace(/\/+$/, '').replace(/\{\{type\}\}/, type) : '';

	}());

};