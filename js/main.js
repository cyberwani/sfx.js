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

	// Trigger prettyPrint
	prettyPrint();

	// -----------------------------------------------------------------------------------
	//   Page scripts
	// -----------------------------------------------------------------------------------

	var $tabs = $('#tabs').find('li'),
		$container = $('#sections'),
		$sections = $container.children(),
		hashId = window.location.hash.replace(/^#tab=/, ''),
		initial = hashId && $sections.filter('#'+hashId).length ? hashId : $tabs.eq(0).data('activate'),
		activeClass = 'active',
		hiddenClass = 'hidden';

	// Tabs navigation
	$tabs.on('click', function(e){

		activate( $(this).data('activate') );

		e.preventDefault();

	});

	// Back to top button
	$('a[href="#top"]').on('click', function(e){
		e.preventDefault();
		$(document).scrollTop(0);
	});

	// Activate section
	function activate( sectionId, noHashChange ){

		if( !noHashChange ) window.location.hash = 'tab='+sectionId;
		$tabs.removeClass(activeClass).filter('[data-activate='+sectionId+']').addClass(activeClass);
		$sections.addClass(hiddenClass).filter('#'+sectionId).removeClass(hiddenClass);

	}

	// Activate initial section
	activate( initial, 1 );


	// -----------------------------------------------------------------------------------
	//   Examples
	// -----------------------------------------------------------------------------------

	var $examples = $('#examples');

	// Hover farts
	$('#hover').on('mouseenter mouseleave', function(event){

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

});