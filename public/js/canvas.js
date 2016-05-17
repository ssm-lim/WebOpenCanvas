
(function($){

	var drawingTools = {
		pencil : function(self) {
			var context = self.context,
					canvas = self.container;
			self.setColor();
			self.setLineWidth();
			self.started = false;

			this.mousedown = function(e) {
				self.startX = e.offsetX;
				self.startY = e.offsetY;
				context.beginPath();
				context.moveTo(self.startX, self.startY);
				self.started = true;

				if(self.options.mousedown){
					self.options.mousedown(self.getCanvasInfo());
				}
			};

			this.mousemove = function(e) {
				if (self.started) {
					self.mouseX = e.offsetX;
					self.mouseY = e.offsetY;
					context.lineTo(self.mouseX, self.mouseY);
					context.stroke();

					if(self.options.mousemove){
						self.options.mousemove(self.getCanvasInfo());
					}
				}
			};

			this.mouseup = function(e) {
				if (self.started) {
					context.closePath();
					self.started = false;
					self.push();

					if(self.options.mouseup){
						self.options.mouseup(self.getCanvasInfo());
					}
				}
			};

			this.mouseout = this.mouseup;
		},
		eraser : function(self) {
			var context = self.context,
				canvas = self.container;

			self.started = false;
			self.setLineWidth();
			context.strokeStyle = "#fff";

			this.mousedown = function(e) {
				self.startX = e.offsetX;
				self.startY = e.offsetY;
				context.beginPath();
				context.moveTo(self.startX, self.startY);
				self.started = true;
			};

			this.mousemove = function(e) {

				if (self.started) {
					self.mouseX = e.offsetX;
					self.mouseY = e.offsetY;
					context.lineTo(self.mouseX, self.mouseY);
					context.stroke();
				}
			};

			this.mouseup = function(e) {
				if (self.started) {
					context.closePath();
					self.started = false;
					self.push();
				}
			};

			this.mouseout = this.mouseup;
		},
		rectangle : function(self) {
			var context = self.context,
				canvas = self.container;

			self.setColor();
			self.setLineWidth();

			self.started = false;

			this.mousedown = function(e) {
				self.startX = e.offsetX;
				self.startY = e.offsetY;
				context.beginPath();
				self.started = true;

				if(self.options.mousedown){
					self.options.mousedown(self.getCanvasInfo());
				}
			};

			this.mousemove = function(e) {

				if (self.started) {
					self.mouseX = e.offsetX;
					self.mouseY = e.offsetY;

					var x = Math.min(self.mouseX, self.startX), y = Math.min(self.mouseY, self.startY),
						w = Math.abs(self.mouseX - self.startX), h = Math.abs(self.mouseY - self.startY);
					self.redraw();
					context.strokeRect(x, y, w, h);

					if(self.options.mousemove){
						self.options.mousemove(self.getCanvasInfo());
					}
				}
			};

			this.mouseup = function(e) {
				if (self.started) {
					context.closePath();
					self.started = false;
					self.push();

					if(self.options.mouseup){
						self.options.mouseup(self.getCanvasInfo());
					}
				}
			};

			this.mouseout = this.mouseup;
		},
		circle : function(self) {
			var context = self.context,
				canvas = self.container;

			self.setColor();
			self.setLineWidth();

			self.started = false;

			this.mousedown = function(e) {
				self.startX = e.offsetX;
				self.startY = e.offsetY;
				self.started = true;
			};

			this.mousemove = function(e) {

				if (self.started) {
					self.mouseX = e.offsetX;
					self.mouseY = e.offsetY;

					self.redraw();

					var x = Math.min(self.mouseX, self.startX), y = Math.min(self.mouseY, self.startY),
						w = Math.abs(self.mouseX - self.startX), h = Math.abs(self.mouseY - self.startY);
					var cX = x + w / 2.0, cY = y + h / 2.0,
						r = Math.sqrt(Math.pow(w / 2.0, 2) + Math.pow(h / 2.0, 2), 2);
					context.beginPath();
					context.arc(cX, cY, r, 0, 2 * Math.PI);
					context.stroke();
					context.closePath();
				}
			};

			this.mouseup = function(e) {
				if (self.started) {
					self.started = false;
					self.push();
				}
			};

			this.mouseout = this.mouseup;
		},
		line : function(self) {
			var canvas = self.canvas,
				context = self.context;

			self.setColor();
			self.setLineWidth();

			self.started = false;

			this.mousedown = function(e) {
				self.startX = e.offsetX;
				self.startY = e.offsetY;
				self.started = true;
			};

			this.mousemove = function(e) {

				if (self.started) {
					self.mouseX = e.offsetX;
					self.mouseY = e.offsetY;

					self.redraw();

					context.beginPath();
					context.moveTo(self.startX, self.startY);
					context.lineTo(self.mouseX, self.mouseY);
					context.stroke();
					context.closePath();
				}
			};

			this.mouseup = function(e) {
				if (self.started) {
					self.started = false;
					self.push();
				}
			};

			this.mouseout = this.mouseup;
		}
	};


	var CanvasDrawing = function(element, options) {
		var me = this;
		me.element = element;
		me.options = options;

		me.container = $('<div>', {
								class : 'canvas-container',
								css : {
									'width' : me.options.width + 'px',
									'height' : me.options.height + 'px'
								}
						 }).appendTo(me.element);

		me.canvas = $('<canvas width='+ me.options.width +' height=' + me.options.height + ' style="z-index:20;">').appendTo(me.container)[0];
		me.context = me.canvas.getContext("2d");

		me.record = [];
		me.count = 0;
		me.push();

		me.tools = drawingTools;
		me.setColor(me.color = me.options.color);
		me.setLineWidth(me.lineWidth = me.options.lineWidth);
		me.context.lineCap = me.options.lineCap;
		me.context.lineJoin = me.options.lineJoin;

		var menu = $('<div id="menu" class="panel panel-default">').appendTo(me.element);
		var heading = $('<div class="panel-heading">' +
						'<span class="glyphicon glyphicon-pencil"></span> Menu' +
						'</div>').appendTo(menu);
			menu.draggable(heading);
			menu.minimalize(heading);
		var body = $('<div class="menu-panel panel-body">').appendTo(menu);


		var	tools = $('<div class="tools rows"></div>').appendTo(body);
		$(Object.keys(drawingTools)).each(function(idx, obj){
			var div = $('<div>', {
				class : 'tool col-xs-6',
				css : {
					'margin-right' : (idx%2 === 0)? 4 : 0 + 'px',
					'margin-bottom' : 4 + 'px',
					'background-image': 'url("../img/tools/' + obj + '.png")',
					'background-size' : 'contain'
				},
				tool : obj
			})
			.click(function(e){
				$('#menu .tool').css('background-color', '#fff');
				$(this).css('background-color', 'highlight');
				me.setTool($(this).attr('tool'));
			})
			.appendTo(tools);
			if(obj == me.options.tool) div.trigger('click');
		});

		var unredo = $('<div class="unredo"><div class="btn-group" role="group"></div></div>').appendTo(body),
			undoBtn = $('<button type="button" class="btn btn-default">' +
					 '<span class="glyphicon glyphicon-chevron-left"></span>' +
					 '</button>')
					.appendTo(unredo.find('.btn-group'))
					.click(function() {
						me.undo();
						if(me.options.undo){
							me.options.undo();
						}
					}),
			redoBtn = $('<button type="button" class="btn btn-default">' +
					'<span class="glyphicon glyphicon-chevron-right"></span>' +
					'</button>')
					.appendTo(unredo.find('.btn-group'))
					.click(function() {
						me.redo();
						if(me.options.redo){
							me.options.redo();
						}
					});

		var color = $('<div class="color">' +
						'<div class="media">' +
							'<div class="media-left">' +
								'<a class="rgb-view" href="#"></a>' +
						    '</div>' +
						    '<div class="media-body rgb-code">' +
								'<div class="rgb-code-r">R 0</div>' +
								'<div class="rgb-code-g">G 0</div>'+
								'<div class="rgb-code-b">B 0</div>' +
							'</div>' +
						'</div>' +
					 '</div>')
					 .appendTo(body)
					 .find('.rgb-view')
					 .ColorPicker({
						color : '#000',
						onShow : function(colpkr) {
							$(colpkr).fadeIn(500);
							return false;
						},
						onHide : function(colpkr) {
							$(colpkr).fadeOut(500);
							return false;
						},
						onChange : function(hsb, hex, rgb) {
							color.css('backgroundColor', '#' + hex);
							color.parent().parent().find('.rgb-code-r').html('R ' + rgb.r);
							color.parent().parent().find('.rgb-code-g').html('G ' + rgb.g);
							color.parent().parent().find('.rgb-code-b').html('B ' + rgb.b);
							me.setColor('#' + hex);
						}
					});

		var lineWidth = $('<div class="linewidth"><input data-slider-id="slider" type="text" data-slider-min="1" data-slider-max="10" data-slider-step="1" data-slider-value="3"></div>')
						.appendTo(body)
						.find('input').slider().on('slide', function(e) {
							me.setLineWidth(e.value);
						});

			//
			// $(me.container).on('mousedown', function(ev){
			// 	if(me.options.mousedown){
			// 		me.options.mousedown(me.getCanvasInfo());
			// 	}
			// });
			// $(me.container).on('mousemove', function(ev){
			// 	if(me.started && me.options.mousemove){
			// 		me.options.mousemove(me.getCanvasInfo());
			// 	}
			// });
			// $(me.container).on('mouseup', function(ev){
			// 	if(me.options.mouseup){
			// 		me.options.mouseup(me.getCanvasInfo());
			// 	}
			// });
			// $(me.container).on('mouseout', function(ev){
			// 	if(me.options.mouseout){
			// 		me.options.mouseout(me.getCanvasInfo());
			// 	}
			// });

	};

	CanvasDrawing.prototype = {
			constructor: CanvasDrawing,
			setTool : function(tool) {
				var drawing = this;
				if(this.tool){
					$(this.container).off('mousedown', this.tool.mousedown);
					$(this.container).off('mouseup', this.tool.mouseup);
					$(this.container).off('mousemove', this.tool.mousemove);
					$(this.container).off('mouseout', this.tool.mouseout);
				}

				this.options.tool = tool;
				this.tool = new this.tools[tool](drawing);
				$(this.container).on('mousedown', this.tool.mousedown);
				$(this.container).on('mouseup', this.tool.mouseup);
				$(this.container).on('mousemove', this.tool.mousemove);
				$(this.container).on('mouseout', this.tool.mouseout);
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
			getCanvasInfo : function(){
				return {
					startX : this.startX,
					startY : this.startY,
					mouseX : this.mouseX,
					mouseY : this.mouseY,
					started : this.started,
					tool : this.options.tool,
					color : this.color,
					lineWidth : this.lineWidth,
					type : this.options.tool
				};
			}
	};

	$.fn.canvas = function (options) {
		return new CanvasDrawing(this, $.extend({}, $.fn.canvas.defaults, options));
	};

	$.fn.canvas.defaults = {
		width : 500,
		height : 500,
		color: '#000',
		lineWidth: 3,
		lineCap : 'round',
		lineJoin : 'round',
		tool : 'pencil'
	};

	$.fn.canvas.Constructor = CanvasDrawing;

})(jQuery);
