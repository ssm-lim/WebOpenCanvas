
(function($){

	var drawingMirrorTools = {
		pencil : function(self) {
			var context = self.context;

			this.mousedown = function(data) {
				self.setColor();
				self.setLineWidth();

				context.beginPath();
				context.moveTo(data.startX, data.startY);
			};
			this.mousemove = function(data) {
				context.lineTo(data.mouseX, data.mouseY);
				context.stroke();
			};
			this.mouseup = function(data) {
				context.closePath();
				self.push();
			};
			this.mouseout = this.mouseup;
		},
		eraser : function(self) {
			var context = self.context;

			this.mousedown = function(data) {
				context.strokeStyle = "#fff";
				self.setLineWidth();

				context.beginPath();
				context.moveTo(data.startX, data.startY);
			};
			this.mousemove = function(data) {
				context.lineTo(data.mouseX, data.mouseY);
				context.stroke();
			};
			this.mouseup = function(data) {
				context.closePath();
				self.push();
			};
			this.mouseout = this.mouseup;
		},
		rectangle : function(self) {
			var context = self.context;

			this.mousedown = function(data) {
				self.setColor();
				self.setLineWidth();
			};
			this.mouseup = function(data) {
				context.beginPath();
				var x = Math.min(data.mouseX, data.startX), y = Math.min(data.mouseY, data.startY),
						w = Math.abs(data.mouseX - data.startX), h = Math.abs(data.mouseY - data.startY);
				context.strokeRect(x, y, w, h);
				context.closePath();
				self.push();
			};
			this.mouseout = this.mouseup;
		},
		circle : function(self) {
			var context = self.context;

			this.mousedown = function(data) {
				self.setColor();
				self.setLineWidth();
			};
			this.mouseup = function(data) {
				var x = Math.min(data.mouseX, data.startX), y = Math.min(data.mouseY, data.startY),
						w = Math.abs(data.mouseX - data.startX), h = Math.abs(data.mouseY - data.startY);
				var cX = x + w / 2.0, cY = y + h / 2.0,
						r = Math.sqrt(Math.pow(w / 2.0, 2) + Math.pow(h / 2.0, 2), 2);
				context.beginPath();
				context.arc(cX, cY, r, 0, 2 * Math.PI);
				context.stroke();
				context.closePath();
				self.push();

				console.log(data);
			};
			this.mouseout = this.mouseup;
		},
		line : function(self) {
			var context = self.context;

			this.mousedown = function(data) {
				self.setColor();
				self.setLineWidth();
			};
			this.mouseup = function(data) {
				context.beginPath();
				context.moveTo(data.startX, data.startY);
				context.lineTo(data.mouseX, data.mouseY);
				context.stroke();
				context.closePath();
				self.push();
			};
			this.mouseout = this.mouseup;
		}
	};


	var CanvasMirroring = function(element, id, options) {
		var me = this;
				me.element = element;
				me.options = options;

		var canvas = $('<canvas id="canvas' + id + '" class="canvas-mirror" width='+ me.options.width +' height=' + me.options.height + '>').appendTo(me.element)[0];

		me.canvas = canvas;
		me.context = me.canvas.getContext("2d");

		me.record = [];
		me.count = 0;
		me.push();

		me.tools = drawingMirrorTools;
		me.setColor(me.color = me.options.color);
		me.setLineWidth(me.lineWidth = me.options.lineWidth);
		me.context.lineCap = me.options.lineCap;
		me.context.lineJoin = me.options.lineJoin;

		me.setTool('pencil');
	};

	CanvasMirroring.prototype = {
			constructor: CanvasMirroring,
			setTool : function(tool) {
				var self = this;
				this.options.tool = tool;
				this.tool = new this.tools[tool](self);
			},
			setColor : function(color) {
				this.color = color || this.color;
				this.context.strokeStyle = this.color;
			},
			setLineWidth : function(lineWidth) {
				this.lineWidth = lineWidth || this.lineWidth;
				this.context.lineWidth = this.lineWidth;
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
				while(this.count > 0) {
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
			destroy : function(){
				$(this.canvas).remove();
				delete this;
			}
	};

	$.fn.addCanvasMirror = function (id, options) {
		return new CanvasMirroring($(this).find('canvas').parent()[0], id, $.extend({}, $.fn.addCanvasMirror.defaults, options));
	};

	$.fn.addCanvasMirror.defaults = {
		width : 500,
		height : 500,
		color: '#000',
		lineWidth: 3,
		lineCap : 'round',
		lineJoin : 'round',
		tool : 'pencil'
	};

	$.fn.addCanvasMirror.Constructor = CanvasMirroring;

})(jQuery);
