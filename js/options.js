function save_options() {
	var lineColor = document.getElementById('line-color').value;
	var lineSize = document.getElementById('line-size').value;
	chrome.storage.sync.set(
		{
			color: lineColor,
			size: lineSize
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
			color: '#00FFFF',
			size: 1
		}, 
		function(items) {
			console.log(items);
			document.getElementById('line-color').value = items.color;
			document.getElementById('line-size').value = items.size;
		}
	);
}

window.addEventListener('load', function(){
	restore_options();
	document.getElementById('save').addEventListener('click', save_options);
});