$(document).ready(function(){
	getAddSpecialPropFormForProduct();
});

function getAddSpecialPropFormForProduct() {
	$('#showAddSpecialPropForProduct').on('click', function(){
		$.ajax({
			url: '/admin/getspecialpropformforproduct',
			type: 'get',
			dataType: 'html',
			success: function(html) {
				$('#addSpecialPropFormPlace').empty();
				$('#addSpecialPropFormPlace').append(html);
				$('#addSpecialPropFormPlace').toggleClass('hidden');
			}
		});
	});
}