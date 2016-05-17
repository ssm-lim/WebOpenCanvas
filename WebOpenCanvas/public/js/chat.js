
(function($){

	var CanvasChat = function(element, room, socket) {

		var me = this;
		me.chat = element;
		me.socket = socket;
		me.room = room;

		var heading = $('<div class="panel-heading"><span class="glyphicon glyphicon-user"></span><span>Chat</span></div>').appendTo(chat);
			me.chat.draggable(heading);
			me.chat.minimalize(heading);
			// me.chat.resizable();

			me.usersInfo = $('<span>(1명)</span>').appendTo(heading);

			me.msgList = $('<div class="chat-msg list-group">').appendTo(chat);

		var footer =  $('<div class="chat-menu panel-footer input-group">').appendTo(chat);
		me.input = $('<input type="text" class="form-control" placeholder="Enter your message">')
								 .appendTo(footer)
								 .keydown(function(e){
			 							if(e.keyCode == 13){
			 								me.submit.trigger('click');
			 							}
			 						});
			me.submit = $('<span class="input-group-btn"><button class="btn btn-primary" type="button">Send</button></span>')
						.appendTo(footer)
						.find('button')
						.click(function(e){
							me.sendMsg(me.input.val());
						});
	};

	CanvasChat.prototype = {
			constructor: CanvasChat,
			init : function(){
				var me = this;
				me.socket.on('serverMsg', function(data){
					me.addMsg(data);
				});
			},
			setUserCount : function(user){
				this.usersInfo.html('(' + user + '명)');
			},
			sysMsg : function(message) {
				var appendEl = $('<a class="list-group-item">');
				var user = $('<span>', {
					class : 'chat-msg-name'
				}).html('&lt;' + this.room.roomNo + '&gt; ');

				var msg = $('<span>', {
					class : 'chat-msg-txt'
				}).html(message);

				appendEl.append(user).append(msg);
				appendEl.appendTo(this.msgList);
				this.scrollDown();
			},
			addMsg : function(message) {
				var appendEl = $('<a class="list-group-item">');
				var user = $('<span>', {
					class : 'chat-msg-name'
				}).html(message.user + ' : ');

				var msg = $('<span>', {
					class : 'chat-msg-txt'
				}).html(message.msg);

				appendEl.append(user).append(msg);
				appendEl.appendTo(this.msgList);
				this.scrollDown();
			},
			sendMsg : function(message){
				this.socket.emit('clientMsg', {
					msg : message
				});
				this.input.val('');
			},
			now : function(){
				var now = new Date().getTime();
			},
			scrollDown : function(){
    		this.msgList.animate({scrollTop : this.msgList.prop("scrollHeight")});
			},
	};

	$.fn.chat = function (room, socket) {
		var chat = new CanvasChat($(this), room, socket);
		chat.init();
		return chat;
	};

	$.fn.chat.Constructor = CanvasChat;

})(jQuery);
