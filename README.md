# SFX.js

Simple and small audio wrapper for easy sound effects on your website. SFX.js plays OGG files when browser supports them, and falls back to MP3 otherwise.
OGG is prioritized because it is an open format with developer friendly licensing, unlike MP3...
If browser support for OGG files will be ubiquitous, I'd like to drop support for MP3 in SFX.js altogether.

[See the DEMO](http://darsain.github.com/sfx.js)

#### Support

SFX works in Chrome, Opera, Firefox, Safari (with issues), and IE9+ (haven't tested other browsers). Supported file types are:

+ Chrome: **OGG** + **MP3**
+ Opera: **OGG**
+ Firefox: **OGG**
+ Safari: **MP3**
+ IE9: **MP3**



## Creating an SFX instance

```js
var soundGroup = new SFX( directory, [ forceType ] );
```

### directory

This is a path to a directory with your `ogg` and `mp3` files. If you want to place `ogg` and `mp3` files into a separate folders,
you can use `{{type}}` keyword in your directory path, which will than be replaced with `ogg`, or `mp3`.

For example:

```js
var soundGroup = new SFX( 'sound_effects/{{type}}' );
```

The paths of queried files will than look like `sound_effects/ogg/file.ogg`, or `sound_effects/mp3/file.mp3` depending on a browser support.


### [ forceType ]

If you don't want SFX.js to look for a different types of files based on a current browser support, or you are just too lazy with providing one file in two different versions,
you can use this argument to force only certain type of files to be queried and played. In a browsers that doesn't support this type of file,
you'll be just greeted with silent website, but no errors.


***


## Methods


### add

```js
soundGroup.add( soundName, file [, volume [, layers ] ] );
```

Adds a new sound effect to the `soundGroup` SFX instance.

+ **soundName:** `String` simple string with a name of a sound
+ **file:** `String|Array` name of a file (or array with filenames) located in `soundGroup` directory without an extensions, as that is decided according to the browser support
+ **volume:** `Int` default sound volume for this sound effect in 0-100 range (default is 100)
+ **layers:** `In` how many audio layers should be created from this file(s)

When you'll pass an array of file names into **file** argument, they will be used to create multiple sound layers. Layers are than useful when simultaneous playback is required.

For example: You have a sound for a gunshot, but you want to play it before the last one has ended (fast rate of fire). In this case, you have to use more layers,
as one Audio() element cannot be played multiple times simultaneously. SFX.js than cycles through this layers, playing them one after another.
You should set how many layers do you need based on a probability of sound overlapping and length of a sound effect. With higher layer count
you are lowering the probability of silence due to no sound layers being available, but also consuming more resources.

Providing multiple versions of a same sound effect (passing them as an array of file names into **file** argument) creates more natural result for sound effects such as gun fire.

Passing 4 file names automatically creates 4 sound layers, but you can still use **layers** argument to create more.

You can also pass a map of effects with a key being soundName and a value either string with file name, or an array with the other 3 arguments. Example:

```js
sounds.add({
	music: 'wily',
	loop:  'fire',
	mouseover: [ 'fart', 30 ],
	mouseout:  [ 'fart_out', 50 ],
	shot1: [ 'shot01', 30, 2 ],
	shot2: [ 'shot02', 30, 2 ],
	shot3: [ 'shot03', 30, 2 ],
	shot4: [ 'shot04', 30, 2 ],
	fire:  [ ['shot01','shot02','shot03','shot04'], 20, 20 ]
});
```


### remove

```js
soundGroup.remove( soundName );
```

Remove sound effect from the `soundGroup` SFX instance.

+ **soundName:** `String` name of a sound


### play

```js
soundGroup.play( soundName, random );
```

Play sound effect from the `soundGroup` SFX instance.

+ **soundName:** `String` name of a sound
+ **random:** `String` whether the cycling through different sound layers should be random - creates a more natural sounding effects


### loop

```js
soundGroup.loop( soundName, random );
```

Same behavior as `play` method, but after the sound has finished, it will start playing again in an infinite loop untill the `pause` or `stop` method is called.
Good for background music.


### pause

```js
soundGroup.pause( soundName );
```

Pauses a sound from the `soundGroup` SFX instance.

+ **soundName:** `String` name of a sound to be paused


### stop

```js
soundGroup.stop( soundName );
```

Stops a sound from the `soundGroup` SFX instance.

+ **soundName:** `String` name of a sound to be paused


### volume

```js
soundGroup.volume( [ soundName, ] volume );
```

Sets master volume, or a volume for a specific sound in the `soundGroup` SFX object.

+ **soundName:** `String` name of a sound - omit this argument to set master volume
+ **volume:** `Int` sound volume in 0-100 range

Master volume affects all sound effects, as their effective volume is calculated as a percentage of a master volume.
For example: master volume `50`, and sound effect volume `50` creates effective volume of `25`.


### mute

```js
soundGroup.volume( [ soundName, ] [ mute ] );
```

Mute or unmute a specific sound, or all sounds in the `soundGroup` SFX instance. All `play` and `loop` calls on this file(s) will result in silence.

+ **soundName:** `String` name of a sound
+ **mute:** `Bool` boolean value of mute status (default is true)

Examples:

```js
soundGroup.mute();        // mutes all sounds in soundGroup
soundGroup.mute( false )  // unmutes all sounds in soundGroup
soundGroup.mute( 'shot' ) // mutes 'shot' sound in soundGroup
soundGroup.mute( 'shot', false ) // unmutes 'shot' sound in soundGroup
```


***


## Known issues

+ Safari's audio implementation is god damn slow and unresponsive.
+ Looping of seamlessly designed sound effects is not seamless in most of the browsers. The jump between plays has a noticeable few milliseconds of silence.
