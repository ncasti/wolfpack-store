{% if products and pages.is_last %}
	<div class="last-page" style="display:none;"></div>
{% endif %}
{% if settings.category_col %}
<div class="products-col">
	{% for product in products %}
		{% if loop.index % 3 == 1 %}
		<div class="row">
		{% endif %}
			{% include 'snipplets/single_product.tpl' %}
		{% if loop.index % 3 == 0 or loop.last %}
	    </div>
	    {% endif %}
	{% endfor %}
</div>
{% else %} 	
	{% for product in products %}
		{% if loop.index % 4 == 1 %}
		<div class="row">
		{% endif %}
			{% include 'snipplets/single_product.tpl' %}
		{% if loop.index % 4 == 0 or loop.last %}
	    </div>
	    {% endif %}
	{% endfor %}
{% endif %}
	