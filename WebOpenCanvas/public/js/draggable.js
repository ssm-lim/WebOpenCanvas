(function($){

	$.fn.minimalize = function (selected) {
		var $this = $(this);
		var minimalDiv = selected || $this;
		var isClosed = $this.attr('isClosed') || 'false';
		minimalDiv.on('dblclick', function(e) {
			isClosed = $this.attr('isClosed');
			if (isClosed == 'true') {
				$this.attr('isClosed', 'false');
				minimalDiv.children().css("display", "");
			} else {
				$this.children().css("display", "none");
				$this.attr('isClosed', 'true');
				minimalDiv.css("display", "");
			}
		});
	};



	$.fn.draggable = function(selected){
		var $this = $(this);
		var dragDiv = selected || $this;

		var meX = 0, meY = 0;
		var meHeight = 0, meWidth = 0;
		var startX = 0, startY = 0;
		var drag = false;

		var zIndex = [],
			applyPriority = function(item) {
				var idx = zIndex.indexOf(item);
				zIndex.splice(idx, 1);
				zIndex.push(item);
				for (var i = 0; i < zIndex.length; i++) {
					$(zIndex[i]).css('z-index', i + 100);
				}
			};

		$this.on('mousedown', function(e) {
			applyPriority($this);
		});
		dragDiv.hover(function() {
			$(this).css('cursor', 'move');
		});
		dragDiv.on('mousedown', function(e) {
			startX = e.pageX;
			startY = e.pageY;

			meX = $this.position().left;
			meY = $this.position().top;

			meWidth = $this.width();
			meHeight = $this.height();

			drag = true;
		});
		dragDiv.on('mousemove', function(e) {
			if (drag) {
				var left = meX + (e.pageX - startX);
				var top = meY + (e.pageY - startY);

				if (left >= 0 && left + meWidth <= $(document.body).innerWidth()) {
					$this.css('left', left + 'px');
				}
				if (top >= 0 && top + meHeight <= $(document.body).innerHeight()) {
					$this.css('top', top + 'px');
				}
			}
		});
		dragDiv.on('mouseup mouseout', function(e) {
			drag = false;
		});
		dragDiv.on('selectstart', function(e) {
			e.preventDefault && e.preventDefault();
			e.stopPropagation && e.stopPropagation();
			e.returnValue = false;
			return false;
		});
	};
})(jQuery);
