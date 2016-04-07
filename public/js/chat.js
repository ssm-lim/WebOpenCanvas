
(function($){
	/*
	var CanvasChat = function(element, socket) {

		var me = this;
		me.element = element;
		me.socket = socket;

		var chat = $('<div id="chat" class="panel panel-default">').appendTo(me.element);
		var heading = $('<div class="panel-heading"><span class="glyphicon glyphicon-user"></span><span>Chat</span></div>').appendTo(chat);
			chat.draggable(heading);
			chat.minimalize(heading);
			chat.resizable();

			me.usersInfo = $('<a href="#">(3명)</a>').appendTo(heading);

			me.msgList = $('<div class="chat-msg list-group">').appendTo(chat);

		var footer =  $('<div class="chat-menu panel-footer input-group">').appendTo(chat);
			me.input = $('<input type="text" class="form-control" placeholder="메세지를 입력하세요">').appendTo(footer);
			me.submit = $('<span class="input-group-btn"><button class="btn btn-primary" type="button">전송</button></span>')
						.appendTo(footer)
						.find('button')
						.click(function(e){
							me.sendMsg(me.input.val());
						});
	};

	CanvasChat.prototype = {
			constructor: CanvasChat,
			addMsg : function(message) {
				var appendEl = $('<a href="#" class="list-group-item">');
				var user = $('<span>', {
					class : 'chat-msg-name'
				}).html(message.user + ' : ');

				var msg = $('<span>', {
					class : 'chat-msg-txt'
				}).html(message.msg);

				appendEl.append(user).append(msg);
				this.msgList.appendTo(appendEl);
			},
			sendMsg : function(message){
				aa
			},
			now : function(){
				var now = new Date().getTime();
			}
	};

	$.fn.canvas = function (options) {
		return new CanvasChat(this, $.extend({}, $.fn.canvas.defaults, options));
	};

	$.fn.canvas.defaults = {

	};

	$.fn.canvas.Constructor = CanvasDrawing;
*/
})(jQuery);
