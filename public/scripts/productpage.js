$(document).ready(function(){
	if(loggedIn) {
		$('.deleteImage').each(function(){
			$(this).removeClass('hidden');
		});
		deleteImage();
	}
	goBack();
});
function goBack(){
	$('.goBack').on('click', function(e){
		e.preventDefault();
		history.back();
	});
}

function deleteImage(){
	$('.deleteImage').on('click', function(e){
		e.preventDefault();
		var answer=confirm('Уверен?');
		var image = $(this).data('image');
		var image_thumb = $(this).data('image_thumb');
		var product = $(this).data('id');
		var query='/admin/deleteimage?image=' + image + '&product=' + product + '&image_thumb=' + image_thumb;
		if (answer)
		$.ajax({
			url: query,
			type: 'delete',
			success: function(){
				location.reload();
			}
		});
	});
}

