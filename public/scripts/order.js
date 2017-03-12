$(document).ready(function(){
	getOrders();
	orderArchive();
	orderDeleted();
	backToOrders();
});

function getOrders(){
	$.ajax({
		url: '/admin/getorders',
		dataType: 'html',
		success: function(data) {
			$('#orderList').empty();
			$('#orderList').append(data);
			showInfo();
			orderToWork();
			doneOrder();
			deleteOrder();
		}
	});
}

function showInfo(){
	$('.showInfo').on('click', function(){
		$(this).parent().next().toggleClass('hidden');
		return false;
	});
}

function orderToWork() {
	$('.markSeenOrder').on('click', function(){
		var orderId = $(this).data('id');
		var query = '/admin/ordertowork?order=' + orderId;
		$.ajax({
				url: query,
				type: 'post',
				dataType: 'html', 
				success: function(){
					getOrders();
				}
			});
		return false;	
	});
}

function doneOrder(){
	$('.markDoneOrder').on('click', function(){
		var answer = confirm('Заказ отработан?');
		if (answer) {
			var orderId = $(this).data('id');
			var query='/admin/markdoneorder?order=' + orderId;
			$.ajax({
					url: query,
					type: 'post',
					dataType: 'html',
					success: function(){
						getOrders();
					}
			});
		}
		return false;
	});
}

function deleteOrder(){
	$('.deleteOrder').on('click', function(){
		var answer = confirm('Уверен?');
		if (answer) {
			var answer2 = confirm(' Точно уверен?');
			if (answer2) {
			var orderId = $(this).data('id');
			var query='/admin/deleteorder?order=' + orderId;
			$.ajax({
					url: query,
					type: 'delete',
					dataType: 'html',
					success: function(){
						if($('#orderArchive').hasClass('hidden')) /*made this to return to the exact page user was (actual orders or archive)*/
							$.ajax({
								url: '/admin/getorderarchive',
								dataType: 'html',
								success: function(data) {
										$('#orderList').empty();
										$('#orderList').append(data);
										showInfo();
										deleteOrder();
								}
							});
						else getOrders();
					}
			});
			}
		}
		return false;
	});
}

function orderArchive(){
	$('#orderArchive').on('click', function(){
		$(this).toggleClass('hidden');
		$('#orderDeleted').addClass('hidden');
		$('#backToOrders').toggleClass('hidden');
		$.ajax({
			url: '/admin/getorderarchive',
			dataType: 'html',
			success: function(data) {
				$('#orderList').empty();
				$('#orderList').append(data);
				showInfo();
				deleteOrder();
			}
		});
		return false;
	});
}

function orderDeleted(){
	$('#orderDeleted').on('click', function(){
		$(this).addClass('hidden');
		$('#orderArchive').addClass('hidden');
		$('#backToOrders').removeClass('hidden');
		$.ajax({
			url: '/admin/getorderdeleted',
			dataType: 'html',
			success: function(data) {
				$('#orderList').empty();
				$('#orderList').append(data);
				showInfo();
			}
		});
		return false;
	});
}

function backToOrders(){
	$('#backToOrders').on('click', function(){
		$(this).addClass('hidden');
		$('#orderArchive').removeClass('hidden');
		$('#orderDeleted').removeClass('hidden');
		getOrders();
		return false;
	});
}