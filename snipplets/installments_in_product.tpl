{% if product.show_installments and product.display_price %}
<div class="row-fluid">
    <div class="installments max_installments_container">
        {% set max_installments_without_interests = product.get_max_installments(false) %}
        {% if store.installments_on_steroids_enabled %}
            {% set max_installments_with_interests = product.get_max_installments %}
            {% if max_installments_with_interests %}
                <i class="fa fa-credit-card-alt installments_credit-icon pull-left d-inline opacity-80"></i>
                <div class="max-installments m-none-top d-inline">{{ "Hasta <strong class='installment-amount'>{1}</strong> cuotas" | t(max_installments_with_interests.installment, max_installments_with_interests.installment_data.installment_value_cents | money) }}</div>
            {% else %}
                <i class="fa fa-credit-card-alt installments_credit-icon pull-left d-inline opacity-80" style="display: none;"></i>
                <div class="max-installments m-none-top d-inline" style="display: none;">
                {% if product.max_installments_without_interests %}
                    {{ "Hasta <strong class='installment-amount'>{1}</strong> cuotas" | t(null, null) }}
                {% else %}
                    {{ "Hasta <strong class='installment-amount'>{1}</strong> cuotas" | t(null, null) }}
                {% endif %}
                </div>
            {% endif %}
        {% else %}
            {% if max_installments_without_interests %}
                    <i class="fa fa-credit-card-alt installments_credit-icon pull-left d-inline opacity-80"></i>
                    <div class="max_installments d-inline">{{ "<strong class='installment-amount'>{1}</strong> cuotas sin interés de <strong class='installment-price'>{2}</strong>" | t(max_installments_without_interests.installment, max_installments_without_interests.installment_data.installment_value_cents | money) }}</div>
            {% else %}
                {% set max_installments_with_interests = product.get_max_installments %}
                {% if max_installments_with_interests %}
                    <i class="fa fa-credit-card-alt installments_credit-icon pull-left d-inline opacity-80"></i>
                    <div class="max_installments d-inline">{{ "<strong class='installment-amount'>{1}</strong> cuotas de <strong class='installment-price'>{2}</strong>" | t(max_installments_with_interests.installment, max_installments_with_interests.installment_data.installment_value_cents | money) }}</div>
                {% else %}
                    <i class="fa fa-credit-card-alt installments_credit-icon pull-left d-inline opacity-80" style="display: none;"></i>
                    <div class="max_installments d-inline" style="display: none;">
                    {% if product.max_installments_without_interests %}
                        {{ "<strong class='installment-amount'>{1}</strong> cuotas sin interés de <strong class='installment-price'>{2}</strong>" | t(null, null) }}
                    {% else %}
                        {{ "<strong class='installment-amount'>{1}</strong> cuotas de <strong class='installment-price'>{2}</strong>" | t(null, null) }}
                    {% endif %}
                    </div>
                {% endif %}
            {% endif %}
        {% endif %}
    </div>
</div>
{% endif %}