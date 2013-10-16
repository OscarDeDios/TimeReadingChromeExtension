	$(function() {
		$( "#sliderSpeed" ).slider({
			range: "min",
			value: localStorage["speed"]  || 200,
			min: 100,
			max: 700,
			slide: function( event, ui ) {
				$( "#valSpeed" ).html( ui.value + ' wpm' );
				localStorage["speed"] = ui.value;
			}
		});
		$( "#valSpeed" ).html($( "#sliderSpeed" ).slider( "value" ) +' WPM');

		$( "#autoCheck" ).click(function() {
			localStorage["autoCheck"] = $( "#autoCheck").is(':checked');
			if (localStorage["autoCheck"] == 'true') chrome.pageAction.hide(0);
			else chrome.pageAction.setIcon({path:"book.png"});
		});
		if (localStorage["autoCheck"] == 'true') $('#autoCheck').attr('checked', true);
		else $('#autoCheck').attr('checked', false);
	});