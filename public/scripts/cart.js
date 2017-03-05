$(document).ready(function(){
	deleteProductFromCart();
	calculateTotalPrice();
});

function openPrevSection(button){
		button.parent().hide(400);
		button.parent().prev().removeClass('active');
		button.parent().prev().prev().show(400);
		button.parent().prev().prev().prev().addClass('active');
}

function openNextSection(button){
		button.parent().hide(400);
		button.parent().prev().removeClass('active');
		button.parent().next().addClass('active');
		button.parent().next().next().show(400);
}

/*
function openPrevSection(button){
		button.parent().addClass('hidden');
		button.parent().prev().removeClass('active');
		button.parent().prev().prev().removeClass('hidden');
		button.parent().prev().prev().prev().addClass('active');
}

function openNextSection(button){
		button.parent().addClass('hidden');
		button.parent().prev().removeClass('active');
		button.parent().next().addClass('active');
		button.parent().next().next().removeClass('hidden');
}
*/
function recalculatePrice(priceField) {
	var price = priceField.parent().prev().data('price');
	var newPrice = Number(price) * priceField.val();
	priceField.parent().next().children('.sumPrice').html(newPrice);
	calculateTotalPrice()
}

function deleteProductFromCart(){
	$('.deleteProductFromCart').on('click', function(e){
		$(this).parent().parent().remove();
		calculateTotalPrice();
		e.preventDefault();
	});
}

function calculateTotalPrice(){
	var totalPrice = new Number;
	var price;
	$('.sumPrice').each(function(){
		price = $(this).html();
		price = parseInt(price);
		totalPrice += price;
	});
	$('#totalPrice').html(totalPrice + ' руб.');
};

function selectPunkt(punktInfo) { 
  var address = '';
  address += ("Город: " + punktInfo.city); 
  address += ("ID пункта выдачи: " + punktInfo.id); 
  address += ("Название (метро или адрес): " + punktInfo.name); 
  address += ("Адрес: " + punktInfo.address); 
  $('#selectedPunkt').val(address);
  $('#pickup').prop('checked', true);
  $('#fedex').prop('checked', false);
}  