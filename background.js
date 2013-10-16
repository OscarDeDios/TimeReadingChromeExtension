
	var visible = new Array();

	function init()
	{
		if (localStorage["speed"] == undefined) localStorage["speed"] = 200;
		//if (localStorage["autoCheck"] == 'false') chrome.browserAction.setIcon({path:"book.png"});
		//else chrome.browserAction.setIcon({path:""});
	}

	function getArticleDiffBot(url,tabid,automatic)
	{
		console.log('diff' + url);
		var param = 'token=b73b08acd6fbcea1dd80e303c5ac18f5&url=' + encodeURIComponent(url);
		$.ajax({
			url: "http://www.diffbot.com/api/article?" + param,
			dataType: 'json',
			error: function(objeto, quepaso, otroobj){
				// error function
				console.log('error difbot');
			},

			success: function(answer){
				var textToRead = answer.title + ' ' + answer.text;
				textToRead = textToRead.replace(/\s/g,' ');
				var wordNumber = textToRead.split(' ').length;
				var timeToRead = (wordNumber /  localStorage["speed"]).toFixed(0);
				if (timeToRead >= 3)
					var timeMinutes = timeToRead;
				else
					var timeMinutes = timeToRead;
				if (!automatic)
					chrome.tabs.sendMessage(tabid, {timeToRead: timeMinutes, wordNumber: wordNumber});
				else
				{
					if (timeToRead >= 3)
					{
						chrome.tabs.executeScript(tabid,{file:"jquery/jquery.js"});
						//chrome.tabs.executeScript(tabid,{file:"jquery/js/jquery-ui-1.8.16.custom.min.js"});
						chrome.tabs.insertCSS(tabid, {file:"inject.css"});
						chrome.tabs.executeScript(tabid,{file:"inject.js"},function(){chrome.tabs.sendMessage(tabid, {timeToRead: timeMinutes, wordNumber: wordNumber});});
						visible['"' + tabid + '"'] = true;
					}
				}
			}
		});
	}


	chrome.browserAction.onClicked.addListener(function(tab) {
		if (!visible['"' + tab.id + '"']) {
			getArticleDiffBot(tab.url,tab.id,false);
			chrome.tabs.executeScript(tab.id,{file:"jquery/jquery.js"});
			chrome.tabs.insertCSS(tab.id, {file:"inject.css"});
			chrome.tabs.executeScript(tab.id,{file:"inject.js"});
			visible['"' + tab.id + '"'] = true;
		}
		else {
			chrome.tabs.executeScript(null,{file:"jquery/jquery.js"});
			chrome.tabs.executeScript(null,{file:"uppopup.js"});
			visible['"' + tab.id + '"']  = false;
		}
	});

	chrome.tabs.onUpdated.addListener(function(tabid,attachInfo,tab) {
		if ((localStorage["autoCheck"] == 'true') &&  attachInfo.status == 'loading')
			getArticleDiffBot(tab.url,tab.id,true);
		else if (visible['"' + tab.id + '"'])
			 if (attachInfo.status == 'loading') visible['"' + tab.id + '"'] = false;
	});


	chrome.extension.onMessage.addListener(
		function(request, sender) {
			/* the popup is closing */
			if (request.close == 'ClosePopUpWindow')
			{
				chrome.tabs.executeScript(null,{file:"jquery/jquery.js"});
				chrome.tabs.executeScript(null,{file:"uppopup.js"});
				visible['"' + sender.tab.id + '"'] = false;
			}
	});
	init();

