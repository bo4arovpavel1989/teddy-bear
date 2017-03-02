var searchAvailable = true;

$(document).ready(function(){
	getCallbackForm();
	menuSticky();
	searchProductRealtime();
	searchProductSubmit();
	categoryChoose();
	addToCart();
	checkCart();
});

function checkCart() {
	var cartArray = getCookie('cart');
	if (cartArray !== undefined) {
		cartArray = cartArray.split(', ');
		var quantity = cartArray.length;
		switch(quantity) {
			case 1: 
				$('.productQuantity').html('В корзине - <b class="active">1</b> товар');
				break;
			case 2:
			case 3:
			case 4:
				$('.productQuantity').html('В корзине - <b class="active">' + quantity + '</b> товара');
				break;
			default:
				$('.productQuantity').html('В корзине - <b class="active">' + quantity + '</b> товаров');
		}
	}
}

function getCallbackForm() {
	$('.orderCallback').on('click', function(){
		$.ajax({
			url: '/getcallbackform',
			dataType: 'html',
			success: function(html) {
				$('.orderCallbackBanner').hide();
				$('.callback').hide();
				$('.callback').append(html);
				$('.callback').show(400);
				hideCallbackForm();
			}
		});
	});
}

function hideCallbackForm() {
	$(document).on('click', function(e) {
		if (!$(e.target).closest("#callbackForm").length) {
			$('#callbackForm').remove();
			$('.orderCallbackBanner').show(400);
		}
		e.stopPropagation();
	});
}

function menuSticky() {
	var closeWindowPositionY = document.querySelector('.navbar').offsetTop;
	$(window).scroll(function(){										
		if(window.scrollY > closeWindowPositionY) {
			document.querySelector('.navbar').classList.add('stickyMenu', 'container');
			document.querySelector('.banners').classList.add('rowBannersSticky');
		}	else {
			document.querySelector('.navbar').classList.remove('stickyMenu', 'container');
			document.querySelector('.banners').classList.remove('rowBannersSticky');
		}																			
	});
}


function searchProductSubmit() {
	$('.searchSubmit').on('click', function(){
		searchSuggestion();
	});
}

function searchProductRealtime() {
	$('.searchProduct').on('keyup', function(err, rep){
		if (searchAvailable) {
			searchAvailable = false;
			searchSuggestion();
			setTimeout(function(){searchAvailable = true}, 1000);
		}
	});
}


function searchSuggestion() {
	var productToFind = $('.searchProduct').val();
	if (productToFind !== '') {
		var query = '/searchproduct?product=' + productToFind;
		$.ajax({
			url: query,
			dataType: 'html',
			success: function(html){
				$('#searchResult').empty();
				$('#searchResult').addClass('active');
				$('#searchResult').append(html);
				clickSearchResutItem();
				hideSuggestion();
			}
		});
	}
}

function clickSearchResutItem(){
	$('.searchResultItem').on('click', function(){
		var address = $(this).data('address');
		location.assign(address);
	});
}

function hideSuggestion() {
	$(document).on('click', function(e) {
		if($('#searchResult').hasClass('active')) {
			if (!$(e.target).closest("#searchArea").length) {
				$('#searchResult').removeClass('active');
			}
			e.stopPropagation();
		}
	});
}

function categoryChoose() {
	$('.categoryChoose').on('click', function(e){
		$(this).next().toggle(400);
		$(this).parent().toggleClass('active');
		$(this).toggleClass('active');
		e.preventDefault();
	});
}

function addToCart(){
	$('.btn-toCartButton').on('click', function(){
		var productId = $(this).data('id');
		setCookie('cart', productId, {expires: 3600 * 24});
		checkCart();
	});
}

function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  if(getCookie(name)) value = getCookie(name) + ', ' + value;
  
  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }
  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, "", {
    expires: -1
  })
}