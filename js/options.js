function save_options() {
	var lineColor = document.getElementById('line-color').value;
	var lineSize = document.getElementById('line-size').value;
	chrome.storage.sync.set(
		{
			lineColor: lineColor,
			lineSize: lineSize
		}, 
		function() {
			// Update status
			var status = document.getElementById('status');
			status.textContent = 'Options saved.';
			setTimeout(function() {
				status.textContent = '';
			}, 750);
		}
	);
}

function restore_options() {
	chrome.storage.sync.get(
		{
			// set defaults
			lineColor: 'black',
			lineSize: 4
		}, 
		function(items) {
			document.getElementById('line-color').value = items.lineColor;
			document.getElementById('line-size').value = items.lineSize;
		}
	);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);