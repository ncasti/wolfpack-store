{% for item in navigation %}
        {% if item.subitems %}
        <div class="mobile-nav_list-item subitems">
            <li class="{{ item.current ? 'selected' : '' }} mobile-subitems-container">
                <a href="{{ item.url }}" {% if item.url | is_external %}target="_blank"{% endif %}>
                    {{ item.name }}
                </a>
                <li class="mobile-dropdown"><i class="fa fa-chevron-down"></i></li>

                <ul id="accordion">
                    {% snipplet "navigation-mobile.tpl" with navigation = item.subitems %}
                </ul>
             </li>
        </div>
        {% else %}
        <li class="mobile-nav_list-item {{ item.current ? 'selected' : '' }}">
            <a href="{{ item.url }}" {% if item.url | is_external %}target="_blank"{% endif %}>
                {{ item.name }}</a>
         </li>
        {% endif %}
{% endfor %}
