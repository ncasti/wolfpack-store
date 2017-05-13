{# Products that works as examples #}
<div class="banner">
    <!-- overlay text -->
    <div class="product-details-overlay overlay">
        <div class="row-fluid small-row">
            <div class="container center">
                <div class="span12">
                    <br/>
                    <h3>{{ "Este es un banner de ejemplo, luego podrás elegir tu propio banner" | translate }}</h3>
                </div>
            </div>
        </div>
    </div>
    {{ "images/banner-category.jpg" | static_url | img_tag }}
</div>
<div class="row-fluid">
    <div class="row-fluid" id="products-example">
        <div class="container">
            <div class="dest-list overlay">
                <h1>{{"Productos de ejemplo" | translate}}</h1>
                <div class="product-row">
                    <!-- overlay text -->
                    <div class="product-details-overlay overlay">
                        <div class="row big-row">
                            <div class="container center">
                                <div class="span12">
                                    <h3>{{ "Estos son productos de ejemplo." | translate }} </h3>
                                    <h1>{{ "Así es como puede quedar tu tienda una vez que cargues tus propios productos" | translate }}</h1>
                                    <a href="/admin/products/new/" class="top" target="_top">{{ "Cargar ahora mis productos" | translate }}</a>
                                    <a href="/product/example" class="top secondary" target="_top">{{ "Ver producto de ejemplo" | translate }}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- ENDs overlay text -->
                    <!-- Product 01 -->
                     <div class="container">
                        <div class="span3">
                        {% snipplet 'sort_by.tpl' %}
                        </div>
                    </div>
                    <div class="dest-gral">
                        <div class="head">
                            <div class="circle offer">
                                <p>{{ "Oferta" | translate }}</p>
                            </div>
                            <a href="{{ product.url }}" title="{{ product.name }}" class="product-image">
                                {{ "images/help-product-01.jpg" | static_url | img_tag }}
                            </a>
                            <div class="product-details-overlay"></div>
                        </div>
                        <div class="bajada">
                            <div class="category">
                                <a href="{{ product.category.url }}" title="{{ product.category.name }}">{{ "Camisas" | translate }}</a>
                            </div>
                            <div class="title">
                                <a href="{{ product.url }}" title="{{ product.name }}">{{ "Camisa azul" | translate }}</a>
                            </div>
                            <div class="price">
                                <span class="price" id="price_display" itemprop="price" content="72">{{"7200" | money }}</span>
								<span class="price-compare">
								<span id="compare_price_display" >{{"8000" | money }}</span>
								</span>
                            </div>
                        </div>
                    </div>
                    <!-- Product 02 -->
                    <div class="dest-gral">
                        <div class="head">
                            <div class="circle free-shipping shipping-top">
                                <p>{{ "Envío sin cargo" | translate }}</p>
                            </div>
                            <a href="{{ product.url }}" title="{{ product.name }}" class="product-image">
                                {{ "images/help-product-00.jpg" | static_url | img_tag }}
                            </a>
                        </div>
                        <div class="bajada">
                            <div class="category">
                                <a href="{{ product.category.url }}" title="{{ product.category.name }}">{{ "CARTERAS" | translate }}</a>
                            </div>
                            <div class="title">
                                <a href="{{ product.url }}" title="{{ product.name }}">{{ "Cartera negra" | translate }}</a>
                            </div>
                            <div class="price">
                                <span class="price" id="price_display" itemprop="price" content="442">{{"44200" | money }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- Product 03 -->
                    <div class="dest-gral">
                        <div class="head">
                            <a href="{{ product.url }}" title="{{ product.name }}" class="product-image">
                                {{ "images/help-product-02.jpg" | static_url | img_tag }}
                            </a>
                            <div class="product-details-overlay"></div>
                        </div>
                        <div class="bajada">
                            <div class="category">
                                <a href="{{ product.category.url }}" title="{{ product.category.name }}">{{ "Jeans" | translate }}</a>
                            </div>
                            <div class="title">
                                <a href="{{ product.url }}" title="{{ product.name }}">{{ "Jean azul" | translate }}</a>
                            </div>
                            <div class="price">
                                <span class="price" id="price_display" itemprop="price" content="102">{{"10200" | money }}</span>
								<span class="price-compare">
								<span id="compare_price_display" >{{"13200" | money }}</span>
								</span>
                            </div>
                        </div>
                    </div>
                    <!-- Product 04 -->
                    <div class="dest-gral">
                        <div class="head">
                            <div class="circle out-of-stock">
                                <p>{{ "Sin stock" | translate }}</p>
                            </div>
                            <a href="{{ product.url }}" title="{{ product.name }}" class="product-image out-stock-img">
                                {{ "images/help-product-03.jpg" | static_url | img_tag }}
                            </a>
                        </div>
                        <div class="bajada">
                            <div class="category">
                                <a href="{{ product.category.url }}" title="{{ product.category.name }}">{{ "Carteras" | translate }}</a>
                            </div>
                            <div class="title">
                                <a href="{{ product.url }}" title="{{ product.name }}">{{ "Cartera negra" | translate }}</a>
                            </div>
                            <div class="price">
                                <span class="price" id="price_display" itemprop="price" content="442">{{"44200" | money }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="product-row">
                    <!-- Product 05 -->
                    <div class="dest-gral">
                        <div class="head">
                            <a href="{{ product.url }}" title="{{ product.name }}" class="product-image">
                                {{ "images/help-product-04.jpg" | static_url | img_tag }}
                            </a>
                            <div class="product-details-overlay"></div>
                        </div>
                        <div class="bajada">
                            <div class="category">
                                <a href="{{ product.category.url }}" title="{{ product.category.name }}">{{ "Zapatos" | translate }}</a>
                            </div>
                            <div class="title">
                                <a href="{{ product.url }}" title="{{ product.name }}">{{ "Zapato blanco" | translate }}</a>
                            </div>
                            <div class="price">
                                <span class="price" id="price_display" itemprop="price" content="112">{{"11200" | money }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Product 07 -->
                            <div class="dest-gral">
                                <div class="head">
                                        <a href="#">
                                           {{ "images/help-product-007.jpg" | static_url | img_tag }}
                                        </a>
                                    <div class="product-details-overlay"></div>
                                </div>
                                <div class="bajada">
                                    <div class="category">
                                        <a href="{{ product.category.url }}" title="{{ product.category.name }}">{{ "Camisas" | translate }}</a>
                                    </div>
                                    <div class="title">
                                        <a href="{{ product.url }}" title="{{ product.name }}">{{ "Chomba" | translate }}</a>
                                    </div>
                                    <div class="price">
                                        <span class="price" id="price_display" itemprop="price" content="132">{{"13200" | money }}</span>

                                    </div>
                                </div>
                            </div>
                </div>
            </div>
        </div>
    </div>
</div>