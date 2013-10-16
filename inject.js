	var loadedNC;
	var timeOverlay;

	function hidePopup()
	{
		chrome.extension.sendMessage({close: 'ClosePopUpWindow'});
	}

	(function(){
	timeOverlay = document.createElement("div");
	timeOverlay.setAttribute('id','timeReading');
	timeOverlay.innerHTML = 	'<div id ="reading">Reading ' +
									'<img src="' + chrome.extension.getURL("img/ajax-loader.gif") + '"/>' +
								'</div>';

	document.body.appendChild(timeOverlay);
	$("#timeReading").slideDown(400);
	$("#timeReading").on('click',hidePopup);

	//**********************************************************************************************
	//******************************* LISTENERS FUNCTIONS ******************************************
	//**********************************************************************************************

	// if (!loadedNC)
	// {
	//*****************************************************************************
	// 	Listener events to comunicate with background process
	//*****************************************************************************
		chrome.extension.onMessage.addListener(
			function(request, sender) {
				if (request.timeToRead)
				{
					var html = '<div id="wordNumber">' + request.wordNumber + ' words</div>';
					if (request.timeToRead > 1)
						html += '<div id="timeToRead">' + request.timeToRead + ' minutes</div>';
					else
						html += '<div id="timeToRead">' + request.timeToRead + ' minute</div>';

					document.getElementById('timeReading').innerHTML = html;
				}
			});
		loadedNC = true;
	// }
	chrome.extension.sendMessage({readLocalStorage: 'reading'});
}());

