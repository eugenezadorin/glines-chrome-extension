window.addEventListener('load', function(){
	var vLineBtn = document.getElementById('add-vertical-line'),
		hLineBtn = document.getElementById('add-horizontal-line'),
		removeAllBtn = document.getElementById('remove-all-lines'),
		lineSizeField = document.getElementById('line-size'),
		lineColorField = document.getElementById('line-color');

	// get options
	chrome.storage.sync.get(
		{
			// set defaults
			color: '#000000',
			size: 4
		}, 
		function(items) {
			lineColorField.value = items.color;
			lineSizeField.value = items.size;
		}
	);

	// save options
	var saveOptions = function() {
		chrome.storage.sync.set(
			{
				color: lineColorField.value,
				size: lineSizeField.value
			}, 
			function() {
				var lbl = document.getElementById('settings-lbl');
				lbl.textContent = 'Settings — saved.';
				setTimeout(function() {
					lbl.textContent = 'Settings';
				}, 750);
			}
		);
	}

	lineSizeField.addEventListener('change', saveOptions);
	lineColorField.addEventListener('change', saveOptions);

	// bind buttons
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