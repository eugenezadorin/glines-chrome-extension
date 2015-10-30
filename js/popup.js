window.addEventListener('load', function(){
	// check access to file:/// urls
	chrome.extension.isAllowedFileSchemeAccess(function(isAllowedAccess){
		if (isAllowedAccess) return;

		var msg = document.getElementById('need-allow-file-access'),
			openSettingsBtn = document.getElementById('open-settings');
		
		openSettingsBtn.addEventListener('click', function(){
			chrome.tabs.create({
				url: 'chrome://extensions/?id=' + chrome.runtime.id
			});
		});

		msg.classList.remove('alert--hidden');
	});


	// set shortcut tips from settings
	chrome.commands.getAll(function(commands){
		var commandId,
			commandHotkey;

		for (i in commands) {
			commandHotkey = null;
			commandId = 'command-' + commands[i].name;
			
			if (commandHotkey = document.getElementById(commandId)) {
				commandHotkey.textContent = commands[i].shortcut;
			}
		}
	});

	var vLineBtn = document.getElementById('add-vertical-line'),
		hLineBtn = document.getElementById('add-horizontal-line'),
		crossLineBtn = document.getElementById('add-crossline'),
		removeAllBtn = document.getElementById('remove-all-lines'),
		lineSizeField = document.getElementById('line-size'),
		lineColorField = document.getElementById('line-color');

	// get options
	chrome.storage.sync.get(
		{
			// set defaults
			color: '#00FFFF',
			size: 1
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
				lbl.textContent = 'Settings saved.';
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

	crossLineBtn.addEventListener('click', function(){
		chrome.tabs.executeScript(
			null, 
			{
				code: ''
			},
			function() {
				chrome.tabs.executeScript(null, {file: 'js/addCrossLine.js'});
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