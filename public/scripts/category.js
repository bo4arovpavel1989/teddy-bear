$(document).ready(function(){
	getCategories();
});
	
function getCategories () {	
			$.ajax({
					url: '/admin/getcategories',
					dataType: 'html',
					success: function(html){
						$("#categories").append(html);
						addSubCategorySubmit();
						deleteCategory();
						changeCategory();
						deleteSubCategory();
						changeSubCategory()
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
			var deleteQuery = '/admin/deletecategory?category=' + category;
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

function changeCategory() {
	$('.changeCategory').on('click', function(){
		var category = $(this).data('id');
		var oldName = $(this).data('name');
		$.ajax({
			url: "../view/forms/changecategoryform.html",
			success: function(html) {
				$('#changeCategoryFormPlace').empty();
				$('#changeCategoryFormPlace').append(html);
				$('#inpuCategoryId').val(category);
				$('#inputNewCategory').val(oldName).focus();
				return false;
			}
		});
	});
}

function deleteSubCategory() {
	$('.deleteSubCategory').on('click', function(){
		var answer = confirm('Уверен?');
		var subcategory = $(this).data('id');
		var parentCategory = $(this).data('parentid');
		if (answer) {
			var deleteQuery = '/admin/deletesubcategory?subcategory=' + subcategory + '&parentcategory=' + parentCategory;
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

function changeSubCategory() {
	$('.changeSubCategory').on('click', function(){
		var answer = confirm('Уверен?');
		var subcategory = $(this).data('id');
		var oldName = $(this).data('name');
		var parentCategory = $(this).data('parentid');
		if (answer) {
			$.ajax({
				url: "../view/forms/changesubcategoryform.html",
				success: function(html) {
					$('#changeCategoryFormPlace').empty();
					$('#changeCategoryFormPlace').append(html);
					$('#inputCategoryId').val(parentCategory);
					$('#inputSubCategoryId').val(subcategory);
					$('#inputNewSubCategory').val(oldName).focus();
					return false;
				}
			});
		}
	});
}