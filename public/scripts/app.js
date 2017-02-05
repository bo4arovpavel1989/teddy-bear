var searchAvailable = true;

$(document).ready(function(){
	searchProductRealtime();
	searchProductSubmit();
});



function searchProductSubmit() {
	$('.searchSubmit').on('click', function(){
		searchSuggestion();
	});
}

function searchProductRealtime() {
	$('.searchProduct').on('keyup', function(err, rep){
		if (searchAvailable) {
			searchAvailable = false;
			searchSuggestion();
			setTimeout(function(){searchAvailable = true}, 1000);
		}
	});
}

function clickSearchResutItem(){
	$('.searchResultItem').on('click', function(){
		var address = $(this).data('address');
		location.assign(address);
	});
}

function searchSuggestion() {
	var productToFind = $('.searchProduct').val();
	if (productToFind !== '') {
		var query = '/searchproduct?product=' + productToFind;
		$.ajax({
			url: query,
			dataType: 'html',
			success: function(html){
				$('#searchResult').empty();
				$('#searchResult').addClass('active');
				$('#searchResult').append(html);
				clickSearchResutItem();
				hideSuggestion();
			}
		});
	}
}

function hideSuggestion() {
	$(document).on('click', function(e) {
		if($('#searchResult').hasClass('active')) {
			if (!$(e.target).closest("#searchArea").length) {
				$('#searchResult').removeClass('active');
				$(document).unbind('click');
			}
			e.stopPropagation();
		}
	});
}