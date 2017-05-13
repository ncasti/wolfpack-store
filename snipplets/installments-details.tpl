<div class="installments installments_main-container js-installments-details-container d-inline-block full-width">
    <div class="horizontal-container installments_gateways-horizontal-container">
        <ul class="nav nav-tabs installments_gateways-tabs-container p-half-bottom m-half-bottom p-none-xs m-half-top-xs m-quarter-bottom-xs">
            {% for method, installments in installments_info %}
                <li id="method_{{ method }}" class="js-installments-gw-tab installments_pill-tab d-inline-block-xs m-quarter-bottom-xs f-none-xs {% if loop.first %}active{% endif %}" data-code="{{ method }}"><a href="#installment_{{ method }}_{{ installment }}" class="installments_pill-tab-link" data-toggle="tab">{{ method == 'paypal_multiple' ? 'PAYPAL' : (method == 'itaushopline'? 'ITAU SHOPLINE' : method | upper) }}</a></li>
            {% endfor %}
        </ul>
    </div>
    <div class="tab-content m-top-xs m-half-top {% if not store.installments_on_steroids_enabled %}m-bottom{% endif %} m-bottom-xs pull-left full-width">
        {% for method, installments in installments_info %}
            <div class="tab-pane{% if loop.first %} active{% endif %} js-gw-tab-pane" id="installment_{{ method }}_">
                <div class="full-width pull-left">
                    <!-- Installments improved -->
                    {% if store.installments_on_steroids_enabled %}
                        <h4 class="installments_subtitle m-half-bottom m-quarter-top m-none-top-xs">{{ 'Elegí una opción de pago' | translate}}</h4>
                        {% set first_installment_info = installments_interest_info[method]['cft'] %}
                        {% set found_credit_card = false %}
                        {% set found_direct_payment = false %}
                        {% for card,card_data in first_installment_info %}
                            {% if card_data.type == "cc" %}
                                {% set found_credit_card = true %}
                            {% elseif card_data.type == "direct" %}
                                {% set found_direct_payment = true %}
                            {% endif %}
                        {% endfor %}
                        {% if found_credit_card %}
                        <label class="installments_label m-quarter-bottom font-normal">{{'Tarjeta de crédito' | translate }}</label>
                        <div class="installments_credit-bank-container js-installments-credit-bank-container p-half-all p-quarter-top-xs pull-left full-width">
                            <div class="installments_group-info">
                                <ul class="js-installments-credit-cards-list installments_flags-tabs-container nav nav-tabs m-quarter-top-xs m-none-bottom">
                                    <!-- Credit cards tabs -->
                                    {% for card,card_data in first_installment_info %}
                                        {% if card_data.type == 'cc' %}
                                            <li id="js-installments-card-{{method}}-{{ card }}" class="installments-card js-installments-flag-tab js-installments-credit-tab installments_flag-tab d-inline-block-xs f-none-xs {% if loop.first %}active{% endif %}" data-type="{{ card_data.type }}" data-code="{{ card }}">
                                                    <a href="#credit_card_{{method}}_{{ card }}" class="installments_flag-tab-link" data-toggle="tab">
                                                        {{ card | payment_logo | img_tag('',{class: 'installments_credit-card-image'}) }}
                                                        <span class="installments_check-icon fa-stack">
                                                          <i class="fa fa-circle fa-stack-2x"></i>
                                                          <i class="fa fa-check fa-stack-1x fa-inverse"></i>
                                                        </span>
                                                    </a>
                                                </li>
                                        {% endif %}
                                    {% endfor %}
                                </ul>
                            </div>
                            <div class="tab-content">
                                <!-- Credit cards containers -->
                                {% for card,card_data in first_installment_info %}
                                    <div class="js-credit-cart-tab-pane tab-pane {% if loop.first %} active{% endif %} pull-left full-width" id="credit_card_{{method}}_{{ card }}" >
                                        {% if card_data.banks %}
                                            <div class="installments_group-info pull-left full-width installments_credit-cards-container m-half-top" {% if card_data.banks['generic'] is not null %}style="display: none"{% endif %}>
                                                <label class="font-normal">{{'Bancos con' | translate }} {{ card_data.name }}</label>
                                                <div class="installments_container">
                                                    <select data-card="{{ card }}" class="js-installments-bank-select m-none" {% if card_data.banks['generic'] is not null %}style="display:none;"{% endif %}>
                                                        {% if card_data.banks['generic'] is null %}
                                                            <option selected disabled>{{ 'Elegir' | translate }}</option>
                                                            {% for installment, installment_data in installments_info[method]|reverse(true) %}
                                                                {% if card_data.max_no_interest >= installment %}
                                                                    <optgroup label="{% if installment > 1 %}{{ installment }} {{ 'cuotas sin interés'|translate }}{% else %}{{ 'Otros bancos'|translate }}{% endif %}">
                                                                        {% for bank,bankdata in card_data['banks'] %}
                                                                            {% if (installments_interest_info[method]['cft'][card]['max_no_interest'] == installment and installments_interest_info[method]['cft'][card]['banks'][bank][installment] == 0) or (installments_interest_info[method]['cft'][card]['max_no_interest'] > installment and installments_interest_info[method]['cft'][card]['banks'][bank][installment] == 0 and installments_interest_info[method]['cft'][card]['banks'][bank][previous_installment] > 0) %}
                                                                                <option {% for installment_number, installment_data in installments_info[method] %} data-cft-{{ installment_number }}="{{ installments_interest_info[method]['cft'][card]['banks'][bank][installment_number] }}" data-tea-{{ installment_number }}="{{ installments_interest_info[method]['tea'][card]['banks'][bank][installment_number] }}" {% endfor %}>{{ bank }}</option>
                                                                            {% endif %}
                                                                        {% endfor %}
                                                                    </optgroup>
                                                                {% endif %}
                                                                {% set previous_installment = installment %}
                                                            {% endfor %}
                                                        {% else %}
                                                            <option selected {% for installment_number, installment_data in installments_info[method] %} data-cft-{{ installment_number }}="{{ installments_interest_info[method]['cft'][card]['banks']['generic'][installment_number] }}" data-tea-{{ installment_number }}="{{ installments_interest_info[method]['tea'][card]['banks']['generic'][installment_number] }}" {% endfor %}>generic</option>
                                                        {% endif %}
                                                    </select>
                                                    <div class="text-danger js-bank-not-selected-error m-quarter-top" style="display:none";>{{ 'Elegí un banco para poder elegir las cuotas' | translate }}</div>
                                                </div>
                                            </div>
                                            {% if card_data.banks['generic'] is not null and card_data.max_no_interest > 1 %}
                                                <div class="installments_group-info pull-left full-width installments_credit-cards-container m-half-top">
                                                    <label class="font-bold installments_label">¡{{ card_data.max_no_interest }} {{ "cuotas sin interés" | translate }}!</label>
                                                </div>
                                            {% endif %}
                                        {% endif %}
                                    </div>
                                {% endfor %}
                            </div>
                        </div>
                        {% endif %}
                        {% if found_direct_payment %}
                            <div class="installments_group-info installments-cash_container m-top pull-left full-width">
                                <label class="installments_label m-quarter-bottom font-normal">{{'Tarjeta de débito / Efectivo / Depósito o transferencia' | translate }}</label>
                                <ul class="installments_flags-tabs-container nav nav-tabs m-quarter-top-xs m-none-bottom">
                                    <!-- Cash tabs -->
                                    {% for card,card_data in first_installment_info %}
                                        {% if card_data.type != 'cc' %}
                                            <li class="installments-card js-installments-flag-tab js-installments-cash-tab installments_flag-tab d-inline-block-xs f-none-xs" data-type="dd" data-code="{{ card }}">
                                                <a href="#credit_debit_{{ card }}" class="installments_flag-tab-link js-installments-flag-tab" data-toggle="tab">
                                                    {{ card | payment_logo | img_tag('',{class: 'installments_credit-card-image'}) }}
                                                    <span class="installments_check-icon fa-stack">
                                                      <i class="fa fa-circle fa-stack-2x"></i>
                                                      <i class="fa fa-check fa-stack-1x fa-inverse"></i>
                                                    </span>
                                                </a>
                                            </li>
                                        {% endif %}
                                    {% endfor %}
                                </ul>
                            </div>
                        {% endif %}
                        <div class="installments-divider m-half-top m-half-bottom pull-left full-width"></div>
                        <!-- Installments final info -->
                        <div class="pull-left full-width js-installments-final-info">
                            <div class="installments_group-info js-installments-container pull-left full-width installments_installment-select-container m-half-bottom">
                                <h4 class="installments_subtitle m-half-bottom m-quarter-top m-none-top-xs">{{'Elegí la cantidad de cuotas' | translate }}</h4>
                                <span class="installments_label m-quarter-bottom">{{ 'Pagás' | translate }}</span>
                                <!-- Installments selects for each credit card -->
                                <div class="p-relative d-inline-block">
                                    {% for card,card_data in first_installment_info %}
                                            <select class="js-installment-select js-installment-multiple-select installment_select m-none js-installments-card-{{ card }} js-installments-card-{{method}}-{{ card }} {% if loop.first %}active{% endif %}" {% if not loop.first %}style="display:none;"{% endif %} {% if card_data.banks['generic'] is null %}disabled{% endif %}>
                                                <!-- Installments select -->
                                                {% for installment, data_installment in installments %}
                                                    <option value="js-installment-number-{{loop.index0}}" class="{% if loop.first %}js-amount-selected{% endif %} {% if data_installment.without_interests %}js-installment-without-int{% endif %}" data-number="{{ installment }}">
                                                        {{ installment }}
                                                        {% if store.country != 'BR' %}
                                                            {% if installment > 1 %}
                                                                {{'cuotas' | translate }}
                                                            {% else %}
                                                                {{'cuota' | translate }}
                                                            {% endif %}
                                                        {% endif %}
                                                    </option>
                                                {% endfor %}
                                            </select>
                                            <div class="js-installment-select-container p-absolute full-width full-height installments_disabled-select js-installments-card-{{method}}-{{ card }} {% if card_data.banks['generic'] is not null %}hidden{% endif %}" {% if not loop.first %}style="display:none;"{% endif %}></div>
                                    {% endfor %}
                                </div>
                                <!-- Installments prices -->
                                {% for installment, data_installment in installments %}
                                    {% set rounded_installment_value = data_installment.installment_value | round(2) %}
                                    {% set total_value = (data_installment.without_interests ? data_installment.total_value : installment * rounded_installment_value) %}
                                    {% set total_value_in_cents = total_value * 100 %}
                                     <span id="installment_{{ method }}_{{ installment }}" class="js-installment-number-{{loop.index0}} js-installment-price installment_text" data-method="{{ method }}" {% if not loop.first %}style="display:none";{% endif %}>
                                        {% if store.country != 'BR' %}
                                            {{ 'de' | translate }} 
                                        {% else %}
                                            x
                                        {% endif %}
                                        <span class="installment-price installment_price-accent font-bold" data-value="{{ data_installment.installment_value }}">{{ (rounded_installment_value * 100) | money }}</span>
                                    </span>
                                {% endfor %}
                                <span class="js-installment-without-int-text installment_text"> {{ 'sin interés' | translate }}</span>
                            </div>
                            <div class="js-installment-legal-info opacity-80 clear-both">
                                {% if method in ['mercadopago', 'todopago', 'payu', 'paypal_multiple'] %}
                                    <h2 class="installment_cft_text js-installment-cft-container font-normal pull-left m-half-right full-width-xs" style="display:none;">{{'CFT:' | translate}} <span class="js-installments-cft-value">0,00%</span></h2>
                                    <div class="d-inline-block">
                                        <p class="installment_text-small clear-both">{{'Precio en 1 pago:' | translate}}<strong class="js-installments-one-payment" data-value="{{  product.price/100 }}"> {{ product.price | money }}
                                            </strong>
                                        </p>
                                        <p class="js-installment-ptf-container installment_text-small clear-both" style="display:none;">{{'PTF:' | translate}} <strong class="js-installments-ptf">{{ product.price | money }}</strong></p>
                                        <p class="js-installment-tea-container installment_text-small m-quarter-left" style="display:none;">{{'TEA:' | translate}} <strong class="js-installments-tea">0,00%</strong></p>
                                    </div>
                                {% else %}
                                    <div class="d-inline-block">
                                        <p class="installment_text-small">{{'Precio en 1 pago:' | translate}}
                                            <strong class="js-installments-one-payment">{{ product.price | money }}
                                            </strong>
                                        </p>
                                         <p class="installment_text-small clear-both">{{'Precio final:' | translate}}
                                            <strong class="js-installments-one-payment"> {{ product.price | money }}
                                            </strong>
                                        </p>
                                    </div>
                                {% endif %}
                            </div>
                        </div>
                        <!-- Cash final info -->
                         <div class="pull-left full-width js-cash-final-info" style="display:none;">
                             <h4><span>{{'Pagás' | translate }}:</span>
                                <span class="js-installments-one-payment installment_price-accent">{{ product.price | money }}
                                </span>
                            </h4>
                        </div>
                        <!-- Close button -->
                        <div class="pull-left full-width">
                            <a href="#" class="normal-button installments_close-button js-installments-accept-button pull-right hidden-xs" data-dismiss="modal">{{ 'Aceptar' | translate }}</a>
                            <a href="#" class="normal-button installments_close-button js-installments-accept-button js-mobile-toggle-installments pull-right visible-xs" data-dismiss="modal">{{ 'Aceptar' | translate }}</a>
                        </div>
                    {% else %}
                        {% for installment, data_installment in installments %}
                            <div class="installments_installment-list-item m-quarter-bottom p-quarter-left" id="installment_{{ method }}_{{ installment }}">
                                {% set rounded_installment_value = data_installment.installment_value | round(2) %}
                                {% set total_value = (data_installment.without_interests ? data_installment.total_value : installment * rounded_installment_value) %}
                                {% set total_value_in_cents = total_value * 100 %}
                                <strong class="installment-amount">{{ installment }}</strong> {% if store.country == 'AR' %}cuota{% if installment > 1 %}s{% endif %} de{% else %}x{% endif %} <strong class="installment-price">{{ (rounded_installment_value * 100) | money }}</strong>
                                {% if data_installment.without_interests %} {{ 'sin interés' | t }}{% endif %}
                                {% if store.country == 'AR' and installment > 1 %}
                                    - Precio Final: <strong class="installment-total-price">
                                        {{ total_value_in_cents | money }}
                                    </strong>
                                {% endif %}
                            </div>
                        {% endfor %}
                    {% endif %}
                </div>
            </div>
        {% endfor %}
    </div>
</div>