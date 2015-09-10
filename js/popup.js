window.addEventListener('load', function(){
	var vLineBtn = document.getElementById('add-vertical-line'),
		hLineBtn = document.getElementById('add-horizontal-line'),
		removeAllBtn = document.getElementById('remove-all-lines');

	vLineBtn.addEventListener('click', function(){
		chrome.tabs.executeScript(
			null, 
			{
				code: 'var lineType = "v"'
			},
			function() {
				chrome.tabs.executeScript(null, {file: 'js/addLine.js'});
			}
		);
		return false;
	});

	hLineBtn.addEventListener('click', function(){
		chrome.tabs.executeScript(
			null, 
			{
				code: 'var lineType = "h"'
			},
			function() {
				chrome.tabs.executeScript(null, {file: 'js/addLine.js'});
			}
		);
		return false;
	});

	removeAllBtn.addEventListener('click', function(){
		chrome.tabs.executeScript({
			code: 'glines.removeAll()'
		});
		return false;
	});
});