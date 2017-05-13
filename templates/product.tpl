<div class="container js-product-container">
	{% snipplet "breadcrumbs.tpl" %}
	<div id="single-product" class="row" data-variants="{{product.variants_object | json_encode }}" itemscope itemtype="http://schema.org/Product">
       <div class="mobile-bxslider">
            {% if product.images_count > 1 %}
                <ul class="bxslider" id="productbxslider">
                    {% for image in product.images %}
                      <li class="product-slider" data-image="{{image.id}}" data-image-position="{{loop.index0}}">{{ image | product_image_url('big') | img_tag(image.alt) }}</li>
                    {% endfor %}
                </ul>
            {% else %}
                {{ product.featured_image | product_image_url('large') | img_tag(product.featured_image.alt) }}
            {% endif %}
        </div>
		<div class="col-md-6 col-sm-12 col-xs-12 product-photos desktop-featured-product">
			<div class="row">
				<div class="current-photo no-gutter">
					<div class="current-photo-container">
					{% for image in product.images %}
							<a href="{{ image | product_image_url('original') }}" id="zoom" class="cloud-zoom" rel="position: 'inside', showTitle: false, loading: '{{ 'Cargando...' | translate }}'">
								<div id="{{image.id}}">
								{{ image | product_image_url('large') | img_tag(product.featured_image.alt) }}
							</div>
							</a>
					{% endfor %}
					</div>
				</div>
			</div>
		</div>
		<div class="col-md-6 col-sm-12 col-xs-12">
			<div id="description">

				<div itemprop="offers" itemscope itemtype="http://schema.org/Offer">
					<div class="price-container">
						<p class="big-price js-price-display" id="price_display" itemprop="price"{% if product.display_price %} content="{{ product.price / 100 }}"{% endif %} {% if not product.display_price %}style="display:none;"{% endif %}><strong>{% if product.display_price %}{{ product.price | money }}{% endif %}</strong></p>
						<p id="compare_price_display" class="big-old-price js-compare-price-display" {% if not product.compare_at_price or not product.display_price %}style="display:none;"{% endif %}>{% if product.compare_at_price and product.display_price %}{{ product.compare_at_price | money }}{% endif %}</p>

						<meta itemprop="priceCurrency" content="{{ product.currency }}" />
						{% if product.stock_control %}
	                        <meta itemprop="inventoryLevel" content="{{ product.stock }}" />
	                        <meta itemprop="availability" href="http://schema.org/{{ product.stock ? 'InStock' : 'OutOfStock' }}" content="{{ product.stock ? 'In stock' : 'Out of stock' }}" />
	                    {% endif %}
					</div>
					{% if product.show_installments and product.display_price %}
                		<div class="js-mobile-toggle-installments {% if store.installments_on_steroids_enabled %}js-open-installments-modal-mobile{% endif %} product-detail_installments-module p-top-xs p-bottom-xs p-relative pull-left full-width clear-both m-half-top m-top-xs m-bottom-xs">
			            {% snipplet "installments_in_product.tpl" %}
			            {% if product.show_installments and product.display_price %}
			                {% set installments_info_base_variant = product.installments_info %}
	                        {% set installments_info = product.installments_info_from_any_variant %}
			                {% if installments_info %}				       
				                <div class="row-fluid">
				                    <a id="button-installments" class="{% if store.installments_on_steroids_enabled %}js-open-installments-modal-desktop{% endif %} m-quarter-bottom m-quarter-top" href="#InstallmentsModal" role="button" data-toggle="modal" {% if (not product.get_max_installments) and (not product.get_max_installments(false)) %}style="display: none;"{% endif %}>
				                    	{% if store.installments_on_steroids_enabled %}
	                                        {{ "Ver medios de pago y financiación" | translate }}
	                                    {% else %}
	                                        {{ "Ver el detalle de las cuotas" | translate }}
	                                    {% endif %}
				                    </a>
				                    <i class="fa fa-angle-right visible-xs product-detail_installments-arrow"></i>
				                </div>
				                <div class="p-relative d-inline-block clear-both js-installemnts-selected-gw-container p-double-right-xs" style="display:none;">
	                                <span class="font-bold">{{'Medio de pago elegido:' | translate }}</span>
	                                <span class="js-installemnts-selected-gw installments_selected-gw font-bold text-capitalize"></span>
	                                <span class="installments_check-icon installments_check-icon-gw fa-stack d-inline-block p-relative">
		                                  <i class="fa fa-circle fa-stack-2x"></i>
		                                  <i class="fa fa-check fa-stack-1x fa-inverse"></i>
	                                </span>
	                            </div>
			                {% endif %}
			            {% endif %}
			        	</div>
		           	{% endif %} 
				</div>
				<h1 class="product-title clear-both full-width pull-left" itemprop="name">{{ product.name }}</h1>
                <div class="product-boxes row clear-both">
                    <div class="col-md-4 col-sm-4 col-xs-4 js-offer-label offer" {% if not product.compare_at_price %}style="display:none;"{% endif %}><p>{{ settings.offer_text }}</p></div>
                    <div class="col-md-4 col-sm-4 col-xs-4 product-related-button js-stock-label" {% if product.has_stock %}style="display:none;"{% endif %}><p>{{ settings.no_stock_text }}</p></div>
                    {% if product.free_shipping %}
                        <div class="col-md-4 col-sm-4 col-xs-4 free-shipping"><p>{{ settings.free_shipping_text }}</p></div>
                    {% endif %}
                </div>
	            {% if not settings.show_description_bottom %}
                	<div class="description user-content">
	                    {{ product.description }}
                	</div>
	            {% endif %}


				<meta itemprop="image" content="{{ 'http:' ~ product.featured_image | product_image_url('medium') }}" />
	            <meta itemprop="url" content="{{ product.social_url }}" />
	            {% if page_description %}
	                <meta itemprop="description" content="{{ page_description }}" />
	            {% endif %}
	            {% if product.sku %}
	                <meta itemprop="sku" content="{{ product.sku }}" />
	            {% endif %}
	            {% if product.weight %}
	                <div itemprop="weight" itemscope itemtype="http://schema.org/QuantitativeValue" style="display:none;">
	                    <meta itemprop="unitCode" content="{{ product.weight_unit | iso_to_uncefact}}" />
	                    <meta itemprop="value" content="{{ product.weight}}" />
	                </div>
	            {% endif %}
            <div class="row-fluid clearfix">
				<form id="product_form" method="post" action="{{ store.cart_url }}">
					<input type="hidden" name="add_to_cart" value="{{product.id}}" />
					{% if product.variations %}
						<div class="variant-container m-none-top-xs p-bottom-xs">
							{% for variation in product.variations %}
								<div class="variant">
									<label class="variation-label" for="variation_{{loop.index}}"><h3>{{variation.name}}:</h3></label>
									<div class="custom-select">
										{% if variation.options | length > 1 %}
											<select class="js-variation-option form-control on-steroids" id="variation_{{loop.index}}" name="variation[{{ variation.id }}]" onchange="LS.changeVariant(changeVariant, '#single-product')">
												{% for option in variation.options %}
													<option value="{{ option.id }}" {% if product.default_options[variation.id] == option.id %}selected="selected"{% endif %}>{{ option.name }}</option>
												{% endfor %}
											</select>
										{% else %}
											<p>{{ variation.options[0].name }}</p>
											<input type="hidden" name="variation[{{ variation.id }}]" value="{{variation.options[0].id}}">
										{% endif %}
									</div>
								</div>
							{% endfor %}
						</div>
					{% endif %}
					{% set state = store.is_catalog ? 'catalog' : (product.available ? product.display_price ? 'cart' : 'contact' : 'nostock') %}
	                {% set texts = {'cart': "Agregar al carrito", 'contact': "Consultar precio", 'catalog': "Consultar", 'nostock' : settings.no_stock_text} %}
	                <input type="submit" class="js-prod-submit-form addToCart big-button big-product-related-button {{ state }}" value="{{ texts[state] | translate }}" {% if state == 'nostock' %}disabled{% endif %} />
				</form>
			</div>
			<div class="m-top">
				{% if settings.shipping_calculator %}
					 {% snipplet "shipping_cost_calculator.tpl" with shipping_calculator_show = settings.shipping_calculator_product_page and not product.free_shipping, shipping_calculator_variant = product.selected_or_first_available_variant %}
				{% endif %}
			</div>



				<div class="shareLinks clearfix">
					<div class="shareLinksContainer">
						<div class="shareItem facebook product-share-button" data-network="facebook">
							{{product.social_url | fb_like('store-product', 'button_count')}}
						</div>
						<div class="rest-of-social">
							<div class="shareItem twitter product-share-button" data-network="twitter">
								{{product.social_url | tw_share('none', 'Tweet', store.twitter_user, current_language.lang) }}
							</div>
							<div class="shareItem google product-share-button" data-network="gplus">
								{{product.social_url | g_plus('medium') }}
							</div>
							<div class="shareItem pinterest product-share-button" data-network="pinterest">
								{{product.social_url | pin_it('http:' ~ product.featured_image | product_image_url('original'))}}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row-fluid clearfix clear-both">
		{% if settings.show_description_bottom %}
			<div class="description user-content">
				{{ product.description }}
			</div>
		{% endif %}
	 	{% if settings.show_product_fb_comment_box %}
			<div class="comments-area">
				<div class="fb-comments" data-href="{{ product.social_url }}" data-num-posts="5" data-width="100%"></div>
			</div>
        {% endif %}
	</div>

    <div id="related-products" class="row-fluid clearfix">
        {% set related_products_ids = product.metafields.related_products.related_products_ids %}
        {% if related_products_ids %}
            {% set related_products = related_products_ids | get_products %}
            {% set show = (related_products | length > 0) %}
        {% endif %}
        {% if not show %}
            {% set related_products = category.products | shuffle | take(4) %}
            {% set show = (related_products | length > 1) %}
        {% endif %}
        {% if show %}
            <div class="row">
                <div class="col-md-12">
                    <div class="section-title">
                        <h2 class="title">{{"Productos relacionados" | translate}}</h2>
                        <hr class="line" />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <section id="grid" class="clearfix product-grid grid">
                        <div class="row">
                        {% for related in related_products %}
                            {% if product.id != related.id %}
                                {% include 'snipplets/single_product.tpl' with {product : related} %}
                            {% endif %}
                        {% endfor %}
                        </div>
                    </section>
                </div>
            </div>
        {% endif %}
    </div>
</div>
{% if installments_info %}
{% set gateways = installments_info | length %}
	<div id="InstallmentsModal" class="installments_modal modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog modal-lg">
			<div class="modal-content pull-left full-width">
			    <div class="modal-body installments_modal-body">
			        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			        {% include 'snipplets/installments-details.tpl' %}
			    </div>
			</div>
		</div>
	</div>
	<div class="js-mobile-installments-panel mobile-right-panel animation-panel-right-close visible-xs p-none-bottom">
	    <a class="js-mobile-toggle-installments mobile-right-panel_header mobile-right-panel_header-dark" href="#">
	        <i class="fa fa-arrow-left mobile-right-panel_arrow-left"></i>
	        <span class="mobile-right-panel_header-text">
	            {% if store.installments_on_steroids_enabled %}
	                {{ 'Medios de pago y financiación' | translate }}
	            {% else %}
	                {{ 'Detalles de las cuotas' | translate }}
	            {% endif %}
	        </span>
	    </a>
	    <div class="js-mobile-installments-body p-left p-right p-half-left-xs p-half-right-xs">
	        {# Content inserted vía JS #}
	    </div>
	</div>
{% endif %}
