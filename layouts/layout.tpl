<!DOCTYPE html>
<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>{{ page_title }}</title>
        <meta name="description" content="{{ page_description }}" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1">
        {% if settings.fb_admins %}
            <meta property="fb:admins" content="{{ settings.fb_admins }}" />
        {% endif %}
        {% if store_fb_app_id %}
        <meta property="fb:app_id" content="{{ store_fb_app_id }}" />
        {% elseif not store.has_custom_domain %}
        <meta property="fb:app_id" content="{{ fb_app.id }}" />
        {% endif %}
        {{ store.name | og('site_name') }}
        {% if template == 'home' and store.logo %}
            {{ ('http:' ~ store.logo) | og('image') }}
            {{ ('https:' ~ store.logo) | og('image:secure_url') }}
        {% endif %}
        
        {# OG tags to control how the page appears when shared on Facebook. See http://ogp.me/ #}
        {% snipplet "metas/facebook-og.tpl" %}
        {# Twitter tags to control how the page appears when shared on Twitter. See https://dev.twitter.com/cards/markup #}
        {% if template == 'product' %}
            {# Twitter #}
            {% snipplet "metas/twitter-product.tpl" %}
            {# Facebook #}
            {% snipplet "metas/facebook-product-og.tpl" %}
        {% elseif template == 'category' %}
            {# Facebook #}
            {% snipplet "metas/facebook-category-og.tpl" %}
        {% endif %}

        {{ '//fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic|Arvo:400,700|Josefin+Sans:400,700|Droid+Serif:400,700|Open+Sans:400italic,700italic,400,700|Roboto:400,400italic,700,700italic|Montserrat:400,700' | css_tag }}
        {{ '//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css' | css_tag }}
        {{ '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' | css_tag }}
        {{ 'js/pushy/pushy.css' | static_url | css_tag }}
        {{ 'css/style.css' | static_url | css_tag }}
        {{ 'css/main-color.scss.tpl' | static_url | css_tag }}
        {{ 'css/style_media.css' | static_url | css_tag }}
        <!--[if lt IE 9]>
        {{ '//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.2/html5shiv-printshiv.min.js' | script_tag }}
        <![endif]-->
        {% set nojquery = true %}
        {{ '//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js' | script_tag }}
        {% head_content %}

        <style>
            {{ settings.css_code | raw }}
        </style>
    </head>
    <body>
        {{ social_js }}
        {% if template == 'account.login' or template == 'account.register' %}
        <script>
            function loginFacebook() {
                LS.facebookLogin(FB, function(status, hasEmail) {
                    if (status === 'connected') {
                        if (hasEmail) {
                            window.location = "{{ store.url }}/account/facebook_login/";
                        } else {
                            $('#login-form').prepend(
                                    "<div class=\"st error c\">{{ 'Tienes que compartír tu e-mail.' | translate }}</div>");
                        }
                    } else {
                        $('#login-form').prepend(
                                "<div class=\"st error c\">{{ 'Debes completar el login.' | translate }}</div>");
                    }
                });
            }
        </script>
        {% endif %}
        <!--[if lt IE 7]>
        <p class="chromeframe">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">activate Google Chrome Frame</a> to improve your experience.</p>
        <![endif]-->

        <!-- Pushy Menu -->
        <nav class="pushy pushy-open">
            <span class="close-pushy visible-xs"><i class="fa fa-times menu-btn"></i></span>
            <ul>
              <div class="js-desktop-logo-container hidden-xs">
              {% if template == 'home' %}
               {% if has_logo %}
                    <h1 id="logo" class="text-center">
                        {{ store.logo | img_tag | a_tag(store.url) }}
                    </h1>
                    <div class="text-logo-desktop hidden">
                        <a href="{{ store.url }}">{{ store.name }}</a>
                    </div>
                {% else %}
                    <div id="logo" class="text-center hidden">
                        {{ store.logo | img_tag | a_tag(store.url) }}
                    </div>
                    <h1 class="text-logo-desktop">
                        <a href="{{ store.url }}">{{ store.name }}</a>
                    </h1>
                {% endif %}
              {% else %}
                <div id="logo" class="text-center{% if not has_logo %} hidden{% endif %}">
                    {{ store.logo | img_tag | a_tag(store.url) }}
                </div>
                <div class="text-logo-desktop {% if has_logo %} hidden{% endif %}">
                    <a href="{{ store.url }}">{{ store.name }}</a>
                </div>
              {% endif %}
               
              </div>
              <div class="scrollable">
                {% snipplet "navigation-mobile.tpl" %}
              </div>

              {# fixed bottom social content inside sidebar #}
              {% if store.facebook or store.twitter or store.google_plus or store.pinterest or store.instagram or store.email %}
                <div class="fixed-bottom js-nav-footer">
                  {% if store.email %}
                      <p class="email"><i class="fa fa-envelope-o fa-2x"></i> {{ store.email | mailto }}</p>
                  {% endif %}
                  {% if store.facebook or store.twitter or store.google_plus or store.pinterest or store.instagram %}
                      <p class="text-center list-inline row-fluid social m-bottom-half m-top-half clearfix">
                          {% for sn in ['facebook', 'twitter', 'google_plus', 'pinterest', 'instagram'] %}
                              {% set sn_url = attribute(store,sn) %}
                              {% if sn_url %}
                                  <span>
                                      <a class="soc-foot {{ sn }}" href="{{ sn_url }}" target="_blank" {% if sn == 'google_plus' %}rel="publisher"{% endif %}><i class="fa fa-{{ sn == 'google_plus' ? 'google-plus' : sn }}"></i></a>
                                  </span>
                              {% endif %}
                          {% endfor %}
                      </p>
                  {% endif %}
                </div>
              {% endif %}
            </ul>
        </nav>
        <div class="site-overlay"></div><!-- Ends pushy Menu -->
        {# feature fixed in the right corner that allows users to change the grid columns #}
        {% if template == "category" or (sections.primary.products and template == "home") %}
            {% snipplet "change_grid.tpl" %}
        {% endif %}
        {% if settings.show_news_box and template == 'home' %}
            {% include 'snipplets/newsletter-popup.tpl' %}
        {% endif %}
        <div id="container">
            {% snipplet 'header.tpl' %}
            <div class="row-fluid clearfix">
              {% template_content %}
            </div>
            {% if settings.banner_services %}
              <div class="banner-services-footer clearfix">
                  {% include 'snipplets/banner-services.tpl' %}
              </div>
            {% endif %}
            <div class="row-fluid clearfix">
              {% snipplet "footer.tpl" %}
            </div>
        </div>



        {{ "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js" | script_tag }}
        {{ 'js/jquery.cookie.js' | common_cdn | script_tag }}
        {{ '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js' | script_tag }}
        {% set gmap_url = "//maps.google.com/maps/api/js" ~ (store.gmap_api_key and store.can_show_google_map ? "?key=#{store.gmap_api_key}" : "") %}
        {{ gmap_url | script_tag }}
        {{ 'js/minimal.js' | static_url | script_tag }}
        {{ 'js/pushy/pushy.js' | static_url | script_tag }}
        {{ '//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.2.0/imagesloaded.pkgd.min.js' | script_tag}}
        {{ "//cdnjs.cloudflare.com/ajax/libs/masonry/3.3.2/masonry.pkgd.min.js" | script_tag }}
        {% if template == 'product' %}
        <script type="text/javascript">
             $(document).ready(function(){
                $("#button-installments").click(function(){
                    $("#InstallmentsModal").appendTo("body");
                });
            });
        </script>
        {% endif %}
        <script type="text/javascript">
            /** MINIMAL Specific JS **/

            //Masonry Filters Grid
            var $filtersgrid = $('.filters-grid').masonry({
               // options
              itemSelector: '.filter-container',
              columnWidth: '.col-md-4',
            });

            //Masonry Product Grid
            var $grid = $('.grid').masonry({
              // options
              itemSelector: '.single-product',
            });

            // load Masonry on imagesLoaded
            $grid.imagesLoaded().progress( function() {
              $grid.masonry("layout");
              $filtersgrid.masonry();
            });

            // on change menu position, masonry addapts
            $(".menu-btn, #change-grid-btn a").click(function(){
              setTimeout(function(){
                $grid.masonry("reloadItems");
                $grid.masonry();
                $filtersgrid.masonry()
              }, 700);
            });

            //On changeGrid reload masonry
            $('#change-grid-btn a').click(function(){
                  $grid.masonry("reloadItems");
                  $grid.masonry();
            });

            // on charge filterss, masonry addapts
            $("#show-filters").click(function(){
              setTimeout(function(){
                $filtersgrid.masonry("reloadItems");
                $filtersgrid.masonry();
              },400);
            });

            // refresh page effect
            $("body").fadeIn(400);

            $(document).ready(function(){
              (function( $ ){
                $.fn.scrollHeightfunction = function() {
                  // pushy calculate scrollable part
                    var $logoHeight = $('.js-desktop-logo-container').innerHeight();
                    var $pushyHeight = $('nav.pushy').innerHeight();
                    var $pushyFooterHeight = $(".js-nav-footer").innerHeight();
                    var $scrollHeight = $pushyHeight - $logoHeight - $pushyFooterHeight;
                  // add height to scrollable sidebar
                    $(".scrollable").height($scrollHeight);
                  };
                })( jQuery );
                $.fn.scrollHeightfunction();
              // execute scroll function on window resize
                $( window ).resize(function() {
                  $.fn.scrollHeightfunction();
                });

              // pushy onLoad to default hide in mobile
              if ($(window).width() <= 890){
                $(".pushy").addClass("pushy-left").removeClass("pushy-open");;
                $("#container").addClass("container-push");
              }
            });

            //Hamburguer Menu Javascript
            $(".pushy .mobile-dropdown").click(function(){
                $(this).next("#accordion").slideToggle(300);
            });
            $("#show-filters").click(function(){
                $("#toggle-filters").slideToggle(800);
            });
            $(".mobile-dropdown").click(function(){
                $(this).toggleClass("dropdown-selected");
            });
            $("a.pushy-dropdown").click(function(){
                $(".pushy").addClass("pushy-open").removeClass("pushy-left");
                $("body").addClass("pushy-active");
                $(".push").addClass("push-push");
            });
            /** END MINIMAL Specific JS **/
        </script>

       {% if template == "product" %}
            <script type="text/javascript">
            $(document).ready(function(){

                slider = $('#productbxslider').bxSlider({
                    nextText:'<i class="fa fa-chevron-right"></i>',
                    prevText:'<i class="fa fa-chevron-left"></i>'
                });

                {% if product.images_count > 1 %}
                LS.registerOnChangeVariant(function(variant){
                    var liImage = $('#productbxslider').find("[data-image='"+variant.image+"']");
                    var selectedPosition = liImage.data('image-position');
                    var slideToGo = parseInt(selectedPosition);
                    slider.goToSlide(slideToGo);

                });
                {% endif %}

                $('.product-share-button').click(function(){
                    ga_send_event('social-sharing-product', $(this).data('network'))
                });

                {# Installments details #}

                {% if store.installments_on_steroids_enabled %}

                    // Installments details flags and selects
                    $(".js-installments-bank-select optgroup:not(:has(option))").hide(); 
                    $('.js-installment-select').on('change', function() {
                        $(".js-installments-container").removeClass("js-installments-container-active");
                        var $installments_container = $(this).closest(".js-installments-container").addClass("js-installments-container-active");
                        var $active_installment_amount = $(this).find(':selected').addClass('js-amount-selected').siblings('option').removeClass('js-amount-selected');
                        var installment_select_value = $(this).val();
                        $(".js-installments-container-active .js-installment-price").hide();
                        var $installment_price_to_show = $installments_container.find('.'+installment_select_value);
                        $installment_price_to_show.show();
                    });

                    $(".js-installments-flag-tab").click(function(e){
                        e.preventDefault();
                        var $main_container = $(this).closest(".js-gw-tab-pane");
                        $main_container.find(".js-installments-flag-tab").not(this).removeClass("active");
                        ga_send_event('installments-flags-clicks', 'clicks');
                    });
                    $(".js-installments-cash-tab").click(function(e){
                        e.preventDefault();
                        var $main_container = $(this).closest(".js-gw-tab-pane");
                        $main_container.find(".js-credit-cart-tab-pane.active").removeClass("active");
                        $main_container.find(".js-installments-final-info").hide();
                        $main_container.find(".js-cash-final-info").show();
                    });

                    $(".js-installments-credit-tab").click(function(){
                        var $main_container = $(this).closest(".js-gw-tab-pane");

                        // Show the correct installment value related to each credit card
                        $main_container.find(".js-installments-final-info").show();
                        $main_container.find(".js-cash-final-info").hide();
                        var current_credit_card_id_val = $(this).attr("id"); 
                        $main_container.find(".js-installment-select").hide().removeClass("active");
                        $main_container.find(".js-installment-select-container").hide().removeClass("active");
                        $main_container.find('.'+current_credit_card_id_val).show().addClass("active");

                        // Update the installment depending the selected credit card
                        $(".js-gw-tab-pane.active .js-installments-container").removeClass("js-installments-container-active");
                        var $installments_container = $main_container.find(".js-installment-select.active").closest(".js-installments-container").addClass("js-installments-container-active");
                        var $active_installment_amount = $main_container.find('.js-installment-select.active option:selected').addClass('js-amount-selected').siblings('option').removeClass('js-amount-selected');
                        var installment_select_value = $main_container.find('.js-installment-select.active').val();
                        $(".js-gw-tab-pane.active .js-installment-price").hide();
                        var $installment_price_to_show = $installments_container.find('.'+installment_select_value);
                        $installment_price_to_show.show();
                        $(".js-installment-single-select").show().addClass("active");
                    });

                    // Installments details refresh data
                    $("li[data-type='cc'].installments-card").click(function(e){
                        var active_card = $(this).data("code");
                        refreshInstallmentData(active_card);
                    });

                    $(".js-installments-bank-select, .js-installment-select, .js-variation-option").change(function(e){
                        var active_card = $(".js-gw-tab-pane.active .js-installments-flag-tab.active").data("code");
                        refreshInstallmentData(active_card);
                    });

                    $("#button-installments, .js-mobile-toggle-installments, .js-installments-gw-tab").click(function(e){
                        var active_card = $(".js-gw-tab-pane.active .js-installments-flag-tab.active").data("code");
                        refreshInstallmentData(active_card);
                    });

                    $(".js-installments-gw-tab").click(function(e){
                        setTimeout(function() {
                            var active_card = $(".js-gw-tab-pane.active .js-installments-flag-tab.active").data("code");
                            refreshInstallmentData(active_card);
                        }, 10);
                    });

                    $(".js-installments-bank-select").change(function(e){
                        var $main_container = $(this).closest(".js-gw-tab-pane");
                        $main_container.find(".js-credit-cart-tab-pane.active .js-bank-not-selected-error").hide();
                        var $disabled_installment_select = $(".js-installment-select:visible:disabled");
                        $disabled_installment_select.prop('disabled', false).addClass("enabled");
                        $(".js-installment-select:visible.enabled").next(".js-installment-select-container").remove();
                    });

                    $(".js-installment-select-container").click(function(e){
                        var $main_container = $(this).closest(".js-gw-tab-pane");
                        $main_container.find(".js-credit-cart-tab-pane.active .js-bank-not-selected-error").show();
                        e.preventDefault();
                    });
                    
                    $(".js-installments-accept-button").click(function(){
                        var selected_gw = $(".js-installments-gw-tab.active a").text();
                        var selected_gw_code = $(".js-installments-gw-tab.active").data('code');
                        sessionStorage.setItem('installments-selected-gw-code', selected_gw_code);
                        sessionStorage.setItem('installments-selected-gw-name', selected_gw.toLowerCase());
                        $("input[name=preselected_gw_code]").val(selected_gw_code);
                        $(".js-installemnts-selected-gw").text(selected_gw.toLowerCase());
                        $(".js-installemnts-selected-gw-container").show();
                    });

                    $(document).ready(function() {
                        if(sessionStorage.getItem('installments-selected-gw-code')){
                            $("input[name=preselected_gw_code]").val(sessionStorage.getItem('installments-selected-gw-code'));
                            $(".js-installemnts-selected-gw").text(sessionStorage.getItem('installments-selected-gw-name'));
                            $(".js-installemnts-selected-gw-container").show();
                        }
                    });

                    function refreshInstallmentData(active_card) {
                        if($('.js-installments-cft-value').length) {
                            //CFT
                            var installment = Number($(".js-gw-tab-pane.active select.js-installments-card-" + active_card + " option:selected").data('number'));
                            var installment_value = $(".js-gw-tab-pane.active select.js-installments-card-" + active_card + " option:selected").val();
                            var total_value_one_payment = Number($(".js-installments-one-payment").attr("data-value"));
                            var cft = $(".js-gw-tab-pane.active select[data-card=" + active_card + "] option:selected").data("cft-" + installment);
                            $(".js-gw-tab-pane.active .js-installments-cft-value").text(cft ? cft.toLocaleString('de-DE', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + "%" : "0,00%");

                            //TEA
                            var tea = $(".js-gw-tab-pane.active select[data-card=" + active_card + "] option:selected").data("tea-" + installment);
                            $(".js-gw-tab-pane.active .js-installments-tea").text(tea ? tea.toLocaleString('de-DE', {maximumFractionDigits: 2, minimumFractionDigits: 2}) + "%" : "0,00%");

                            //Total Price
                            if (!cft) {
                                $(".js-gw-tab-pane.active .js-installments-ptf").text($(".js-gw-tab-pane.active strong.js-installments-one-payment").text());
                                $(".js-gw-tab-pane.active ." + installment_value + " .installment-price").text(LS.currency.display_short + (total_value_one_payment/installment).toLocaleString('de-DE', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
                                $(".js-gw-tab-pane.active .js-installment-without-int-text").show();
                            } else {
                                var base_price = Number($("#price_display").attr("content"));
                                var installment_price_container = $(".js-gw-tab-pane.active ." + installment_value + " .installment-price");
                                installment_price_container.text(LS.currency.display_short + Number(installment_price_container.attr("data-value")).toLocaleString('de-DE', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
                                var total_value = installment * priceToFloat($(".js-gw-tab-pane.active ." + installment_value + " .installment-price").text());
                                total_value = ((Math.abs(base_price - total_value) < 0.05) ? base_price : total_value);
                                $(".js-gw-tab-pane.active .js-installments-ptf").text(LS.currency.display_short + total_value.toLocaleString('de-DE', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
                                $(".js-gw-tab-pane.active .js-installment-without-int-text").hide();
                            }
                            if($(".js-gw-tab-pane.active .js-installments-ptf").text().trim() == $('.js-gw-tab-pane.active .js-installment-legal-info .js-installments-one-payment').text().trim()){
                                $(".js-gw-tab-pane.active .js-installments-cft-value").text("0,00%");
                                $(".js-gw-tab-pane.active .js-installments-tea").text("0,00%");
                                $(".js-gw-tab-pane.active ." + installment_value + " .installment-price").text(LS.currency.display_short + (total_value_one_payment/installment).toLocaleString('de-DE', {maximumFractionDigits: 2, minimumFractionDigits: 2}));
                                $(".js-gw-tab-pane.active .js-installment-without-int-text").show();
                            }

                            // CFT Visibility
                            if(installment == 1){
                                $(".js-gw-tab-pane.active .js-installment-cft-container, .js-gw-tab-pane.active .js-installment-ptf-container, .js-gw-tab-pane.active .js-installment-tea-container").hide();
                            }else{
                                $(".js-gw-tab-pane.active .js-installment-cft-container, .js-gw-tab-pane.active .js-installment-ptf-container, .js-gw-tab-pane.active .js-installment-tea-container").show();
                            }
                        }
                    }

                    function priceToFloat(price){
                        return parseFloat(price.replace(/[^\d,]/g,'').replace(/[,]/g,'.'));
                    }

                    var device = ($(window).width() > 769 ? 'desktop' : 'mobile');
                    $(".js-open-installments-modal-" + device).click(function(e){
                        ga_send_event("installments-opened-"  + device, 'clicks');
                    });

                {% endif %}

                // Installments details - Mobile
                if ($(window).width() < 768) {
                    $(".js-product-detail-payment-logo").removeAttr("href");
                    $("#button-installments").removeAttr("href");
                    $(".js-mobile-installments-panel").appendTo("body");
                    $(".js-mobile-toggle-installments").click(function(e){
                        e.preventDefault();
                        if(!$(".js-installments-details-container").hasClass("js-installments-details-detached")){
                            $(".js-installments-details-container").detach().appendTo('.js-mobile-installments-body');
                        }
                        $(".js-mobile-installments-panel").toggleClass("animation-panel-right-open animation-panel-right-close");
                        $("body").toggleClass("overflow-none");
                        $(".js-installments-details-container").addClass("js-installments-details-detached");
                    });
                }
            });

                $( ".spinner" ).spinner({
                    spin: function( event, ui ) {
                        if ( ui.value > 100 ) {
                            $( this ).spinner( "value", 1 );
                            return false;
                        } else if ( ui.value < 1 ) {
                            $( this ).spinner( "value", 1 );
                            return false;
                        }
                    }
                });
            </script>
        {% endif %}

        <script type="text/javascript">
            /* Newsletter Avoid Siteblindado bot spam */
            LS.newsletter_avoid_siteblindado_bot();
            
            {% if settings.show_news_box %}
            $('#newsletter-popup').submit(function(){
                $(".loading-modal").show();
                $("#newsletter-popup .popup-news").prop("disabled", true);
                ga_send_event('contact', 'newsletter', 'popup');
            });

            LS.newsletter('#newsletter-popup', '#newsModal', '{{ store.contact_url | escape('js') }}', function(response){
                $(".loading-modal").hide();
                var selector_to_use = response.success ? '.contact-ok' : '.contact-error';
                $(this).find(selector_to_use).fadeIn( 100 ).delay( 1300 ).fadeOut( 500 );
                if($("#newsletter-popup .contact-ok").css("display") == "block"){
                    setTimeout(function()
                        { $("#newsModal").modal('hide'); }, 2500);
                }else{
                    {# nothing happens here #}
                }
                $('#newsletter-popup input[type="email"]').val('');
                $("#newsletter-popup .popup-news").prop("disabled", false);
            });

            $(document).ready(function(){
                LS.newsletterPopup();
            });
            {% endif %}

            function get_max_installments_without_interests(number_of_installment, installment_data, max_installments_without_interests) {
                if (parseInt(number_of_installment) > parseInt(max_installments_without_interests[0])) {
                    if (installment_data.without_interests) {
                        return [number_of_installment, installment_data.installment_value.toFixed(2)];
                    }
                }
                return max_installments_without_interests;
            }

            function get_max_installments_with_interests(number_of_installment, installment_data, max_installments_with_interests) {
                if (parseInt(number_of_installment) > parseInt(max_installments_with_interests[0])) {
                    if (installment_data.without_interests == false) {
                        return [number_of_installment, installment_data.installment_value.toFixed(2)];
                    }
                }
                return max_installments_with_interests;
            }

            function changeVariant(variant){

                $("#shipping-calculator-response").hide();
                $("#shipping-variant-id").val(variant.id);

                var parent = $("body");
                if (variant.element){
                    parent = $(variant.element);
                }

                var sku = parent.find('#sku');
                if(sku.length) {
                    sku.text(variant.sku).show();
                }

                var installment_helper = function($element, amount, price){
                    $element.find('.installment-amount').text(amount);
                    $element.find('.installment-price').attr("data-value", price);
                    $element.find('.installment-price').text(LS.currency.display_short + parseFloat(price).toLocaleString('de-DE', { minimumFractionDigits: 2 }));
                    if(variant.price_short && Math.abs(variant.price_number - price * amount) < 1) {
                        $element.find('.installment-total-price').text((variant.price_short).toLocaleString('de-DE', { minimumFractionDigits: 2 }));
                    } else {
                        $element.find('.installment-total-price').text(LS.currency.display_short + (price * amount).toLocaleString('de-DE', { minimumFractionDigits: 2 }));
                    }
                };

                if (variant.installments_data) {
                    var variant_installments = JSON.parse(variant.installments_data);
                    var max_installments_without_interests = [0,0];
                    var max_installments_with_interests = [0,0];
                    $.each(variant_installments, function(payment_method, installments) {
                        $.each(installments, function(number_of_installment, installment_data) {
                            max_installments_without_interests = get_max_installments_without_interests(number_of_installment, installment_data, max_installments_without_interests);
                            max_installments_with_interests = get_max_installments_with_interests(number_of_installment, installment_data, max_installments_with_interests);
                            var installment_container_selector = '#installment_' + payment_method + '_' + number_of_installment;
                            installment_helper($(installment_container_selector), number_of_installment, installment_data.installment_value.toFixed(2));
                        });
                    });
                    var $installments_container = $(variant.element + ' .installments.max_installments_container .max_installments');
                    var $installments_modal_link = $(variant.element + ' #button-installments');

                    var installments_to_use = max_installments_without_interests[0] > 1 ? max_installments_without_interests : max_installments_with_interests;

                    if(installments_to_use[0] <= 1 ) {
                        $installments_container.hide();
                        $installments_modal_link.hide();
                    } else {
                        $installments_container.show();
                        $installments_modal_link.show();
                        installment_helper($installments_container, installments_to_use[0], installments_to_use[1]);
                    }
                }

                $('.js-installments-one-payment').text(variant.price_short);
                $('.js-installments-one-payment').attr("data-value", variant.price_number);

                if (variant.price_short){
                    parent.find('.js-price-display').text(variant.price_short).show();
                } else {
                    parent.find('.js-price-display').hide();
                }

                if ((variant.compare_at_price_short) && !($(".js-price-display").css("display") == "none")) {
                    parent.find('.js-compare-price-display').text(variant.compare_at_price_short).show();
                } else {
                    parent.find('.js-compare-price-display').hide();
                }
                var button = parent.find('.addToCart');
                button.removeClass('cart').removeClass('contact').removeClass('nostock');
                {% if not store.is_catalog %}
                var $shipping_calculator_form = $("#shipping-calculator-form");
                if (!variant.available){
                    button.val('{{ settings.no_stock_text | escape('js') }}');
                    button.addClass('nostock');
                    button.attr('disabled', 'disabled');
                    $shipping_calculator_form.hide();
                } else if (variant.contact) {
                    button.val('{{ "Consultar precio" | translate }}');
                    button.addClass('contact');
                    button.removeAttr('disabled');
                    $shipping_calculator_form.hide();
                } else {
                    button.val('{{ "Agregar al carrito" | translate }}');
                    button.addClass('cart');
                    button.removeAttr('disabled');
                    $shipping_calculator_form.show();
                }
                {% endif %}
            }
        </script>
        <!-- Infinite scroll JS -->
        {% if settings.infinite_scrolling and (template == 'category' or template == 'search') %}
            <script type="text/javascript">
                $(function() {
                    new LS.infiniteScroll({
                        afterSetup: function() {
                            //Esconde los elementos de paginación en el diseño
                            $('.crumbPaginationContainer').hide();
                        },
                        finishData: function() {
                            $('#loadMoreBtn').remove();
                        },
                        afterLoaded: function() {
                          // Reload masonry items after load more products
                          $grid.masonry("reloadItems");
                          $grid.imagesLoaded().progress( function() {
                              $grid.masonry("layout");
                            });
                          // keep the imagen in the same grid size
                          $("#change-grid-btn a.active").click();
                        },
                        productGridClass: 'product-grid',
                        productsPerPage:12
                    });
                });
            </script>
        {% endif %}

        <script type="text/javascript">
        if ($(window).width() >= 890){
            LS.registerOnChangeVariant(function(variant){
                // Preto-theme image per variant
                var $varid = "#"+(variant.image)
                $('html, body').animate({
                    scrollTop: $($varid).offset().top
                }, 1000);

            });
          }


            $(document).ready(function(){

                if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                    $('select.on-steroids').removeClass('on-steroids');
                }
                $(".pagination li.disabled a").click(function(event) {
                    event.preventDefault();
                });

                $(".contact-form").submit(function(){
                    if ($('input#winnie-pooh').val().length != 0){
                        return false;
                    }
                });


                {% if contact and contact.success %}
                    {% if contact.type == 'newsletter' %}
                        ga_send_event('contact', 'newsletter', 'standard');
                    {% elseif contact.type == 'contact' %}
                        ga_send_event('contact', 'contact-form');
                    {% endif %}
                {% endif %}

                $("#product_form").submit(function(e){
                    var button = $(this).find(':submit');
                    button.attr('disabled', 'disabled');
                    if ((button.hasClass('contact')) || (button.hasClass('catalog'))) {
                        e.preventDefault();
                        var product_id = $(this).find("input[name='add_to_cart']").val();
                        window.location = "{{ store.contact_url | escape('js') }}?product=" + product_id;
                    } else if (button.hasClass('cart')) {
                        button.val('{{ "Agregando..." | translate }}');
                    }
                });

                // Show and hide labels on variant change or page load 

                $(document).on("change", ".js-variation-option", function(e) {
                    var $this_compare_price =  $(this).closest(".js-product-container").find(".js-compare-price-display");
                    var $this_add_to_cart =  $(this).closest(".js-product-container").find(".js-prod-submit-form");
                    var $this_product_container = $(this).closest(".js-product-container");
                    if ($this_compare_price.css("display") == "none") {
                        $this_product_container.find(".js-offer-label").hide();
                    }
                    else {
                        $this_product_container.find(".js-offer-label").show();
                    }
                    if ($this_add_to_cart.hasClass("nostock")) {
                        $this_product_container.find(".js-stock-label").show();
                    }
                    else {
                        $this_product_container.find(".js-stock-label").hide();
                    }
                });

                $("#shipping-zipcode").keydown(function(e) {
                    var key = e.which ? e.which : e.keyCode;
                    var enterKey = 13;
                    if (key === enterKey) {
                        e.preventDefault();
                        $("#calculate-shipping-button").click();
                    }
                });

                var $calculator = $("#shipping-calculator");
                var $loading = $calculator.find(".loading");
                $("#calculate-shipping-button").click(function () {
                    var params = {'zipcode': $("#shipping-zipcode").val()};
                    var variant = $("#shipping-variant-id");
                    if(variant.length) {
                        params['variant_id'] = variant.val();
                    }
                    $loading.show();
                    $("#invalid-zipcode").hide();
                    $.post('{{store.shipping_calculator_url | escape('js')}}', params, function (data) {
                        $loading.hide();
                        if (data.success) {
                            $("#shipping-calculator-response").html(data.html);
                            $("#shipping-calculator-form, #shipping-calculator-response").toggle();
                        } else {
                            $("#invalid-zipcode").show();
                        }
                    }, 'json');
                    return false;
                });
                $loading.hide();

                $('.sort-by').change(function(){
                    var params = LS.urlParams;
                    params['sort_by'] = $(this).val();
                    var sort_params_array = [];
                    for (var key in params) {
                        if ($.inArray(key, ['results_only', 'page']) == -1) {
                            sort_params_array.push(key + '=' + params[key]);
                        }
                    }
                    var sort_params = sort_params_array.join('&');
                    window.location = window.location.pathname + '?' + sort_params;
                });

                $('#google-map').gmap3({
                    getlatlng:{
                        address: "{{ store.address | escape('js') }}",
                        callback: function(results) {
                            if ( !results ) return;
                            var store_location = results[0].geometry.location
                            $('#google-map').gmap3({
                                map: {
                                    options: {
                                        zoom: 14,
                                        center: store_location
                                    }
                                },
                                marker: {
                                    address: "{{ store.address | escape('js') }}"
                                }
                            });
                        }
                    }
                });
            });
        </script>

        {% if template == 'cart' %}
        {{ 'js/jquery.livequery.min.js' | static_url | script_tag }}
        <script type="text/javascript">
            $(document).ready(function(){

                // Key pressed in quantity input
                $(".col-quantity input").keypress(function(e){
                    if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                        return false;
                    }
                });

                // Quantity input focus out
                $(".col-quantity input").focusout(function(e){
                    $("#go-to-checkout").prop( "disabled", true ); 
                    var itemID = $(this).attr("data-item-id");
                    var itemVAL = $(this).val();
                    if(itemVAL==0) {
                        var r = confirm("{{ '¿Seguro que quieres borrar este artículo?' | translate }}");
                        if (r == true) {
                            LS.removeItem(itemID);
                        } else {
                            $(this).val(1);
                        }
                    } else {
                        LS.changeQuantity(itemID, itemVAL);
                    }
                });

                // Clicked shipping method listener
                $(document).on( "click", "input.shipping-method", function() {
                    var elem = $(this);
                    var shippingPrice = elem.attr("data-price");
                    elem.click(function() {
                        LS.addToTotal(shippingPrice);
                    });
                    $('.shipping-suboption').hide();
                    elem.closest('li').find('.shipping-suboption').show();
                });

                // Default shipping method listener
                $('input.shipping-method:checked').livequery(function(){
                    var shippingPrice = $(this).attr("data-price");
                    LS.addToTotal(shippingPrice);
                });

            });
        </script>
        {% endif %}
        {% if store.live_chat %}
            <!-- begin olark code -->
            <script type='text/javascript'>/*{literal}<![CDATA[*/
                window.olark||(function(c){var f=window,d=document,l=f.location.protocol=="https:"?"https:":"http:",z=c.name,r="load";var nt=function(){f[z]=function(){(a.s=a.s||[]).push(arguments)};var a=f[z]._={},q=c.methods.length;while(q--){(function(n){f[z][n]=function(){f[z]("call",n,arguments)}})(c.methods[q])}a.l=c.loader;a.i=nt;a.p={0:+new Date};a.P=function(u){a.p[u]=new Date-a.p[0]};function s(){a.P(r);f[z](r)}f.addEventListener?f.addEventListener(r,s,false):f.attachEvent("on"+r,s);var ld=function(){function p(hd){hd="head";return["<",hd,"></",hd,"><",i,' onl' + 'oad="var d=',g,";d.getElementsByTagName('head')[0].",j,"(d.",h,"('script')).",k,"='",l,"//",a.l,"'",'"',"></",i,">"].join("")}var i="body",m=d[i];if(!m){return setTimeout(ld,100)}a.P(1);var j="appendChild",h="createElement",k="src",n=d[h]("div"),v=n[j](d[h](z)),b=d[h]("iframe"),g="document",e="domain",o;n.style.display="none";m.insertBefore(n,m.firstChild).id=z;b.frameBorder="0";b.id=z+"-loader";if(/MSIE[ ]+6/.test(navigator.userAgent)){b.src="javascript:false"}b.allowTransparency="true";v[j](b);try{b.contentWindow[g].open()}catch(w){c[e]=d[e];o="javascript:var d="+g+".open();d.domain='"+d.domain+"';";b[k]=o+"void(0);"}try{var t=b.contentWindow[g];t.write(p());t.close()}catch(x){b[k]=o+'d.write("'+p().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}a.P(2)};ld()};nt()})({loader: "static.olark.com/jsclient/loader0.js",name:"olark",methods:["configure","extend","declare","identify"]});
                /* custom configuration goes here (www.olark.com/documentation) */
                olark.identify('{{store.live_chat | escape('js')}}');/*]]>{/literal}*/
            </script>
            <!-- end olark code -->
        {% endif %}
        {{ store.assorted_js | raw }}
    </body>
</html>
