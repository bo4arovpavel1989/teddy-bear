	$(document).ready(function(){
		getCategories();
	});
	
function getCategories () {	
			$.ajax({
					url: '/getcategories',
					dataType: 'html',
					success: function(html){
						$("#categories").append(html);
						addSubCategorySubmit();
						deleteCategory();
					}
				});
}

function addSubCategorySubmit () {
	$('#addSubCategory').on('submit', function(e){
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
						$('#inputSubCategory').val('');
				}
		});
		
	});
}

function deleteCategory() {
	$('.deleteCategory').on('click', function(){
		var answer = confirm('Уверен?');
		var category = $(this).data('id');
		if (answer) {
			var deleteQuery = '/deletecategory?category=' + category;
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