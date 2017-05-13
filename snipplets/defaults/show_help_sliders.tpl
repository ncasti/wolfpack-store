{# Only remove this if you want to take away the theme onboarding advices #}
{% set help_url = has_products ? '/admin/products/feature/' : '/admin/products/new/' %}
{# Products that works as example #}
<div class="row-fluid">
    <div class="container">
        <div class="span4">
            <div class="dest-list line-sec">
                <h1>{{"Productos recientes" | translate}}</h1>
                <div id="tS3-recent" class="jThumbnailScroller hidden-phone">
                    <div class="jTscrollerContainer">
                        <!-- overlay text -->
                        <div class="product-details-overlay overlay" id="small-overlay">
                            <div class="row-fluid big-row">
                                <div class="center">
                                    <div class="span12">
                                        <h3>{{ "Estos son productos de ejemplo." | translate }} </h3>
                                        <h1>{{ "Así es como puede quedar tu tienda una vez que cargues tus propios productos" | translate }}</h1>
                                        <a href="{{ help_url }}" class="top" target="_top">{{ "Cargar ahora mis productos" | translate }}</a>
                                        <a href="/product/example" class="top secondary">{{ "Ver producto de ejemplo" | translate }}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- ENDs overlay text -->
                        <div class="jTscroller">
                             <div class="dest-sec show_help">
                                <div class="head">
                                        <a href="#" class="product-image">
                                           {{ "images/help-product-04.jpg" | static_url | img_tag }}
                                        </a>
                                </div>
                                <div class="bajada">
                                    <div class="category">
                                        <a href="#">{{ "Zapatos" | translate }}</a>
                                    </div>
                                    <div class="title">
                                        <a href="/product/example" title="{{ product.name }}">{{ "Zapato blanco" | translate }}</a>
                                    </div>
                                    <div class="price">
                                        <span class="price" id="price_display" itemprop="price" content="112">{{"11200" | money }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="dest-sec show_help">
                                <div class="head">
                                    <a href="/product/example">{{'images/help-product-02.jpg' | static_url | img_tag}}</a>
                                </div>
                                <div class="bajada">
                                    <div class="category">{{ "Jeans" | translate }}</div>
                                    <div class="title"><a href="/product/example">{{"Jean azul" | translate}}</a></div>
                                    <div class="price">
                                        <span class="price" id="price_display" itemprop="price" content="102">{{"10200" | money }}</span>
                                        <span class="price-compare">
                                            <span id="compare_price_display">{{"13200" | money }}</span>
                                        </span>
                                </div>
                                </div>
                            </div>
                            <div class="dest-sec show_help">
                                 <div class="head">
                                    <a href="/product/example">{{'images/help-product-00.jpg' | static_url | img_tag}}</a>
                                </div>
                                <div class="bajada">
                                    <div class="category">
                                       {{ "CARTERAS" | translate }}</a>
                                    </div>
                                    <div class="title">
                                        <a href="#">{{ "Cartera marrón" | translate }}</a>
                                    </div>
                                   <div class="price">
                                        <span class="price" id="price_display" itemprop="price" content="{{ product.price / 100 }}">{{"44200" | money }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="dest-sec show_help">
                                <div class="head">
                                    <a href="/product/example">{{'images/help-product-01.jpg' | static_url | img_tag}}</a>
                                </div>
                                <div class="bajada">
                                    <div class="category">{{ "Camisas" | translate }}</div>
                                    <div class="title"><a href="/product/example">{{ "Camisa verde y roja" | translate }}</a></div>
                                    <div class="price">
                                        <span class="price" id="price_display" itemprop="price" content="80">{{"8000" | money }}</span>
                                        <span class="price-compare">
                                            <span id="compare_price_display">{{"7200" | money }}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <a href="#" class="jTscrollerPrevButton"><i class="fa fa-angle-up fa-3x"></i></a>
                    <a href="#" class="jTscrollerNextButton"><i class="fa fa-angle-down fa-3x"></i></a>
                </div>
                <div class="visible-phone">
                    <div class="dest-sec">
                        <div class="head">
                            <a href="/product/example">{{'images/help-product-02.jpg' | static_url | img_tag}}</a>
                        </div>
                        <div class="bajada">
                            <div class="category">{{ "Jeans" | translate }}</div>
                            <div class="title"><a href="/product/example">{{"Jean azul" | translate}}</a></div>
                                <div class="price">
                                        <span class="price" id="price_display" itemprop="price" content="102">{{"10200" | money }}</span>
                                        <span class="price-compare">
                                            <span id="compare_price_display">{{"13200" | money }}</span>
                                        </span>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="span4">
            <div class="dest-list line-sec">
                <h1>{{"Productos en oferta" | translate}}</h1>
                <div id="tS3-offer" class="jThumbnailScroller hidden-phone">
                    <div class="jTscrollerContainer">
                        <!-- overlay text -->
                        <div class="product-details-overlay overlay" id="small-overlay">
                            <div class="row-fluid big-row">
                                <div class="center">
                                    <div class="span12">
                                        <h3>{{ "Estos son productos de ejemplo." | translate }} </h3>
                                        <h1>{{ "Así es como puede quedar tu tienda una vez que cargues tus propios productos" | translate }}</h1>
                                        <a href="{{ help_url }}" class="top" target="_top">{{ "Cargar ahora mis productos" | translate }}</a>
                                        <a href="/product/example" class="top secondary">{{ "Ver producto de ejemplo" | translate }}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- ENDs overlay text -->
                        <div class="jTscroller">
                            <div class="dest-sec show_help">
                                <div class="head">
                                    <a href="/product/example">{{'images/help-product-01.jpg' | static_url | img_tag}}</a>
                                </div>
                                <div class="bajada">
                                    <div class="category">{{ "Camisas" | translate }}</div>
                                    <div class="title"><a href="/product/example">{{"Camisa verde y roja" | translate}}</a></div>
                                    <div class="price">
                                        <span class="price" id="price_display" itemprop="price" content="80">{{"8000" | money }}</span>
                                        <span class="price-compare">
                                            <span id="compare_price_display">{{"7200" | money }}</span>
                                        </span>
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="dest-sec show_help">
                                <div class="head">
                                    <a href="/product/example">{{'images/help-product-02.jpg' | static_url | img_tag}}</a>
                                </div>
                                <div class="bajada">
                                    <div class="category">{{ "Jeans" | translate }}</div>
                                    <div class="title"><a href="/product/example">{{"Jean azul" | translate}}</a></div>
                                    <div class="price">
                                        <span class="price" id="price_display" itemprop="price" content="102">{{"10200" | money }}</span>
                                        <span class="price-compare">
                                            <span id="compare_price_display">{{"13200" | money }}</span>
                                        </span>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   <a href="#" class="jTscrollerPrevButton"><i class="fa fa-angle-up fa-3x"></i></a>
                    <a href="#" class="jTscrollerNextButton"><i class="fa fa-angle-down fa-3x"></i></a>
                </div>
                <div class="visible-phone">
                    <div class="dest-sec">
                        <div class="head">
                            <a href="/product/example">{{'images/help-product-01.jpg' | static_url | img_tag}}</a>
                        </div>
                        <div class="bajada">
                            <div class="category">{{ "Camisas" | translate }}</div>
                            <div class="title"><a href="/product/example">{{"Camisa verde y roja" | translate}}</a></div>
                            <div class="price">
                                        <span class="price" id="price_display" itemprop="price" content="80">{{"8000" | money }}</span>
                                        <span class="price-compare">
                                            <span id="compare_price_display">{{"7200" | money }}</span>
                                        </span>
                                    </div>
                        </div>
                    </div>
                    <div class="dest-sec show_help">
                                <div class="head">
                                    <a href="/product/example">{{'images/help-product-02.jpg' | static_url | img_tag}}</a>
                                </div>
                                <div class="bajada">
                                    <div class="category">{{ "Jeans" | translate }}</div>
                                    <div class="title"><a href="/product/example">{{"Jean azul" | translate}}</a></div>
                                    <div class="price">
                                        <span class="price" id="price_display" itemprop="price" content="102">{{"10200" | money }}</span>
                                        <span class="price-compare">
                                            <span id="compare_price_display">{{"13200" | money }}</span>
                                        </span>
                                </div>
                                </div>
                            </div>
                </div>
            </div>
        </div>
        <div class="span4">
            <div class="dest-list line-sec">
                <h1>{{"Próximamente" | translate}}</h1>
                <div id="tS3-coming" class="jThumbnailScroller hidden-phone">
                    <div class="jTscrollerContainer">
                        <!-- overlay text -->
                        <div class="product-details-overlay overlay" id="small-overlay">
                            <div class="row-fluid big-row">
                                <div class="center">
                                    <div class="span12">
                                        <h3>{{ "Estos son productos de ejemplo." | translate }} </h3>
                                        <h1>{{ "Así es como puede quedar tu tienda una vez que cargues tus propios productos" | translate }}</h1>
                                        <a href="{{ help_url }}" class="top" target="_top">{{ "Cargar ahora mis productos" | translate }}</a>
                                        <a href="/product/example" class="top secondary">{{ "Ver producto de ejemplo" | translate }}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- ENDs overlay text -->
                        <div class="jTscroller">
                            <div class="dest-sec show_help">
                                <div class="head">
                                    <a href="{{ help_url }}" target="_top">{{'images/help-product-06-mini.jpg' | static_url | img_tag}}</a>
                                </div>
                                <div class="bajada">
                                    <div class="category">{{ "Camisas" | translate }}</div>
                                    <div class="title"><a href="/product/example">{{"Camisa azul" | translate}}</a></div>
                                </div>
                            </div>
                            <div class="dest-sec show_help">
                                <div class="head">
                                        <a href="#" class="product-image">
                                           {{ "images/help-product-08.jpg" | static_url | img_tag }}
                                        </a>
                                </div>
                                <div class="bajada">
                                    <div class="category">
                                      {{ "Camisas" | translate }}
                                    </div>
                                    <div class="title">
                                        <a href="{{ product.url }}" title="{{ product.name }}">{{ "Chomba" | translate }}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                     <a href="#" class="jTscrollerPrevButton"><i class="fa fa-angle-up fa-3x"></i></a>
                    <a href="#" class="jTscrollerNextButton"><i class="fa fa-angle-down fa-3x"></i></a>
                </div>
                <div class="visible-phone">
                    <div class="dest-sec show_help">
                        <div class="head">
                            <a href="/product/example">{{'images/help-product-06-mini.jpg' | static_url | img_tag}}</a>
                        </div>
                        <div class="bajada">
                            <div class="category">{{ "Camisas" | translate }}</div>
                            <div class="title"><a href="/product/example">{{"Camisa azul" | translate}}</a></div>
                        </div>
                    </div>
                     <div class="dest-sec show_help">
                                <div class="head">
                                        <a href="#" class="product-image">
                                           {{ "images/help-product-08.jpg" | static_url | img_tag }}
                                        </a>
                                </div>
                                <div class="bajada">
                                    <div class="category">
                                        {{ "Camisas" | translate }}
                                    </div>
                                    <div class="title">
                                        <a href="/product/example" title="{{ product.name }}">{{ "Chomba" | translate }}</a>
                                    </div>
                                </div>
                            </div>
                </div>
            </div>
        </div>
    </div>
</div>