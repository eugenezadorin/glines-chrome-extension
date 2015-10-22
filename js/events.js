chrome.commands.onCommand.addListener(function(command) {
	var _code = null,
		_file = null;

	switch (command)
	{
		case 'add-vertical-line':
			_code = 'var lineType = "v"';
			_file = 'js/addLine.js';
			break;

		case 'add-horizontal-line':
			_code = 'var lineType = "h"';
			_file = 'js/addLine.js';
			break;

		case 'add-cross-line':
			_code = '';
			_file = 'js/addCrossLine.js';
			break;
	}

	if (_code || _file)
	{
		chrome.tabs.executeScript(
			null, 
			{
				code: _code
			},
			function() {
				chrome.tabs.executeScript(null, {file: _file});
			}
		);
	}
});