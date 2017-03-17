$(document).ready(function(){
	forEachForIe();
	$(".tab").click(function(){ /*переключение вкладок*/
		var clickedTab = $(this);
		if (!$(this).parent().hasClass('active')) {
			$('.active').removeClass("active");
			$(this).parent().addClass("active");
			var targetFile = '../view/tabs/' + $(this).data('name') + ".html";
			$("#tabsData").empty();
			$(document).off();
			$.ajax({
				url: targetFile,
				success: function(html){
							$("#tabsData").append(html);
							$(".navbar-collapse").removeClass("in");
						}
			});
		}			
	});

});			

function forEachForIe(){ /*adding Array method forEach for Internet Explorer*/
	if (typeof Array.prototype.forEach != 'function') {
		Array.prototype.forEach = function(callback){
		  for (var i = 0; i < this.length; i++){
			callback.apply(this, [this[i], i, this]);
		  }
		};
	}
}	

		

