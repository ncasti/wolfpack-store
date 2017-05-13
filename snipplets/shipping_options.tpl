{% if options %}
<div class="cart-detail-shipping">
	<div>
		<p class="text-center">{{"Vea las opciones de envío para su código postal" | translate}}:</p>
	</div>
		<ul class="list-unstyled shipping-list">
			{% for option in options %}
                <li>
                   <input id="shipping-{{loop.index}}" class="shipping-method" data-price="{{option.cost.value}}" type="radio" value="{{option.code}}" {% if loop.first %}checked="checked"{% endif %} name="option" />
                    <label for="shipping-{{loop.index}}">
                        <span class="shipping-option">
                        	<img src="{{option.img_code | shipping_logo}}"/>
                        	<p>{{option.name}} - <strong>{{option.cost}}</strong></p>
                        </span>
                        <i class="fa fa-check"></i>
                        {% if option.suboptions is not empty %}
                            {% include "snipplets/shipping_suboptions/#{option.suboptions.type}.tpl" with {'suboptions': option.suboptions} %}
                    {% endif %}
                    </label>
                </li>
		    {% endfor %}
		</ul>

	{% else %}
	<div>
		<p>{{"No hay costos de envío para el código postal dado." | translate}}</p>
	</div>
</div>
{% endif %}

{# Don't remove this #}
<input type="hidden" name="after_calculation" value="1"/>
<input type="hidden" name="zipcode" value="{{zipcode}}"/>
