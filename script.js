$(document).ready( function() {
	var	productTable = $("#product-table tbody");
	var categories = [];
	var categoriesSelect = $("#categories-filter");

	$.getJSON("/products.json", function(products){
		$("#json").val(JSON.stringify(products));

		$.each(products.data, function(key, product){
			var tableRow = $("<tr/>").attr("data-category", product.category).attr("data-index", key).attr("data-price", product.price);
			tableRow.append("<td class='category'>" + product.category + "</td>");
			tableRow.append("<td class='image'><img src='" + product.imageUrl + "'></td>");
			tableRow.append("<td class='name'>" + product.name + "</td>");
			tableRow.append("<td class='desc'>" + product.description + "</td>");
			tableRow.append("<td class='price'>" + product.price + "</td>");
			tableRow.append("<td><a href='#' class='delete-row'>Delete</a></td>");
			productTable.append(tableRow);

			
			if($.inArray(product.category, categories) == -1){
				categories.push(product.category);
			}
		});

		for (var i = categories.length - 1; i >= 0; i--) {
			categories[i]
			categoriesSelect.append("<option value='" + categories[i] + "'>" + categories[i] + "</option>");
		};
	});

	categories_filter();

	function categories_filter() {
		categoriesSelect.change(function() {
			var currentCategory = $(this).val();
			if (currentCategory == '') {
				productTable.find("tr").css("display", "table-row");
			} else {
				productTable.find("tr").css("display", "none");
				productTable.find("tr[data-category='" + currentCategory + "']").css("display", "table-row");
			}
		});
	}

	$('#price-sorting').on('change', function() {
		var sorting_method = $(this).val();
		
		productTable.find('tr').sortElements(function(a, b){
			var ret = 1;
			var a_index = parseInt($(a).data('index'));
			var b_index = parseInt($(b).data('index'));
			var a_price = parseFloat($(a).data('price'));
			var b_price = parseFloat($(b).data('price'));

			switch(sorting_method){
				case 'default':
					if(a_index == b_index){
						ret = 0;
					} else {
						ret = a_index < b_index ? -1 : 1;
					}
					break;
				case 'asc':
					if(a_price == b_price){
						ret = 0;
					} else {
						ret = a_price < b_price ? -1 : 1;
					}
					break;
				case 'desc':
					if(a_price == b_price){
						ret = 0;
					} else {
						ret = a_price > b_price ? -1 : 1;
					}
					
					break;
			}
			
			return ret;
		}, function(){
			return this;
		});
	});

	$(document).on("click", ".delete-row", function(){
		var row = $(this).closest("tr").remove();
		var json = [];

		productTable.find("tr").each(function(key, el){
			var product = {
				category: $(this).find(".category").text(),
				imageUrl: $(this).find(".image img").attr("src"),
				name: $(this).find(".name").text(),
				description: $(this).find(".desc").text(),
				price: $(this).find(".price").text()
			};
			json.push(product);
		});

		$("#json").val(JSON.stringify(json));
	
	});

});