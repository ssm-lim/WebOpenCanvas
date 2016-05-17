
(function($){

	$.fn.resizable = function(){
		var me = $(this);
		var body = $(me.children('.list-group')[0]);

		var startHeight = 0, startWidth = 0;
		var startX = 0, startY = 0;
		var resizerX = 0, resizerY = 0;

		var resizer = $('<img>', {
			class : 'resizer',
			src : '../img/icon/resizer.png',
			css : {
				position : 'absolute',
				top : me.innerHeight() - 7,
				left : me.innerWidth() - 7
			}
		}).appendTo(obj);

		$(resizer).hover(function() {
			$(this).css('cursor', 'se-resize');
		});
		$(resizer).on('dragstart', function(e) {
			startX = e.pageX;
			startY = e.pageY;

			startWidth = $(body).innerWidth();
			startHeight = $(body).innerHeight();

			resizerX = $(this).position().left;
			resizerY = $(this).position().top;
		});

		$(resizer).on('drag dragend', function(e) {
			var width = startWidth + (e.pageX - startX);
			var height = startHeight + (e.pageY - startY);

			if (width > 0) {
				$(this).css('left', (resizerX + (e.pageX - startX)) + 'px');
				me.width(width);
			}
			if (height > 0) {
				$(this).css('top', (resizerY + (e.pageY - startY)) + 'px');
				body.height(height);
			}
		});
	};

})(jQuery);
