{% set selected_option = loop.first or cart.shipping_option == option.name %}
<div class="shipping-suboption m-half-top pull-left {{suboptions.name}}" {% if not selected_option %}style="display:none;"{% endif %}>
    {% if suboptions.options %}
        <select class="{% if selected_option and suboptions.required %}required{% endif %}" name="{{suboptions.name}}">
            <option {% if not suboptions.selected %}selected{% endif %} disabled>{{ suboptions.default_option | translate }}</option>
            {% for option in suboptions.options %}
                <option value="{{option.value}}">{{ option.name }}</option>
            {% endfor %}
        </select>
    {% else %}
        <input type="hidden" name="{{suboptions.name}}"/>
        <div>{{ suboptions.no_options_message | translate }}</div>
    {% endif %}
</div>