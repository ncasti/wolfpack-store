{% paginate by 12 %}
<div class="container">
	<div itemscope itemtype="http://www.schema.org/WebPage" itemid="body">
		<ul class="breadcrumb-custom" itemprop="breadcrumb">
			<li>
				<a class="crumb" href="{{ store.url }}" title="{{ store.name }}">{{ "Inicio" | translate }}</a>
			</li>
			<li>
				<span class="separator">></span>
				<span class="crumb"><strong>{{ "Resultados de búsqueda" | translate }}</strong></span>
			</li>
		</ul>
	</div>	
	<div class="row">
        <div class="col-md-12">
            <div class="section-title m-top text-center">
               <h1 class="title">{{ "Resultados de búsqueda" | translate }}</h1>
            </div>
        </div>
    </div>
	<div class="row">
		<!-- Si está seleccionada la opición de columna con categorías -->
	{% if products %}
		{% if settings.category_col %}
		<div class="col-sm-3">
			<div class="category-col">
				<div class="category-list">
					<h2>{{"Categorías" | translate}}</h2>
					<ul>
						{% for category in categories %}
						<li class="category-title {{ category.active ? 'selected' : '' }}"><a href="{{ category.url }}">{{ category.name }}</a></li>
							{% if category.subcategories %}
							<ul> {% for subcategory in category.subcategories %}
								<li class="subcategory-title {{ subcategory.active ? 'selected' : '' }}"><a href="{{ subcategory.url }}">{{ subcategory.name }}</a></li>
							{% endfor %}
							</ul>
							{% endif %}
						{% endfor %}
					</ul>
				</div>
			</div>
			<!-- Columna responsiva desplegable -->
			<div class="category-col accordion clearfix">
				<div class="category-list">
					<a data-toggle="collapse" data-parent="#accordion" href="#collapseContent" class="collapse-button">
						<h2>{{"Categorías" | translate}}</h2>
						<i class="fa fa-angle-down"></i>
					</a>
					<ul id="collapseContent" class="collapse">
						{% for category in categories %}
						<li class="category-title {{ category.active ? 'selected' : '' }}"><a href="{{ category.url }}">{{ category.name }}</a></li>
							{% if category.subcategories %}
							<ul> {% for subcategory in category.subcategories %}
								<li class="subcategory-title {{ subcategory.active ? 'selected' : '' }}"><a href="{{ subcategory.url }}">{{ subcategory.name }}</a></li>
							{% endfor %}
							</ul>
							{% endif %}
						{% endfor %}
					</ul>
				</div>
			</div>
		</div>
		{% endif %}

		{% if settings.category_col %}
		<div class="col-sm-9">
		{% else %}
		<div class="col-sm-12">
		{% endif %}

		
			<section id="grid" class="product-grid grid">
				{% snipplet "product_grid.tpl" %}
			</section>
		</div>
		<div class="crumbPaginationContainer bottom col-sm-12">
			<div class="pagination-container">
				{% snipplet "pagination.tpl" %}
				<hr class="line" />
			</div>
		</div>
	{% else %}
		<div class="col-sm-12 text-center">
	    	<i class="text-404 fa fa-frown-o"></i>
	        <p>{{ "No hubo resultados para tu búsqueda." | translate }}</p>
	    </div>
    	<div class="col-sm-12 text-center">
    		<p>{{ "A continuación te sugerimos algunos productos que podrían interesarte:" | translate }}</p>
    	</div>
    	
    	{% set related_products = sections.primary.products | take(4) | shuffle %}
		{% if related_products | length > 1 %}
		<div class="col-md-12">
			<div class="section-title">
				<h2 class="title">{{"Productos recomendados" | translate}}</h2>
				<hr class="line" />			
			</div>
		</div>
		<div class="col-md-12">
			<section id="grid" class="grid">
				<div class="row">
				{% for related in related_products %}
					{% include 'snipplets/single_product.tpl' with {product : related} %}
				{% endfor %}
				</div>
			</section>
		</div>
		{% endif %}	
	{% endif %}
	</div>
</div>