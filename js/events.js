function executeScript(code, file)
{
	if (code || file)
	{
		chrome.tabs.executeScript(
			null, 
			{
				code: code
			},
			function() {
				chrome.tabs.executeScript(null, {file: file});
			}
		);
	}
}

chrome.commands.onCommand.addListener(function(command) {
	var code = null,
		file = null;

	switch (command)
	{
		case 'add-vertical-line':
			code = 'var lineType = "v"';
			file = 'js/addLine.js';
			break;

		case 'add-horizontal-line':
			code = 'var lineType = "h"';
			file = 'js/addLine.js';
			break;

		case 'add-cross-line':
			code = '';
			file = 'js/addCrossLine.js';
			break;

		case 'show-hide-lines':
			code = 'glines.toggleVisibility();';
			file = '';
			break;
	}


	// check access to file:/// urls
	chrome.extension.isAllowedFileSchemeAccess(function(isAllowedAccess){
		if (isAllowedAccess)
		{
			executeScript(code, file);
		}
		else
		{
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
				if (tabs.length > 0)
				{
					url = tabs[0].url.trim().toLowerCase();
					if (url.indexOf('file://') == 0)
					{
						alert('You should allow access to file:// URLs in the extension settings');
						return;
					}
				}

				executeScript(code, file);
			});
		}
	});	
});