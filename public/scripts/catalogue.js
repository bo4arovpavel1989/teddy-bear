$(document).ready(function(){
	getProductAddForm();
});

function getProductAddForm(){
	$.ajax({
		url: '/getproductaddform',
		dataType: 'html',
		success: function(html){
			$('#addProductFormPlace').append(html);
			getSubCategories();
			addProductSubmit();
		}
	});
}

function getSubCategories() {
	$('#productAddCategory').on('change', function(){
		var category=$('#productAddCategory option:selected').val();
		var query = '/getsubcategories?category=' + category;
		$.ajax({
			url: query,
			dataType: 'html',
			success: function(html){
				$('#productAddSubcategory').empty();
				$('#productAddSubcategory').append(html);
			}
		});
	});
}

function addProductSubmit() {
	$('#addProduct').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		console.log(formData);
		$.ajax({
				url: $that.attr('action'),
				type: $that.attr('method'),
				contentType: false,
				processData: false,
				data: formData,
				dataType: 'json',
				success: function(){
						alert('Товар добавлен');
				}
		});
		
	});
}