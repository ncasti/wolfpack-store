<div id="shoppingCartPage" data-minimum="{{ settings.cart_minimum_value }}" class="container">
	<div itemscope itemtype="http://www.schema.org/WebPage" itemid="body">
		<ul class="breadcrumb-custom" itemprop="breadcrumb">
			<li>
				<a class="crumb" href="{{ store.url }}" title="{{ store.name }}">{{ "Inicio" | translate }}</a>
			</li>
			<li>
				<span class="separator">></span>
				<span class="crumb"><strong>{{ "Carrito de Compras" | translate }}</strong></span>
			</li>
		</ul>
	</div>
    <div class="row">
        <div class="col-md-12">
            <div class="section-title m-top text-center">
               <h1 class="title">{{ "Carrito de Compras" | translate }}</h1>
            </div>
        </div>
    </div>
	<div class="row">
		<div class="col-md-12">
			<form role="form" action="" method="post">
				{% if cart.items %}
				<div class="cart-detail">
					{% if error.add %}
						<p class="bg-info">{{ "No hay suficiente stock para agregar este producto al carrito." | translate }}</p>
					{% endif %}
					{% for error in error.update %}
						<p class="bg-info">{{ "No podemos ofrecerte {1} unidades de {2}. Solamente tenemos {3} unidades." | translate(error.requested, error.item.name, error.stock) }}</p>
					{% endfor %}
					<table cellpadding="0" cellspacing="0" class="cart-table">
						<thead class="cart-table-header">
							<tr>
								<th>&nbsp;</th>
								<th class="start">{{ "Producto" | translate }}</th>
								<th class="subtotal-price-header">{{ "Cantidad" | translate }}</th>
								<th class="unit-price-header">{{ "Precio" | translate }}</th>
								<th>{{ "Subtotal" | translate }}</th>
								<th class="last">{{ "Eliminar" | translate }}</th>
							</tr>
						</thead>
						<tbody>
							{% for item in cart.items %}
							<tr class="productrow even" data-item-id="{{ item.id }}" >
								<td class="name-mobile">
									<h2><a href="{{ item.url }}">{{ item.name }}</a></h2>
								</td>
								<td class="pic">
									<a class="thumb" href="{{ item.url }}">{{ item.featured_image | product_image_url("thumb") | img_tag(item.name) }}</a>
								</td>
								<td class="title">
									<h2><a class="name" href="{{ item.url }}">{{ item.name }}</a></h2>
								</td>
								<td class="col-quantity form-group">
									<div class="quantity-input">
										<input 	class="form-control text-center"
												type="text"
												name="quantity[{{ item.id }}]"
												value="{{ item.quantity }}"
												data-item-id="{{ item.id }}" onKeyUp="LS.resetItems();"/>
									</div>
									<div class="quantity-buttons">
		                                <button
		                                    type="button"
		                                    class="item-plus hidden-phone"
		                                    onclick="LS.plusQuantity({{ item.id }})">
		                                    <i class="fa fa-plus"></i></button>
		                                <button
		                                    type="button"
		                                    class="item-minus hidden-phone"
		                                    onclick="LS.minusQuantity({{ item.id }})">
		                                    <i class="fa fa-minus"></i></button>
		                            </div>
								</td>
								<td class="col-price unit-price">
									{{ item.unit_price | money }}
								</td>
								<td class="col-subtotal subtotal">
									<span data-item-variant="{{ item.product.selected_or_first_available_variant.id }}">
                           				 {{ item.subtotal | money }}</span>
								</td>
								<td class="col-delete remove">
									<button type="button" class="item-delete" onclick="LS.removeItem({{ item.id }})"><i class="fa fa-trash-o"></i></button>
								</td>
							</tr>
							{% endfor %}

							<tr id="error-ajax-stock" style="display: none;">
							    <td colspan="6" class='alert alert-warning alert-dismissible fade in' role='alert'>
							    <button type='button' class='close' onclick="jQuery(this).parent().parent().hide();">
							        <span aria-hidden='true'>×</span></button>
							    <strong>{{ 'Error' | translate }}</strong> {{ "No hay suficiente stock para agregar este producto al carrito." | translate }}
							    </td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="cart-detail-totals">
					<div class='row text-right'>
						<div class="col-md-6 col-sm-6 col-xs-12">
							{% if settings.shipping_calculator %}
								{% snipplet "shipping_cost_calculator.tpl" with shipping_calculator_show = settings.shipping_calculator_product_page and not product.free_shipping, shipping_calculator_variant = product.selected_or_first_available_variant %}
							{% endif %}
	                        {% if cart.items and settings.continue_buying %}
	                        {% set last_item_added = (cart.items | first) %}
	                            <a href="{{ last_item_added.product.category.url }}" class="m-top rowcart-general-button continue-buying pull-left"><i class="fa fa-chevron-left"></i> {{ 'Seguir comprando' | translate }}</a>
	                        {% endif %}
						</div>
						<div class="col-md-6 col-sm-6 col-xs-12">
							<div class="subtotal-price" data-priceraw="{{ cart.total }}">
				                {{ "Subtotal" | translate }}: {{ cart.total | money }}
				            </div>
				            <div class="total-price" data-priceraw="{{ cart.total }}">
				                {{ "Total" | translate }}: {{ cart.total | money }}
				            </div>
							<div class="row go-to-checkout text-right">
								{% set cart_total = (settings.cart_minimum_value * 100) %}
		                		{% if cart.total >= cart_total %}
									<input id="go-to-checkout" class="big-button cart-button m-top" type="submit" name="go_to_checkout" value="{{ 'Iniciar Compra' | translate }}" autocomplete="off"/>
								{% else %}
								 	<h3 class="lessthan pull-right">{{ "El monto mínimo de compra (subtotal) es de" | translate }} <strong>{{ cart_total | money }}</strong></h3>
		               		 	{% endif %}
							</div>
						</div>
					</div>



				</div>
				{% else %}
				<div class="cart-detail text-center m-top m-bottom alert alert-warning">
					{% if error %}
						{{ "No hay suficiente stock para agregar este producto al carrito." | translate }}
					{% else %}
						{{ "El carrito de compras está vacío." | translate }}
					{% endif %}
					{{ ("Seguir comprando" | translate ~ " »") | a_tag(store.products_url) }}
				</div>
				{% endif %}
				<hr/>
			</form>
		</div>
	</div>

	<div id="store-curr" class="hidden">{{ store.currency }}</div>

</div>
