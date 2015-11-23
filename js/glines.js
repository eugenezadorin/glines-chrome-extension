glines = {};

(function(gl) {
	gl.counter = -1;

	gl.visible = true;
		
	gl.getWindowHeight = function() {
		return Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight);
	}

	gl.getWindowWidth = function() {
		return Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth);
	}

	gl.getScrollTop = function() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}

	gl.each = function(handler) {
		var lines = document.getElementsByClassName('glines-line');
		for (var i = 0; i < lines.length; i++) {
			handler(i, lines[i]);
		}
	}

	gl.checkAxis = function(axis) {
		if (axis == 'h') {
			axis = 'horizontal';
		}

		if (axis == 'v') {
			axis = 'vertical';
		}

		if (axis != 'horizontal' && axis != 'vertical') {
			axis = 'vertical';
		}

		return axis;
	}

	gl.setLineStyle = function(line, customStyle) {
		customStyle = customStyle || {};
		var axis = this.checkAxis( line.axis );
		var resultStyle = {};

		if (axis == 'vertical') {
			resultStyle.height = this.getWindowHeight() + 'px';
			resultStyle.left = Math.round(this.getWindowWidth() / 2) + 'px';
		}

		if (axis == 'horizontal') {
			resultStyle.top = Math.round(this.getScrollTop() + (document.documentElement.clientHeight / 2)) + 'px';
		}

		// overwrite default styles by custom styles
		for (i in customStyle) {
			if (i == 'color') {
				resultStyle['backgroundColor'] = customStyle[ i ];
			} else if (i == 'size') {
				if (axis == 'vertical') {
					resultStyle['width'] = customStyle[ i ] + 'px';
				} else {
					resultStyle['height'] = customStyle[ i ] + 'px';
				}
			} else {
				resultStyle[ i ] = customStyle[ i ];
			}
		}

		// apply result styles to line
		for (i in resultStyle) {
			line.style[ i ] = resultStyle[ i ];			
		}
	}


	gl.addLine = function(axis, customStyle) {
		this.showAll();

		axis = this.checkAxis(axis);

		this.counter++;

		var line = document.createElement('div');

		line.glines = this;
		line.customStyle = customStyle;
		line.axis = axis;
		line.index = this.counter;
		line.className = 'glines-line glines-line-' + axis;
		line.id = 'glines-line-' + this.counter;
		line.tabIndex = '10000' + this.counter; // hack. focus method will work on div

		this.setLineStyle( line, customStyle );

		line.onclick = function() {
			this.focus();
		}

		line.ondblclick = function() {
			this.remove();
		}

		line.ondragstart = function(event) {
			return false;
		}

		line.onmousedown = function(event) {
			var self = this;
			var clonedLine = null;

			var dragLine = function(e) {
				if (e.ctrlKey)
				{
					if (!clonedLine)
					{
						clonedLine = self.glines.addLine(self.axis, self.customStyle);
						clonedLine.style.left = self.style.left;
						clonedLine.style.top = self.style.top;
						self.focus();
					}
				}

				if (self.axis == 'vertical') {
					self.style.left = e.pageX + 'px';
				} else if (self.axis == 'horizontal') {
					self.style.top = e.pageY + 'px';
				}
			}

			document.addEventListener('mousemove', dragLine);
			
			self.onmouseup = function() {
				document.removeEventListener('mousemove', dragLine);
				self.onmouseup = null;
				clonedLine = null;
			}

			return false;
		}

		
		line.onkeydown = function(event) {
			var e = window.event ? window.event : event;
			var key = e.keyCode;

			// check if not arrows
			if (key != 37 && key != 38 && key != 39 && key != 40) {
				return true;
			}

			if (this.axis == 'horizontal') {
				var top = parseInt(this.style.top);
				
				if (key == 38) {
					// arrow up
					this.style.top = (--top) + 'px'; 
				} else if (key == 40) { 
					// arrow down
					this.style.top = (++top) + 'px';
				}
			} else if (this.axis == 'vertical') {
				var left = parseInt(this.style.left);
				
				if (key == 37) { 
					// arrow left
					this.style.left = (--left) + 'px'; 
				} else if (key == 39) { 
					// arrow right
					this.style.left = (++left) + 'px';
				}
			}

			return false;
		}

		document.body.appendChild(line);
		line.focus();
		return line;
	}


	gl.addCrossLine = function(customStyle) {
		customStyle.cursor = 'default';

		var crossLine = {};
		crossLine.vAxis = this.addLine('vertical', customStyle);
		crossLine.hAxis = this.addLine('horizontal', customStyle);
		crossLine.remove = function() {
			this.vAxis.remove();
			this.hAxis.remove();
			return true;
		}

		var dragCrossLine = function(e) {
			crossLine.vAxis.style.left = e.pageX + 'px';
			crossLine.hAxis.style.top = e.pageY + 'px';
		}

		var rightClickCrossLine = function(e) {
			e.preventDefault();
			document.removeEventListener('mousemove', dragCrossLine);
			document.removeEventListener('click', leftClickCrossLine);
			document.removeEventListener('contextmenu', rightClickCrossLine);
			crossLine.remove();
			return false;
		}

		var leftClickCrossLine = function(e) {
			document.removeEventListener('mousemove', dragCrossLine);
			document.removeEventListener('click', leftClickCrossLine);
			document.removeEventListener('contextmenu', rightClickCrossLine);
			crossLine.vAxis.style.cursor = crossLine.vAxis.customStyle.cursor = 'w-resize';
			crossLine.hAxis.style.cursor = crossLine.hAxis.customStyle.cursor = 's-resize';
			return true;
		}

		document.addEventListener('mousemove', dragCrossLine);
		document.addEventListener('contextmenu', rightClickCrossLine);
		document.addEventListener('click', leftClickCrossLine);

		return crossLine;
	}

	
	gl.removeAll = function() {
		// hack. unable to remove items inside this.each circle 
		var elements_to_remove = [];

		this.each(function(ind, el){
			elements_to_remove.push( el );
		});

		for (i in elements_to_remove) {
			elements_to_remove[i].remove();
		}
	}


	gl.showAll = function() {
		this.visible = true;
		this.each(function(ind, line){
			line.classList.remove('glines-line-hidden');
		});
	}

	
	gl.toggleVisibility = function() {
		var visible = this.visible;
		this.visible = !this.visible;
		this.each(function(ind, line){
			if (visible) {
				line.classList.add('glines-line-hidden');
			} else {
				line.classList.remove('glines-line-hidden');
			}
		});
	}

	
	window.addEventListener('resize', function() {
		var h = gl.getWindowHeight();	
		gl.each(function(ind, line) {
			if (line.axis == 'vertical') {
				line.style.height = h + 'px';
			}
		});
	});

})(glines);