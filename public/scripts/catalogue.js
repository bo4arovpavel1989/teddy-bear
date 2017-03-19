var filter='';

$(document).ready(function(){
	getCategoryFilter();
	getProductAddForm();
	getProductsList();
});


function getCategoryFilter(){
	$.ajax({
		url: '/admin/getcategoryfilter',
		dataType: 'html',
		success: function(html){
			$('#categoryFilterPlace').append(html);
			useCategoryFilter();
		}
	});
}

function useCategoryFilter() {
	$('#categoryFilterForm').on('submit', function(e){
		e.preventDefault();
		filter='';
		var checkBoxes = document.getElementsByName('categoryFilter');
		var counter = 0;
		checkBoxes.forEach(function(checkBox){
			if(checkBox.checked == true) {
				filter += '&category' + counter + '=' + checkBox.value;
				counter++;
			}
		});
		filter += '&counter=' + counter;
		getProductsList();
	});
}

function getProductAddForm(){
	$.ajax({
		url: '/admin/getproductaddform',
		dataType: 'html',
		success: function(html){
			$('#addProductFormPlace').append(html);
			getSubCategories();
			addProductSubmit();
			showAddProductForm();
			closeForm();
		}
	});
}

function getSubCategories() {
	$('#productAddCategory').on('change', function(){
		var category=$('#productAddCategory option:selected').val();
		var query = '/admin/getsubcategories?category=' + category;
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
				success: function(){
						alert('Товар добавлен');
						$('#addProductFormPlace').toggleClass('hidden');
						$('#productsList').toggleClass('hidden');
						getProductsList();
				}
		});
		
	});
}

function showAddProductForm(){
	$('#showAddProductForm').on('click', function(){
		$('#addProductFormPlace').toggleClass('hidden');
		$('#productsList').toggleClass('hidden');
	});
}

function closeForm() {
	$('.cancelButton').on('click', function(){
		$(this).closest('.formPlace').empty();
		$('#productsList').removeClass('hidden');
	});
};


function getProductsList() {
	var query = '/admin/getproductslist';
	if (filter !== '') query += '?';
	query += filter;
		$.ajax({
			url: query,
			dataType: 'html',
			success: function(html){
				$('#productsList').empty();
				$('#productsList').append(html);
				deleteProduct();
				changeProduct();
				showReplenishmentForm();
				makeHit();
				replenishmentFormSubmit();
				showGalleryForm();
				galleryFormSubmit();
			}
		});
}


function deleteProduct() {
	$('.deleteProduct').on('click', function(){
		var answer = confirm('Уверен?');
		var product = $(this).data('id');
		if (answer) {
			var deleteQuery = '/admin/deleteproduct?product=' + product;
			console.log(deleteQuery);
			$.ajax({
				url: deleteQuery,
				type: 'delete',
				success: function(){
						getProductsList();
				}
			});
		}
	});	
}

function changeProduct() {
	$('.changeProduct').on('click', function(){
		var product = $(this).data('id');
		var query = '/admin/getchangeproductform?product=' + product;
		$.ajax({
			url: query,
			type: 'get',
			success: function(html){
					$('#changeProductFormPlace').empty();
					$('#changeProductFormPlace').append(html);
					closeForm();
					$('#productsList').addClass('hidden');
					changeProductSubmit();
			}
		});
	});
}

function changeProductSubmit(){
	$('#changeProduct').on('submit', function(e){
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
				success: function(){
						$('#changeProductFormPlace').empty();
						$('#productsList').toggleClass('hidden');
						getProductsList();
				}
		});
	});
}

function showReplenishmentForm() {
	$('.replenishment').on('click', function(e){
		e.preventDefault();
		$(this).parent().parent().next().toggleClass('hidden');
	});
}

function makeHit() {
	$('.makeHit').on('click', function(e){
		e.preventDefault();
		var that = $(this);
		var product = $(this).data('id');
		var query = '/admin/makehit?product=' + product;
		$.ajax({
				url: query,
				type: 'post',
				success: function(){
						that.toggleClass('greenLink');
				}
			});
	});
}

function replenishmentFormSubmit(){
	$('.replenishmentForm').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		console.log(1);
		$.ajax({
			url: $that.attr('action'),
			type: $that.attr('method'),
			contentType: false,
			processData: false,
			data: formData,
			success: function(){
					getProductsList();
			}
		});
	});
}

function showGalleryForm(){
	$('.gallery').on('click', function(e){
		e.preventDefault();
		$(this).parent().parent().next().next().toggleClass('hidden');
	});
}

function galleryFormSubmit(){
	$('.galleryForm').on('submit', function(e){
		e.preventDefault();
		var $that = $(this);
		var formData = new FormData($that.get(0));
		$.ajax({
			url: $that.attr('action'),
			type: $that.attr('method'),
			contentType: false,
			processData: false,
			data: formData,
			success: function(){
					getProductsList();
			}
		});
	});
	return false;
}



