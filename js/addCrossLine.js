chrome.storage.sync.get(
	{
		// set defaults
		color: '#00FFFF',
		size: 1
	}, 
	function(options) {
		glines.addCrossLine(options);
	}
);