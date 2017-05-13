{% set show_sidebar = settings.product_filters %}
{% paginate by 12 %}

{% if "banner-products.jpg" | has_custom_image %}
<div class="banner">
	<div class="banner-shadow"></div>
	{% if settings.banner_products_url != '' %}
		{{ "banner-products.jpg" | static_url | img_tag(store.name) | a_tag(settings.banner_products_url) }}
	{% else %}
		{{ "banner-products.jpg" | static_url | img_tag(store.name) }}
	{% endif %}
</div>
{% endif %}
<div class="container">
	<div class="row-fluid clearfix">
		{% if settings.banner_services_category %}
		 	{% include 'snipplets/banner-services.tpl' %}
	 	{% endif %}
		{% snipplet "breadcrumbs.tpl" %}
		<div class="row">
			<div class="col-md-12">
				<div class="section-title">
					<h1 class="title">{{ category.name }}</h1>
				</div>
			</div>
		</div>
		<div class="row-fluid clearfix m-bottom">
			{% if show_sidebar %}
				{% set default_lang = current_language.lang %}
				{% set filter_colors = insta_colors|length > 0 %}
				{% set filter_more_colors = other_colors|length > 0 %}
				{% set filter_sizes = size_properties_values|length > 0 %}
				{% set filter_other = variants_properties|length > 0 %}
					{% if filter_colors or filter_more_colors or filter_sizes or filter_others %}
					<div class="col-md-3 col-sm-4">
							<a id="show-filters" class="mobile-dropdown">{{ 'Filtrar por' | translate }}   <i class="fa fa-chevron-down"></i></a>
					</div>
					{% endif %}
    		{% endif %}
			<div class="col-md-5 hidden-xs">
				{% snipplet 'sort_by.tpl' %}
			</div>
		</div>
		<div class="row-fluid clearfix">
			{% snipplet "filters.tpl" %}
			<div id="categories-column">
				<div class="get-filters col-md-12" style="display: none;">
					<h4>Filtrado por:</h4>
				</div>
				<script>LS.showWhiteListedFilters("{{ filters|json_encode() }}");</script>
			</div>
		</div>
		<hr/>
      	<div class="row-fluid clearfix">
			{% if products %}
				<div class="row-fluid clearfix">
					<section id="grid" class="product-grid grid m-top">
						{% snipplet "product_grid.tpl" %}
					</section>
				</div>
				{% if settings.infinite_scrolling and not pages.is_last %}
					<div class="loadMoreContainer"><a id="loadMoreBtn" class="button secondary loadMoreBtn"><i class="fa fa-circle-o-notch fa-spin loadingSpin"></i>{{ 'Mostrar más productos' | t }}</a></div>
				{% else %}
				<div class="crumbPaginationContainer bottom col-sm-12">
					<div class="pagination-container">
						{% snipplet "pagination.tpl" %}
						<hr class="line" />
					</div>
				</div>
				{% endif %}
			{% else %}
			    <div class="col-sm-12 text-center">
			    	<i class="text-404 fa fa-frown-o small-404"></i>
                    {% if has_filters %}
			            <p>{{"No tenemos productos en esas variantes. Por favor, intentá con otros filtros." | translate}}</p>
                    {% else %}
                        <p>{{"No se encontraron productos en esta categoría" | translate}}</p>
                    {% endif %}
			    </div>
			{% endif %}
		</div>
    </div>
</div>
