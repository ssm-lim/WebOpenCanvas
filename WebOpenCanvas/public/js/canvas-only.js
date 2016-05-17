$(function() {

	var CanvasDrawing = function(canvas) {
		this.canvas = canvas;
		this.context = canvas.getContext("2d");

		this.color = '#000';
		this.thickness = 1;

		this.record = [];
		this.count = 0;

	};

	CanvasDrawing.prototype = {
		init : function() {
			var defaultTool = 'pencil';
			this.push();

			this.tools = this.drawingTools;
			this.setTool(defaultTool);
		},
		setTool : function(tool) {
			var drawing = this;

			if(this.tool){
				this.canvas.removeEventListener('mousedown', this.tool.mousedown, false);
				this.canvas.removeEventListener('mouseup', this.tool.mouseup, false);
				this.canvas.removeEventListener('mousemove', this.tool.mousemove, false);
				this.canvas.removeEventListener('mouseout', this.tool.mouseout, false);
			}

			this.tool = new this.tools[tool](drawing);
			this.canvas.addEventListener('mousedown', this.tool.mousedown, false);
			this.canvas.addEventListener('mouseup', this.tool.mouseup, false);
			this.canvas.addEventListener('mousemove', this.tool.mousemove, false);
			this.canvas.addEventListener('mouseout', this.tool.mouseout, false);
		},
		setColor : function(color) {
			if(color){
				this.color = color;
			}
			this.context.strokeStyle = this.color;
		},
		undo : function() {
			if (this.count >= 0 && this.count < this.record.length - 1) {
				this.count++;
				this.redraw();
			}
		},
		redo : function() {
			if (this.count > 0 && this.count <= this.record.length) {
				this.count--;
				this.redraw();
			}
		},
		redraw : function() {
			this.clear();

			var canvasPic = new Image();
			canvasPic.src = this.record[this.record.length - this.count - 1];
			this.context.drawImage(canvasPic, 0, 0);
			return canvasPic;
		},
		push : function() {
			var MAX_REACORD_NUM = 50;

			while(this.count) {
	        	this.record.pop();
	        	this.count--;
	    }

			this.record.push(this.canvas.toDataURL());
			if (this.record.length > MAX_REACORD_NUM) {
				this.record.shift();
			}
			return this.record;
		},
		clear : function(){
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		},
		drawingTools : {
			pencil : function(drawing) {
				var tool = this;
				var context = drawing.context;
				var started = false;
				drawing.setColor();

				this.mousedown = function(e) {
					var startX = e.pageX - canvas.offsetLeft;
					var startY = e.pageY - canvas.offsetTop;
					context.beginPath();
					context.moveTo(startX, startY);
					started = true;
				};

				this.mousemove = function(e) {

					if (started) {
						var mouseX = e.offsetX;
						var mouseY = e.offsetY;
						context.lineTo(mouseX, mouseY);
						context.stroke();
					}
				};

				this.mouseup = function(e) {
					if (started) {
						context.closePath();
						started = false;
						drawing.push();
					}
				};

				this.mouseout = this.mouseup;
			},
			eraser : function(drawing) {
				var tool = this;
				var context = drawing.context;
				var canvas = drawing.canvas;
				var started = false;

				context.strokeStyle = "#fff";

				this.mousedown = function(e) {
					var startX = e.pageX - canvas.offsetLeft;
					var startY = e.pageY - canvas.offsetTop;
					context.beginPath();
					context.moveTo(startX, startY);
					started = true;
				};

				this.mousemove = function(e) {

					if (started) {
						var mouseX = e.pageX - canvas.offsetLeft;
						var mouseY = e.pageY - canvas.offsetTop;
						context.lineTo(mouseX, mouseY);
						context.stroke();
					}
				};

				this.mouseup = function(e) {
					if (started) {
						context.closePath();
						started = false;
						drawing.push();
					}
				};

				this.mouseout = this.mouseup;
			},
			rectangle : function(drawingObj) {
				var tool = this;
				var drawing = drawingObj;
				var canvas = drawing.canvas;
				var context = drawing.context;

				var started = false;
				var startX, startY, mouseX, mouseY;

				this.mousedown = function(e) {
					startX = e.pageX - canvas.offsetLeft;
					startY = e.pageY - canvas.offsetTop;
					context.beginPath();
					started = true;
				};

				this.mousemove = function(e) {

					if (started) {
						mouseX = e.pageX - canvas.offsetLeft;
						mouseY = e.pageY - canvas.offsetTop;

						var x = Math.min(mouseX, startX), y = Math.min(mouseY, startY),
						w = Math.abs(mouseX - startX), h = Math.abs(mouseY - startY);
						drawing.redraw();
						context.strokeRect(x, y, w, h);
					}
				};

				this.mouseup = function(e) {
					if (started) {
						context.closePath();
						started = false;
						drawing.push();
					}
				};

				this.mouseout = this.mouseup;
			},
			circle : function(drawingObj) {
				var tool = this;
				var drawing = drawingObj;
				var canvas = drawing.canvas;
				var context = drawing.context;

				var started = false;
				var startX, startY, mouseX, mouseY;

				this.mousedown = function(e) {
					startX = e.pageX - canvas.offsetLeft;
					startY = e.pageY - canvas.offsetTop;
					started = true;
				};

				this.mousemove = function(e) {

					if (started) {
						mouseX = e.pageX - canvas.offsetLeft;
						mouseY = e.pageY - canvas.offsetTop;

						drawing.redraw();

						var x = Math.min(mouseX, startX), y = Math.min(mouseY, startY), w = Math.abs(mouseX - startX), h = Math.abs(mouseY - startY);
						var cX = x + w/2.0, cY = y + h/2.0, r = Math.sqrt(Math.pow(w/2.0, 2) + Math.pow(h/2.0, 2), 2);
						context.beginPath();
						context.arc(cX, cY, r , 0 , 2 * Math.PI);
						context.stroke();
						context.closePath();
					}
				};

				this.mouseup = function(e) {
					if (started) {
						started = false;
						drawing.push();
					}
				};

				this.mouseout = this.mouseup;
			},
			line : function(drawingObj) {
				var tool = this;
				var drawing = drawingObj;
				var canvas = drawing.canvas;
				var context = drawing.context;

				var started = false;
				var startX, startY, mouseX, mouseY;

				this.mousedown = function(e) {
					startX = e.pageX - canvas.offsetLeft;
					startY = e.pageY - canvas.offsetTop;
					started = true;
				};

				this.mousemove = function(e) {

					if (started) {
						mouseX = e.pageX - canvas.offsetLeft;
						mouseY = e.pageY - canvas.offsetTop;

						drawing.redraw();

						context.beginPath();
						context.moveTo(startX, startY);
						context.lineTo(mouseX, mouseY);
						context.stroke();
						context.closePath();
					}
				};

				this.mouseup = function(e) {
					if (started) {
						started = false;
						drawing.push();
					}
				};

				this.mouseout = this.mouseup;
			}
		}
	};
});
