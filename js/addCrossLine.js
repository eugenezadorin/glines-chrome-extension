chrome.storage.sync.get(
	{
		// set defaults
		color: 'black',
		size: 4
	}, 
	function(options) {
		glines.addCrossLine(options);
	}
);