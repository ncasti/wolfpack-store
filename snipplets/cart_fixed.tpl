<li class="{{ item.current ? 'selected' : '' }}">
	<a class="cart-summary" href="{{ store.cart_url }}">
		{% set total_comprado = 0 %}
		{% for compra in cart.items %}
			{% set total_comprado = compra.quantity + total_comprado %}
		{% endfor %}
		<i class="fa fa-shopping-cart"></i>
		<p class="cart-circle">{{ "{1}" | translate(total_comprado ) }}</p>
	</a>
</li>