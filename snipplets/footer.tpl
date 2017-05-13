<div class="footer m-top">
  <hr/>
    <div class="footer-main">
        <div class="container">
            <div class="row text-center">
                <div class="col-md-12">
                    {% snipplet "navigation-foot.tpl" %}
                </div>
                <div class="col-md-12 payment-send">
                    {% for payment in settings.payments %}
                        {{ payment | payment_logo | img_tag('', {'height' : 30}) }}
                    {% endfor %}
                    {% for shipping in settings.shipping %}
                        {{ shipping | shipping_logo | img_tag('', {'height' : 30}) }}
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
    <div class="footer-bottom">
        <div class="container">
            <div class="row text-center">
                <div class="col-md-12">
                    {% if settings.footer_user_text %}
                        <p>{{ settings.footer_user_text }}</p>
                    {% endif %}
                    <p>{{ "Copyright {1} - {2}. Todos los derechos reservados." | translate( (store.business_name ? store.business_name : store.name) ~ (store.business_id ? ' - ' ~ store.business_id : ''), "now" | date('Y') ) }}</p>
                    {#
                    La leyenda que aparece debajo de esta linea de código debe mantenerse
                    con las mismas palabras y con su apropiado link a Tienda Nube;
                    como especifican nuestros términos de uso: http://www.tiendanube.com/terminos-de-uso .
                    Si quieres puedes modificar el estilo y posición de la leyenda para que se adapte a
                    tu sitio. Pero debe mantenerse visible para los visitantes y con el link funcional.
                    Os créditos que aparece debaixo da linha de código deverá ser mantida com as mesmas
                    palavras e com seu link para Nuvem Shop; como especificam nossos Termos de Uso:
                    http://www.nuvemshop.com.br/termos-de-uso. Se você quiser poderá alterar o estilo
                    e a posição dos créditos para que ele se adque ao seu site. Porém você precisa
                    manter visivél e com um link funcionando.
                    #}
                    {{ new_powered_by_link }}
                </div>
                {% if store.afip or ebit or settings.custom_seal_code or ("seal_img.jpg" | has_custom_image) %}
                    <div class="seals">
                        {% if store.afip %}
                            <div class="afip col-md-12">
                                {{ store.afip | raw }}
                            </div>
                        {% endif %}
                        {% if ebit %}
                            <div class="ebit">
                                {{ ebit }}
                            </div>
                        {% endif %}
                        {% if "seal_img.jpg" | has_custom_image or settings.custom_seal_code %}
                            <div class="custom-seals-container">
                                {% if "seal_img.jpg" | has_custom_image %}
                                    <div class="custom-seal custom-seal-img">
                                        {% if settings.seal_url != '' %}
                                        <a href="{{ settings.seal_url }}" target="_blank">
                                            {{ "seal_img.jpg" | static_url | img_tag }}
                                        </a>
                                        {% else %}
                                            {{ "seal_img.jpg" | static_url | img_tag }}
                                        {% endif %}
                                    </div>
                                {% endif %}
                                {% if settings.custom_seal_code %}
                                    <div class="custom-seal custom-seal-code">
                                        {{ settings.custom_seal_code | raw }}
                                    </div>
                                {% endif %}
                            </div>
                        {% endif %}
                    </div>
                {% endif %}
            </div>
        </div>
    </div>
</div>
