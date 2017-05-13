<div class="row-fluid">
    <div class="container">
        {% set num_banners = 0 %}
        {% for banner in ['banner_home_01', 'banner_home_02', 'banner_home_03'] %}
            {% set banner_title = attribute(settings,"#{banner}_title") %}
            {% set banner_description = attribute(settings,"#{banner}_description") %}
            {% set banner_button_text = attribute(settings,"#{banner}_button_text") %}
            {% set has_banner =  banner_title or banner_description or banner_button_text or "#{banner}_image.jpg" | has_custom_image %}
            {% if has_banner %}
                {% set num_banners = num_banners + 1 %}
            {% endif %}
        {% endfor %}


        {% for banner in ['banner_home_01', 'banner_home_02', 'banner_home_03'] %}
            {% set banner_title = attribute(settings,"#{banner}_title") %}
            {% set banner_description = attribute(settings,"#{banner}_description") %}
            {% set banner_url = attribute(settings,"#{banner}_url") %}
            {% set banner_button_text = attribute(settings,"#{banner}_button_text") %}
            {% set banner_color = attribute(settings,"#{banner}_color") %}
            {% set banner_font_color = attribute(settings,"#{banner}_font_color") %}
            {% set banner_blank = attribute(settings,"#{banner}_blank")%}
            {% set has_banner =  banner_title or banner_description or (banner_url and banner_button_text) or "#{banner}_image.jpg" | has_custom_image %}
            {% if has_banner %}
                    <div class="span{% if num_banners == 1 %}12{% elseif num_banners == 2 %}6{% elseif num_banners == 3 %}4{% endif %}">
                    {% if banner_url and not banner_button_text %}
                        <a href="{{ banner_url }}" {% if banner_blank %}target="_blank"{% endif %}>
                    {% endif %}
                        <div class="wrap-banner {{ banner_color }} {{ banner_font_color }}">
                            {% if "#{banner}_image.jpg" | has_custom_image %}
                                {{ "#{banner}_image.jpg" | static_url | img_tag }}
                            {% endif %}
                            <div class="headerBox">
                                <div class="filter {{ banner_color }}"></div>
                                <div class="texto_banner">
                                    <h2>{{ banner_title }}</h2>
                                    <p>{{ banner_description }}</p>
                                    {% if banner_url and banner_button_text %}
                                        <a href="{{ banner_url }}" {% if banner_blank %}target="_blank"{% endif %}>{{ banner_button_text }}</a>
                                    {% endif %}
                                </div>
                            </div>
                        </div>
                    {% if banner_url and not banner_button_text %}
                        </a>
                    {% endif %}
                    </div>

            {% endif %}
        {% endfor %}
 	</div>
</div>