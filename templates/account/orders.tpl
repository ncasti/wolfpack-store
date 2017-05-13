<div class="page-account container page">
    <div class="headerBox-Page row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            {% snipplet "breadcrumbs.tpl" %}
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="section-title m-top text-center">
               <h1 class="title">{{ "Mi cuenta" | translate }}</h1>
            </div>
        </div>
    </div>
    <div class="container-fluid account-container m-left">
        <div class="customer-box col-md-4 col-sm-4 col-xs-12">
            <h3>{{ 'Datos Personales' | translate }}</h3>
            <div class="contact-data oh">
                <div class="profile-image">
                    <img class="portrait" src="https://www.gravatar.com/avatar/{{ customer.email | lower | md5 }}?s=80&d=mm" height="80" width="80" />
                </div>
                <div class="personal-data">
                    <div>{{customer.name}}</div>
                    <div>{{customer.email}}</div>
                    {% if customer.cpf_cnpj %}
                    <div><strong>{{ 'CPF / CNPJ' | translate }}:</strong> {{ customer.cpf_cnpj | format_cpf_cnpj }}</div>
                    {% endif %} {% if customer.phone %}
                    <div><strong>{{ 'Teléfono' | translate }}:</strong> {{ customer.phone }}</div>
                    {% endif %}
                    <div class="small">{{ 'Editar mis datos' | translate | a_tag(store.customer_info_url) }}</div>
                </div>
                {% if customer.default_address %}
                <div class="addresses">
                    <div class="address">
                        {{ customer.default_address | format_address_short }}
                    </div>
                    <div class="small">{{ 'Editar mis direcciones' | translate | a_tag(store.customer_addresses_url) }}</div>
                </div>
                {% endif %}
            </div>
        </div>
 <div id="orderBoxDesk" class="order-box col-md-8 col-sm-8 col-xs-12">
            <h3>{{ 'Mis Órdenes' | translate }}</h3>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>{{'Orden' | translate}}</th>
                        <th>{{'Fecha' | translate}}</th>
                        <th>{{'Estado' | translate}}</th>
                        <th>{{'Pago' | translate}}</th>
                        <th>{{'Envío' | translate}}</th>
                        <th>{{'Total' | translate}}</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {% for order in customer.orders %} {% set add_checkout_link = order.pending %}
                    <tr class="{% if order.status == 'open' %}warning{% elseif order.status == 'closed' %}success{% elseif order.status == 'cancelled' %}error{% endif %}">
                        <td data-label="{{'Orden' | translate}}"><a href="{{ store.customer_order_url(order) }}">#{{order.number}}</a>
                        </td>
                        <td data-label="{{'Fecha' | translate}}">{{ order.date | i18n_date('%d/%m/%Y') }}</td>
                        <td data-label="{{'Estado' | translate}}">{{ (order.status == 'open'? 'Abierta' : (order.status == 'closed'? 'Cerrada' : 'Cancelada')) | translate }}</td>
                        <td data-label="{{'Pago' | translate}}">{{ (order.payment_status == 'pending'? 'Pendiente' : (order.payment_status == 'authorized'? 'Autorizado' : (order.payment_status == 'paid'? 'Pagado' : (order.payment_status == 'voided'? 'Cancelado' : (order.payment_status == 'refunded'? 'Reintegrado' : 'Abandonado'))))) | translate }}</td>
                        <td data-label="{{'Envío' | translate}}">{{ (order.shipping_status == 'fulfilled'? 'Enviado' : 'No enviado') | translate }}</td>
                        <td data-label="{{'Total' | translate}}" {% if not add_checkout_link %}colspan="2" {% endif %}>{{ order.total | money }}</td>
                        {% if add_checkout_link %}
                        <td><a class="checkout-link" href="{{ order.checkout_url | add_param('ref', 'orders_list') }}" target="_blank">{{'Realizar el pago >' | translate}}</a>
                        </td>
                        {% endif %}
                    </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
                    <!-- Order box mobile beginnign Op 2 -->
    <div id="orderBoxMobile" class="order-box col-md-8 col-sm-8 col-xs-12 dos">
        <h3>{{ 'Mis Órdenes' | translate }}</h3> {% for order in customer.orders %} {% set add_checkout_link = order.pending %}
        <div class="wrapper">
            <div class="row no-gutter head">
                <div class="data-left">
                    <div>
                        <strong>{{'Orden' | translate}}:  <a href="{{ store.customer_order_url(order) }}">#{{order.number}} </a></strong>
                    </div>
                </div>
                <div class="data-right">
                    <div><small class="text-right">{{ order.date | i18n_date('%d/%m/%Y') }}</small>
                    </div>
                </div>
            </div>
            <div class="row no-gutter">
                <i class="fa fa-info mobile-order-info"></i> {{'Estado' | translate}}: {{ (order.status == 'open'? 'Abierta' : (order.status == 'closed'? 'Cerrada' : 'Cancelada')) | translate }}.
            </div>
            <div class="row no-gutter mobile-order-info">
                <i class="fa fa-truck"></i> {{'Envío' | translate}}: {{ (order.shipping_status == 'fulfilled'? 'Enviado' : 'No enviado') | translate }}.
            </div>
            <div class="row no-gutter prata">
                <strong>{{'Total' | translate}}</strong> {{ order.total | money }}
            </div>
            <div class="row no-gutter pagamento">
                <small><strong>{{'Pago' | translate}}: </strong><span class="{{ order.payment_status }}">{{ (order.payment_status == 'pending'? 'Pendiente' : (order.payment_status == 'authorized'? 'Autorizado' : (order.payment_status == 'paid'? 'Pagado' : (order.payment_status == 'voided'? 'Cancelado' : (order.payment_status == 'refunded'? 'Reintegrado' : 'Abandonado'))))) | translate }}</span></small>
            </div>
            <div class="row no-gutter last">
                <a class="checkout-link" href="{{ order.checkout_url | add_param('ref', 'orders_list') }}" target="_blank">{{'Realizar el pago >' | translate}}</a>
            </div>
        </div>
        {% endfor %}
    </div>
    </div>
</div>
