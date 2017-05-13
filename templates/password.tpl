<!DOCTYPE html>
<!--[if lt IE 7]><html class="no-js lt-ie9 lt-ie8 lt-ie7"><![endif]-->
<!--[if IE 7]><html class="no-js lt-ie9 lt-ie8"><![endif]-->
<!--[if IE 8]><html class="no-js lt-ie9"><![endif]-->
<!--[if gt IE 8]><!--><html class="no-js"><!--<![endif]-->
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
    {{ '//fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic|Arvo:400,700|Josefin+Sans:400,700|Droid+Serif:400,700|Open+Sans:400italic,700italic,400,700|Roboto:400,400italic,700,700italic|Montserrat:400,700' | css_tag }}
    {{ '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css' | css_tag }}
    {{ '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' | css_tag }}
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
        {{ settings.css_code }}
    </style>
</head>
<body>
<div class="password-page">
    <div class="password-page-body">
        <div class="password-container header-bar-main container">
            {% if has_logo %}
                <h1 class="img logo">
                    {{ store.logo  | img_tag(store.name) | a_tag(store.url)}}
                </h1>
            {% else %}
                <h1>
                    <div class="logo text-only text-center">
                        <a href="{{ store.url }}" >{{ store.name }}</a>
                    </div>
                </h1>
            {% endif %}
        </div>
        <div class="password-container password-icon text-center">
            <svg version="1.1" id="Capa_1" class="password-svg wiggle" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                 viewBox="-62 153.1 486.9 486.9" style="enable-background:new -62 153.1 486.9 486.9;" xml:space="preserve">
                                    <g>
                                        <path class="st0" d="M-48.6,562.1c-17.8,17.8-17.8,46.7,0,64.5c8.9,8.9,20.6,13.3,32.3,13.3s23.3-4.4,32.3-13.3l149.7-149.7
                                            l-64.5-64.4L-48.6,562.1z"/>
                                        <polygon class="st0" points="325.5,284.7 390.8,250.9 424.9,184.9 393.1,153.1 327.1,187.3 293.3,252.4 214,331.8 246.2,364.1
                                            "/>
                                        <path class="st0" d="M339.8,457.7l-6.1-0.6c-11.1,0-21.7,2.3-31.5,5.9L115,275.8c3.6-9.8,5.9-20.4,5.9-31.5l-0.6-6.1
                                            c-3.2-47.5-42.3-85.1-90.6-85.1c-14,0-27.2,3.4-39.1,9.1l60.6,60.6c3.2,3.2,5.4,7,6.8,10.9c4,10.8,1.8,23.3-6.8,32
                                            c-5.9,5.9-13.7,8.9-21.5,8.9c-3.6,0-7.1-0.8-10.5-2.1c-4-1.5-7.8-3.6-10.9-6.9l-60.6-60.6c-5.7,11.9-9.1,25-9.1,39.1
                                            c0,48.3,37.6,87.4,85.1,90.6l6.1,0.6c11.1,0,21.7-2.3,31.5-5.9l187.1,187.2c-3.6,9.8-5.9,20.4-5.9,31.5l0.6,6.1
                                            c3.2,47.5,42.3,85.1,90.6,85.1c14,0,27.2-3.4,39.1-9.1l-60.6-60.6c-3.2-3.2-5.4-7-6.9-10.9c-4-10.8-1.8-23.4,6.9-32.1
                                            c5.9-5.9,13.7-8.9,21.5-8.9c3.6,0,7.1,0.8,10.6,2.1c4,1.5,7.8,3.6,10.9,6.8l60.6,60.6c5.7-11.9,9.1-25,9.1-39.1
                                            C424.9,500,387.3,460.9,339.8,457.7z"/>
                                    </g>
                                </svg>
        </div>
        <div class="password-container password-message section-title">
            <h2 class="text-center title">{{ message }}</h2>
            <hr class="line">
        </div>
        {% if store.facebook or store.twitter or store.google_plus or store.pinterest or store.instagram %}
        {% if "default-background.jpg" | has_custom_image %}
        <div class="social-networks user-background {% if not settings.bg_repeat %}bg-no-repeat{% endif %}" style="background-position-x:{{ settings.bg_position_x }};">
            {% else %}
            <div class="social-networks pattern-background">
                {% endif %}
                <div class="container">
                    <div class="row text-center">
                        <div class="col-xs-12 col-sm-12 col-md-12">
                            <div class="text-center">
                                <h2 class="title">{{"Seguinos en:" | translate}}</h2>
                            </div>
                            <ul class="text-center list-inline">
                                {% for sn in ['facebook', 'twitter', 'google_plus', 'pinterest', 'instagram'] %}
                                    {% set sn_url = attribute(store,sn) %}
                                    {% if sn_url %}
                                        <li>
                                            <a class="soc-foot {{ sn }}" href="{{ sn_url }}" target="_blank" {% if sn == 'google_plus' %}rel="publisher"{% endif %}><i class="fa {% if sn == 'google_plus' %}fa-google-plus{% else %}fa-{{ sn }}{% endif %} fa-2x"></i></a>
                                        </li>
                                    {% endif %}
                                {% endfor %}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {% endif %}
            <div class="password-input-container">
                <div class="row text-center">
                    <div class="col-xs-12 col-sm-12 col-md-12">
                        <form method="post">
                            <input type="password" name="password" placeholder="{{ 'Contraseña de acceso' | translate }}" class="form-control" autocomplete="off">
                            <input type="submit" name="unlock" class="normal-button" value='{{ "Desbloquear" | translate }}' />
                            {% if invalid_password == true %}
                                <div class="row text-center">
                                    <div class="alert alert-danger">{{ "La contraseña es incorrecta." | translate }}</div>
                                </div>
                            {% endif %}
                        </form>
                    </div>
                </div>
            </div>
            <div class="password-footer footer password-container">
                <div class="footer">
                    <div class="footer-bottom">
                        <div class="container">
                            <div class="row text-center">
                                {% if store.phone %}
                                    <p class="phone">
                                        {{ store.phone }}
                                        {% if store.email %}
                                            &nbsp;|&nbsp;
                                        {% endif %}
                                    </p>
                                {% endif %}
                                {% if store.email %}
                                    <p class="mail">{{ store.email | mailto }}</p>
                                {% endif %}
                                <div class="col-xs-12 col-sm-12 col-md-12">
                                    {% if settings.footer_user_text %}
                                        <p>{{ settings.footer_user_text }}</p>
                                    {% endif %}
                                    <p>{{ "Copyright {1} - {2}. Todos los derechos reservados." | translate( (store.business_name ? store.business_name : store.name) ~ (store.business_id ? ' - ' ~ store.business_id : ''), "now" | date('Y') ) }}</p>
                                    {#
                                    La leyenda que aparece debajo de esta linea de código debe mantenerse
                                    con las mismas palabras y con su apropiado link a Tienda Nube;
                                    como especifican nuestros términos de uso: http://www.tiendanube.com/terminos-de-uso .
                                    Si quieres puedes modificar el estilo y posición de la leyenda para que se adapte a
                                    tu sitio. Pero debe mantenerse visible para los visitantes y con el link funcional.
                                    Os créditos que aparece debaixo da linha de código deverá ser mantida com as mesmas
                                    palavras e com seu link para Nuvem Shop; como especificam nossos Termos de Uso:
                                    http://www.nuvemshop.com.br/termos-de-uso. Se você quiser poderá alterar o estilo
                                    e a posição dos créditos para que ele se adque ao seu site. Porém você precisa
                                    manter visivél e com um link funcionando.
                                    #}
                                    <p>{{ powered_by_link }}</p>
                                </div>
                                {% if store.afip %}
                                    <div class="afip col-md-12">
                                        {{ store.afip | raw }}
                                    </div>
                                {% endif %}
                                {% if ebit %}
                                    <div class="ebit">
                                        {{ ebit }}
                                    </div>
                                {% endif %}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{{ "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.0/jquery-ui.min.js" | script_tag }}
{{ 'js/jquery.cookie.js' | common_cdn | script_tag }}
{{ '//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js' | script_tag }}
{{ '//maps.google.com/maps/api/js?sensor=true' | script_tag }}
{{ 'js/minimal.js' | static_url | script_tag }}
</body>
</html>
