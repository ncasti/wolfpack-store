<div class="dest-sec {% if product.images[0].id == 0 %}no-image{% endif %}">
    <div class="head">
        <a href="{{ product.url }}" title="{{ product.name }}" class="product-image">{{ product.featured_image | product_image_url("thumb") | img_tag(product.featured_image.alt) }}</a>
    </div>
    <div class="bajada">
        {% if product.category.id != 0 %}
        <div class="category">
        	{{ product.category.name }}
        </div>
        {% endif %}
        <div class="title">
        	<a href="{{ product.url }}" title="{{ product.name }}">{{ product.name }}</a>
        </div>
        <div class="price {% if not product.display_price%}hidden{% endif %}">
            <span class="price" id="price_display" itemprop="price" content="{{ product.price / 100 }}" {% if not product.display_price %}class="hidden"{% endif %}>{% if product.display_price %}{{ product.price | money }}{% endif %}</span>
			<span class="price-compare">
                <span id="compare_price_display" {% if not product.compare_at_price %}class="hidden"{% endif %}>{% if product.compare_at_price %}{{ product.compare_at_price | money }}{% endif %}</span>
            </span>
        </div>
    </div>
</div>

