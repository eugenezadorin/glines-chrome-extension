window.addEventListener('load', function(){
	var vLineBtn = document.getElementById('add-vertical-line');
	vLineBtn.addEventListener('click', function(){
		chrome.tabs.executeScript({
			code: 'glines.addLine("v")'
		});
		return false;
	});
});
