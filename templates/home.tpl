<!-- Slider -->
{% if "default-background.jpg" | has_custom_image %}
	{% if settings.bg_position_x == "left" %}
	<div class="user-background {% if not settings.bg_repeat %}bg-no-repeat{% endif %}" style="background-position-x:left;">
	{% elseif settings.bg_position_x == "center" %}
	<div class="user-background {% if not settings.bg_repeat %}bg-no-repeat{% endif %}" style="background-position-x:center;">
	{% else %}
	<div class="user-background {% if not settings.bg_repeat %}bg-no-repeat{% endif %}" style="background-position-x:right;">
	{% endif %}
{% else %}
<div class="pattern-background">
{% endif %}

{% if "banner-home.jpg" | has_custom_image %}
<div class="banner">
	<div class="banner-shadow"></div>
	{% if settings.banner_home_url != '' %}
		{{ "banner-home.jpg" | static_url | img_tag(store.name) | a_tag(settings.banner_home_url) }}
	{% else %}
		{{ "banner-home.jpg" | static_url | img_tag(store.name) }}
	{% endif %}
</div>
{% endif %}

</div>
{% if settings.banner_services_home %}
	{% include 'snipplets/banner-services.tpl' %}
{% endif %}
<div class="container">

	{% if sections.primary.products %}
	<div class="row">
		<div class="col-md-12 m-top">
      <div class="row-fluid clearfix m-top">
        <div class="col-xs-8 col-sm-8">
          <p>{{ "Productos destacados" | translate }}</p>
        </div>
        <div class="col-xs-4 col-sm-4 text-right">
          <p><a class="text-underline" href="{{ store.products_url }}">{{ "Ver todos" | translate }}</a></p>
        </div>
      </div>
			<section id="grid" class="grid clearfix">
			{% for product in sections.primary.products %}
				{% if loop.index % 4 == 1 %}
				<div class="row">
				{% endif %}
					{% include 'snipplets/single_product.tpl' %}
				{% if loop.index % 4 == 0 or loop.last %}
			    </div>
			    {% endif %}
			{% endfor %}
			</section>
		</div>
	</div>
	<div class="row container-see-all-prods text-center">
        <a href="{{ store.products_url }}" class="btn-see-all-prods button secondary">{{ "Ver todos los productos" | translate }}</a>
    </div>
	{% endif %}
	<div class="row m-top">
		{% set blocksCount = 0 %}
		{% if settings.show_footer_fb_like_box and store.facebook %}
			{% set blocksCount = blocksCount + 1 %}
		{% endif %}
		{% if settings.twitter_widget %}
			{% set blocksCount = blocksCount + 1 %}
		{% endif %}

		{% if settings.show_footer_fb_like_box and store.facebook %}

		<div class="{% if blocksCount == 1 %}col-md-6 col-md-offset-3 text-center{% elseif blocksCount == 2 %}col-md-6{% endif %}">
			<h2 class="title">{{"Estamos en Facebook" | translate}}</h2>
			<hr class="line m-half-top m-half-bottom" />
            <div class="home-facebook-container">
                {{ store.facebook | fb_page_plugin(340,200) }}
            </div>
		</div>
		{% endif %}
		{% if settings.twitter_widget %}
		<div class="{% if blocksCount == 1 %}col-md-6 col-md-offset-3 text-center{% elseif blocksCount == 2 %}col-md-6{% endif %}">
			<h2 class="title">{{"Estamos en Twitter" | translate}}</h2>
			<hr class="line m-half-top m-half-bottom" />
			{{ settings.twitter_widget | raw }}
		</div>
		{% endif %}
	</div>
</div>
