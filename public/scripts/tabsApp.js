$(document).ready(function(){
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

		

