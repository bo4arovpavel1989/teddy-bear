$(document).ready(function(){
	deleteProductFromCart();
	calculateTotalPrice();
	cartSubmit();
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


function recalculatePrice(priceField) {
	var price = priceField.parent().prev().data('price');
	var newPrice = Number(price) * priceField.val();
	newPrice = Math.floor(newPrice);
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
  address += ("\r\nID пункта выдачи: " + punktInfo.id); 
  address += ("\r\nНазвание (метро или адрес): " + punktInfo.name); 
  address += ("\r\nАдрес: " + punktInfo.address); 
  $('#selectedPunkt').val(address);
  $('#selectedPunkt').show(400);
  $('#pickup').prop('checked', true);
  $('#fedex').prop('checked', false);
} 

function cartSubmit() {
	$('#cartForm').on('submit', function(e){
		e.preventDefault();
		var data = {
			product: [],
			info: {}
		};
		var productCount = 0;
		$('.productItem').each(function(){
			data.product.push({_id: $(this).data('id'), name:  $(this).find('a').html(), howMany: $(this).next().find('.productHowMany').val()});
			productCount++;
		});
		data.fedex = $('input[name="fedex"]:checked').val();
		if (data.fedex === "pickup") data.outpost = $('#selectedPunkt').val();
		data.productCount = productCount;
		data.name = $('#customerName').val(), 
		data.email = $('#customerEmail').val(),
		data.phone = $('#customerPhone').val(),
		data.address = $('#customerAddress').val(),
		data.comment = $('#customerComment').val(),
		
		$.ajax({
        type: "POST",
        url: "/makeorder",
        data: data,
        contentType: "application/x-www-form-urlencoded",
        success: function(){
			alert("Заказ принят в работу!");
			deleteCookie('cart');
			location.assign('/');
		}
  });
		console.log(data);
	});
}

	