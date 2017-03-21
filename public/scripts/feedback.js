$(document).ready(function(){
	getFeedback();
});
	
function getFeedback(){
	$.ajax({
		url: '/admin/getfeedback',
		dataType: 'html',
		success: function(data){
			$('#feedBackList').empty();
			$('#feedBackList').append(data);
			deleteFeedback();
		}
	});
}	

function deleteFeedback(){
	$('.deleteFeedback').on('click', function(e){
		e.preventDefault();
		var answer = confirm('Уверен?');
		var feedback = $(this).data('id');
		if (answer) {
			var deleteQuery = '/admin/deletefeedback?feedback=' + feedback;
			$.ajax({
				url: deleteQuery,
				type: 'delete',
				success: function(){
						getFeedback();
				}
			});
		}
	});
}