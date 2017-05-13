<div class="container">
	<div itemscope itemtype="http://www.schema.org/WebPage" itemid="body">
		<ul class="breadcrumb-custom" itemprop="breadcrumb">
			<li>
				<a class="crumb" href="{{ store.url }}" title="{{ store.name }}">{{ "Inicio" | translate }}</a>
			</li>
			<li>
				<span class="separator">></span>
				<span class="crumb"><strong>{{ "Contacto" | translate }}</strong></span>
			</li>
		</ul>
	</div>
	<div class="row">
        <div class="col-md-12">
            <div class="section-title m-top text-center">
               <h1 class="title">{{ "Contacto" | translate }}</h1>
            </div>
        </div>
    </div>
	<div class="row">
		<div class="col-md-6">
			{% if product %}  
				<div class="bg-info bg-contact-product clearfix">
					<p>
						{{ "Usted está consultando por el siguiente producto:" | translate }} </br> {{ product.name | a_tag(product.url) }}
					</p>
					<img src="{{ product.featured_image | product_image_url('thumb') }}" title="{{ product.name }}" alt="{{ product.name }}" />
				</div>
			{% endif %}	
			{% if contact %}
				{% if contact.success %}
				<p class="bg-success">{{ "El mensaje ha sido enviado con éxito, muchas gracias." | translate }}</P>
				{% else %}
				<p class="bg-danger">{{ "Debes completar los datos de contacto." | translate }}</P>
				{% endif %}
			{% endif %}	
			<form class="contact-form" action="/winnie-pooh" method="post" onsubmit="$(this).attr('action', '');">
				<input type="hidden" value="{{ product.id }}" name="product"/>
                <input type="hidden" name="type" value="contact" />
				<div class="form-group">
					<input type="text" class="form-control" id="name" name="name" placeholder="{{ "Nombre" | translate }}:">
				</div>
				<div class="form-group">
					<input type="email" class="form-control" id="email"  name="email" placeholder="{{ "E-mail" | translate }}:">
				</div>
				<div class="form-group winnie-pooh">
					<label for="winnie-pooh"><h3>{{ "No completar este campo" | translate }}:</h3></label>
					<input type="text" class="form-control" id="winnie-pooh" name="winnie-pooh">
				</div>
				<div class="form-group">
					<input type="text" class="form-control" id="phone" name="phone" placeholder="{{ "Teléfono" | translate }} ({{ "Opcional" | translate }}):">
				</div>
				<div class="form-group">
					<textarea id="message" name="message" class="form-control" rows="7" placeholder="{{ "Mensaje" | translate }}:"></textarea>
				</div>	
				<button type="submit" class="normal-button" name="contact" value="{{ 'Enviar' | translate }}">{{ 'Enviar' | translate }}</button>
			</form>
		</div>
		<div class="col-md-6 contact-info">
			{% if store.contact_intro %}
			<p>{{ store.contact_intro }}</p>
			{% endif %}		
			<ul class="fa-ul">
			{% if store.phone %}
				<li><i class="fa-li fa fa-phone"></i> {{ store.phone }}</li>
			{% endif %}
			{% if store.email %}
				<li><i class="fa-li fa fa-envelope"></i> {{ store.email | mailto }}</li>
			{% endif %}
			{% if store.blog %}
				<li><i class="fa-li fa fa-comments"></i><a target="_blank" href="{{ store.blog }}">{{ "Visita nuestro Blog!" | translate }}</a></li>
			{% endif %}
			{% if store.address %}
				<li><i class="fa-li fa fa-map-marker"></i> {{ store.address }}</li>
			{% endif %}								
			</ul>
	        {% set show_map = settings.show_map_on_contact and store.address %}
			{% if show_map %}
			<div id="google-map"></div>
			{% endif %}
		</div>

	</div>
</div>