$(document).ready(function(){
	getAddSpecialPropFormForProduct();
	getAddSpecialPropFormForCategory();
	getSpecialPropsList();
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

function getAddSpecialPropFormForCategory() {
	$('#showAddSpecialPropForCategory').on('click', function(){
		$.ajax({
			url: '/admin/getspecialpropformforcategory',
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

function getSpecialPropsList() {
	$.ajax({
		url: '/admin/getspecialpropslist',
		type: 'get',
		dataType: 'html',
		success: function(html) {
			$('#specialPropsList').empty();
			$('#specialPropsList').append(html);
			deleteSpecialProp();
		}
	});
}
function deleteSpecialProp(){
	$('.deleteSpecialProp').on('click', function(){
		var answer = confirm('Уверен?');
		if(answer) {
			var specialProp = $(this).data('id');
			var query='/admin/deletespecialprop?specialprop=' + specialProp;
			$.ajax({
				url: query,
				type: 'delete',
				success: function(){
					alert('Акция удалена');
					location.reload();
				}
			});
		}
	});
}