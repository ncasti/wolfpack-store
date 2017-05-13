{# Single snipplet that works as credit cards example #}
<div id="wrapper-pay">
    <div class="row-fluid">
        <div class="container" data-tooltip="{{ "Vas a poder mostrar aquí los medios de pago y envío de tu tienda" | translate }}">
                {% if store.country == 'BR' %}
                <div class="span8">
                    <div class="payments">
                        {{ "visa" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "mastercard" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "amex" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "diners" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "mercadopago" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "pagseguro" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "moip" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                    </div>
                </div>
                <div class="span4">
                        <div class="shipping">
                            {{ "br/correios" | shipping_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                            {{ "br/jadlog" | shipping_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        </div>
                </div>
                {% else %}
                <div class="span8">
                    <div class="payments">
                        {{ "visa" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "mastercard" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "amex" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "diners" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "ar/pagofacil" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "ar/rapipago" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "ar/tarjeta-naranja" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        {{ "mercadopago" | payment_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                    </div>
                </div>
                <div class="span4">
                        <div class="shipping">
                            {{ "fedex" | shipping_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                            {{ "ups" | shipping_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                            {{ "ar/oca" | shipping_logo | img_tag('', {class : 'img-logo', height : 40}) }}
                        </div>
                </div>
                {% endif %}
        </div>
    </div>
</div>