<li class="col-der-top {{ item.current ? 'selected' : '' }}">
	{% if cart.items_count > 0 %}
	<a class="cart-summary" href="{{ store.cart_url }}">
		{% set total_comprado = 0 %}
		{% for compra in cart.items %}
			{% set total_comprado = compra.quantity + total_comprado %}
		{% endfor %}
		<span class="cart-circle">{{ "{1}" | translate(total_comprado ) }}</span>
		<span class="cart-total hidden-xs">{{ "Carrito" | translate }}</span>
		 	<strong>{{ cart.total | money }}</strong>
	</a>
	{% else %}
	<a class="cart-summary empty pull-right m-right-half" href="{{ store.cart_url }}">
		<span class="cart-circle">0</span>
		<span class="cart-total hidden-xs">{{ "Carrito" | translate }} </span>
	</a>
	{% endif %}
</li>
