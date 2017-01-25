$(document).ready(function(){
	getProductAddForm();
	getProductsList();
});

function getProductAddForm(){
	$.ajax({
		url: '/getproductaddform',
		dataType: 'html',
		success: function(html){
			$('#addProductFormPlace').append(html);
			getSubCategories();
			addProductSubmit();
			showAddProductForm();
		}
	});
}

function getProductsList() {
	var query = '/getproductslist';
		$.ajax({
			url: query,
			dataType: 'html',
			success: function(html){
				$('#productsList').empty();
				$('#productsList').append(html);
				deleteProduct();
				changeProduct();
			}
		});
}

function deleteProduct() {
	$('.deleteProduct').on('click', function(){
		var answer = confirm('Уверен?');
		var product = $(this).data('id');
		if (answer) {
			var deleteQuery = '/deleteproduct?product=' + product;
			console.log(deleteQuery);
			$.ajax({
				url: deleteQuery,
				type: 'delete',
				success: function(){
						location.reload();
				}
			});
		}
	});	
}

function changeProduct() {
	$('.changeProduct').on('click', function(){
		var answer = confirm('Уверен?');
		var product = $(this).data('id');
		if (answer) {
			var query = '/getchangeproductform?product=' + product;
			$.ajax({
				url: query,
				type: 'get',
				success: function(html){
						$('#changeProductFormPlace').empty();
						$('#changeProductFormPlace').append(html);
				}
			});
		}
	});
}

function showAddProductForm(){
	$('#showAddProductForm').on('click', function(){
		$('#addProductFormPlace').toggleClass('hidden');
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