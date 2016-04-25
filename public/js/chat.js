
(function($){

	var CanvasChat = function(element, socket) {

		var me = this;
		me.chat = element;
		me.socket = socket;

		var heading = $('<div class="panel-heading"><span class="glyphicon glyphicon-user"></span><span>Chat</span></div>').appendTo(chat);
			me.chat.draggable(heading);
			me.chat.minimalize(heading);
			// me.chat.resizable();

			me.usersInfo = $('<a href="#">(3명)</a>').appendTo(heading);

			me.msgList = $('<div class="chat-msg list-group">').appendTo(chat);

		var footer =  $('<div class="chat-menu panel-footer input-group">').appendTo(chat);
		me.input = $('<input type="text" class="form-control" placeholder="메세지를 입력하세요">')
								 .appendTo(footer)
								 .keydown(function(e){
			 							if(e.keyCode == 13){
			 								me.submit.trigger('click');
			 							}
			 						});
			me.submit = $('<span class="input-group-btn"><button class="btn btn-primary" type="button">전송</button></span>')
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
				this.socket.on('serverMsg', function(data){
					me.addMsg(data);
				});

				this.socket.on('changePerson', function(data){
					var msg = data.user + '님이 ';
					if(data.status){
						msg += '입장하셨습니다.';
					} else {
						msg += '퇴장하셨습니다.';
					}
					me.sysMsg(msg);
				});
			},
			sysMsg : function(message) {
				var appendEl = $('<a href="#" class="list-group-item">');
				var user = $('<span>', {
					class : 'chat-msg-name'
				}).html('&lt;System&gt; ');

				var msg = $('<span>', {
					class : 'chat-msg-txt'
				}).html(message);

				appendEl.append(user).append(msg);
				appendEl.appendTo(this.msgList);
			},
			addMsg : function(message) {
				var appendEl = $('<a href="#" class="list-group-item">');
				var user = $('<span>', {
					class : 'chat-msg-name'
				}).html(message.user + ' : ');

				var msg = $('<span>', {
					class : 'chat-msg-txt'
				}).html(message.msg);

				appendEl.append(user).append(msg);
				appendEl.appendTo(this.msgList);
			},
			sendMsg : function(message){
				this.socket.emit('clientMsg', {
					msg : message
				});
				this.submit.val('');
			},
			now : function(){
				var now = new Date().getTime();
			}
	};

	$.fn.chat = function (socket) {
		var chat = new CanvasChat($(this), socket);
		chat.init();
		return chat;
	};

	$.fn.chat.Constructor = CanvasChat;

})(jQuery);
