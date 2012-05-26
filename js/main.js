var sounds = new SFX('sfx');

sounds.add({
	mouseover: [ 'fart', 30 ],
	mouseout:  [ 'fart_out', 50 ],
	music: [ 'wily', 50 ],
	loop:  'fire',
	shot1: [ 'shot01', 30, 2 ],
	shot2: [ 'shot02', 30, 2 ],
	shot3: [ 'shot03', 30, 2 ],
	shot4: [ 'shot04', 30, 2 ],
	fire:  [ ['shot01','shot02','shot03','shot04'], 20, 20 ]
});

jQuery(function($){

	// -----------------------------------------------------------------------------------
	//   Examples
	// -----------------------------------------------------------------------------------

	var $examples = $('#examples');

	// Hover farts
	$('#fart').on('mouseenter mouseleave', function(event){

		sounds.play( event.type === 'mouseenter' ? 'mouseover' : 'mouseout' );

	});

	// Play
	$examples.on('click', '[data-play]', function(event){

		sounds.play( $(this).data('play') );

	});

	// Loop
	$examples.on('click', '[data-loop]', function(event){

		sounds.loop( $(this).data('loop') );

	});

	// Pause
	$examples.on('click', '[data-pause]', function(event){

		sounds.pause( $(this).data('pause') );

	});

	// Toggle
	$examples.on('click', '[data-toggle]', function(event){

		sounds.toggle( $(this).data('toggle') );

	});

	// Stop
	$examples.on('click', '[data-stop]', function(event){

		sounds.stop( $(this).data('stop') );

	});

	// Volume
	$examples.on('change', 'input[name=volume]', function(event){

		var $el = $(this),
			sName = $el.data('sound'),
			volume = $el.val();

		sounds.volume( sName, volume );

	});

	// Fire loop
	$('#fire').on('click', function(event){

		for( var i = 0; i < 10; i++ ){

			setTimeout( function(){

				sounds.play('fire', true);

			}, i * 100 );

		}

	});


	// -----------------------------------------------------------------------------------
	//   Page navigation
	// -----------------------------------------------------------------------------------

	// Navigation
	var $nav = $('#nav'),
		$sections = $('#sections').children(),
		activeClass = 'active';

	// Tabs
	$nav.on('click', 'a', function(e){
		e.preventDefault();
		activate( $(this).attr('href').substr(1) );
	});

	// Back to top button
	$('a[href="#top"]').on('click', function(e){
		e.preventDefault();
		$(document).scrollTop(0);
	});

	// Activate a section
	function activate( sectionID, initial ){

		sectionID = sectionID && $sections.filter('#'+sectionID).length ? sectionID : $sections.eq(0).attr('id');
		$nav.find('a').removeClass(activeClass).filter('[href=#'+sectionID+']').addClass(activeClass);
		$sections.hide().filter('#'+sectionID).show();

		if( !initial ){
			window.location.hash = '!' + sectionID;
		}

		$(document).trigger('activated', [ sectionID ] );

	}

	// Activate initial section
	activate( window.location.hash.match(/^#!/) ? window.location.hash.substr(2) : 0, 1 );


	// -----------------------------------------------------------------------------------
	//   Additional plugins
	// -----------------------------------------------------------------------------------

	// Trigger prettyPrint
	prettyPrint();

});