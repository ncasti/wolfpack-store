<div class="page-account container page">
    <div class="headerBox-Page row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            {% snipplet "breadcrumbs.tpl" %}
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="section-title m-top text-center">
               <h1 class="title">{{ 'Orden {1}' | translate(order.number) }}</h1>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="details-box col-md-4 col-sm-4 col-xs-12">
            {% if log_entry %}
                <h3>{{ 'Estado actual del envío' | translate }}:</h3><div>{{ log_entry }}</div>
            {% endif %}
            <h3>{{ 'Detalles' | translate }}</h3>
            <div><strong>{{'Fecha' | translate}}:</strong> {{ order.date | i18n_date('%d/%m/%Y') }}</div>

            <div><strong>{{'Estado' | translate}}:</strong> {{ (order.status == 'open'? 'Abierta' : (order.status == 'closed'? 'Cerrada' : 'Cancelada')) | translate }}</div>

            <div class="st"><strong>{{'Pago' | translate}}:</strong> {{ (order.payment_status == 'pending'? 'Pendiente' : (order.payment_status == 'authorized'? 'Autorizado' : (order.payment_status == 'paid'? 'Pagado' : (order.payment_status == 'voided'? 'Cancelado' : (order.payment_status == 'refunded'? 'Reintegrado' : 'Abandonado'))))) | translate }}</div>
            <div><strong>{{'Medio de pago' | translate}}:</strong> {{ order.payment_name }}</div>

            {% if order.address %}
                <div class="st"><strong>{{'Envío' | translate}}:</strong> {{ (order.shipping_status == 'fulfilled'? 'Enviado' : 'No enviado') | translate }}</div>

                <div><strong>{{ 'Dirección de envío' | translate }}:</strong></div>
                <div class="address">
                    {{ order.address | format_address }}
                </div>
            {% endif %}
        </div>
        <div class="order-box col-md-8 col-sm-8 col-xs-12">
            <h3>{{ 'Productos' | translate }}</h3>
            <table class="table">
                <thead>
                <tr>
                    <th>{{ 'Producto' | translate }}</th>
                    <th>{{ 'Precio' | translate }}</th>
                    <th>{{ 'Cantidad' | translate }}</th>
                    <th>{{ 'Total' | translate }}</th>
                </tr>
                </thead>
                <tbody>
                {% for item in order.items %}
                    <tr>
                        <td data-label="{{ 'Producto' | translate }}">{{ item.featured_image | product_image_url("tiny") | img_tag(item.name) }} {{ item.name }}</td>
                        <td data-label="{{ 'Precio' | translate }}">{{ item.unit_price | money }}</td>
                        <td data-label="{{ 'Cantidad' | translate }}" class="c">{{ item.quantity }}</td>
                        <td data-label="{{ 'Total' | translate }}" class="r">{{ item.subtotal | money_long }}</td>
                    </tr>
                {% endfor %}
                {% if order.shipping or order.discount %}
                    <tr class="oneliner">
                        <td class="r" colspan="3">{{ 'Subtotal' | translate }}:</td>
                        <td class="r">{{ order.subtotal | money_long }}</td>
                    </tr>
                {% endif %}
                {% if order.shipping %}
                    <tr class="oneliner">
                        <td class="r" colspan="3">{{ 'Costo de envío ({1})' | translate(order.shipping_name) }}:</td>
                        <td class="r">{{ order.shipping | money_long }}</td>
                    </tr>
                {% endif %}
                {% if order.discount %}
                    <tr class="oneliner">
                        <td class="r" colspan="3">{{ 'Descuento ({1})' | translate(order.coupon) }}:</td>
                        <td class="r success">-{{ order.discount | money_long }}</td>
                    </tr>
                {% endif %}
                <tr class="oneliner">
                    <td class="r" colspan="3"><strong>{{ 'Total' | translate }}:</strong></td>
                    <td class="r"><strong>{{ order.total | money_long }}</strong></td>
                </tr>
                </tbody>
            </table>
            <div class="order-actions">
                {% if order.pending %}
                    <a class="big-button big-product-related-button" href="{{ order.checkout_url | add_param('ref', 'orders_details') }}" target="_blank">{{ 'Realizar el pago >' | translate }}</a>
                {% endif %}
            </div>
        </div>
    </div>
    </div>
