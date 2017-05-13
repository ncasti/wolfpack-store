    <div class="container m-bottom" id="banner-services">
        {% set num_banners_services = 0 %}
        {% for banner in ['banner_services_01', 'banner_services_02', 'banner_services_03'] %}
            {% set banner_services_title = attribute(settings,"#{banner}_title") %}
            {% set banner_services_description = attribute(settings,"#{banner}_description") %}
            {% set has_banner_services =  banner_services_title or banner_services_description %}
            {% if has_banner_services %}
                {% set num_banners_services = num_banners_services + 1 %}
            {% endif %}
        {% endfor %}

        {% for banner in ['banner_services_01', 'banner_services_02', 'banner_services_03'] %}
            {% set banner_services_title = attribute(settings,"#{banner}_title") %}
            {% set banner_services_description = attribute(settings,"#{banner}_description") %}
            {% set has_banner_services =  banner_services_title or banner_services_description %}
            {% if has_banner_services %}
                <div class="col-md-{% if num_banners_services == 1 %}12{% elseif num_banners_services == 2 %}6{% elseif num_banners_services == 3 %}4{% endif %} col-sm-{% if num_banners_services == 1 %}12{% elseif num_banners_services == 2 %}6{% elseif num_banners_services == 3 %}4{% endif %} col-xs-12 text-center">
                    <div class="banner-service-item">
                        <div class="service-icon m-bottom-half">
                            <i class="fa {%if loop.first %}fa-truck{% endif %}{%if loop.index == 2 %}fa-credit-card{% elseif loop.index == 3 %}fa-lock{% endif %}"></i>
                        </div>
                        <div class="service-text">
                            <h4>{{ banner_services_title }}</h4>
                            <p>{{ banner_services_description }}</p>
                        </div>
                    </div>
                </div>

            {% endif %}
        {% endfor %}
    </div>
