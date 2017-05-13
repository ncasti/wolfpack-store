{% if shipping_calculator_show %}
<div id="shipping-calculator" class="row text-center">
	<div class="col-md-12">
	    <div id="shipping-calculator-form" {% if shipping_calculator_variant and not shipping_calculator_variant.available %}style="display: none;" {% endif %} class="cart-detail-shipping">
		    <p>{{ "Ingrese aquí su código postal para calcular su costo de envío" | translate }}:</p>
		    <div class="col-md-4 col-sm-12 col-xs-12">
			    <input type="text" name="zipcode" id="shipping-zipcode" class="form-control" value="{{ cart.shipping_zipcode }}">
			    {% if shipping_calculator_variant %}
			    <input type="hidden" name="variant_id" id="shipping-variant-id" class="form-control" value="{{ shipping_calculator_variant.id }}">
			    {% endif %}
	    	</div>
	    	<div class="col-md-8 col-sm-12 col-xs-12">
			    <button id="calculate-shipping-button" class="normal-button col-md-9">{{ "Calcular costo de envío" | translate }}</button>
		    </div>
		   <p class="loading" style="display:none;"><i class="fa fa-refresh fa-spin"></i></p>
		   <p id="invalid-zipcode" style="display:none;"><i class="fa fa-exclamation-circle"></i> {{ "El código postal es inválido." | translate }}</p>
		</div>
	</div>
	<div id="shipping-calculator-response" style="display: none;"></div>
</div>
{% endif %}
