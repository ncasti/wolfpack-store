<div id="newsletter">
    <div class="row">
        <div class="col-md-4">
            <div class="newsletter-text">
            	<p class="line-1">{{ settings.newsletter_line1 }}</p>
                <p class="line-2">{{ settings.newsletter_line2 }}</p>
            </div>
        </div>
        
        <div class="col-md-8">
            <form role="form" method="post" action="/winnie-pooh-newsletter" onsubmit="$(this).attr('action', '');">
    			<input type="text" class="form-control" name="name" onfocus="if (this.value == '{{ "Nombre" | translate }}') {this.value = '';}" onblur="if (this.value == '') {this.value = '{{ "Nombre" | translate }}';}" value='{{ "Nombre" | translate }}' />
    			<input type="email" class="form-control" onfocus="if (this.value == '{{ "Tu Email" | translate }}') {this.value = '';}" onblur="if (this.value == '') {this.value = '{{ "Tu Email" | translate }}';}" value='{{ "Tu Email" | translate }}' name="email">
                <input type="hidden" name="message" value="{{ "Pedido de inscripción a newsletter" | translate }}" />
                <input type="hidden" name="type" value="newsletter" />
        		<input type="submit" name="contact" class="normal-button" value='{{ "Suscribirse" | translate }}' />
            </form>
        </div>
    </div>
    
    {% if contact %}
    <div class="row">
        {% if contact.success %}
            <div class="contact-ok">{{ "Se suscribió al newsletter correctamente." | translate }}</div>
        {% else %}
            <div class="contact-error">{{ "Ingrese su Email" | translate }}</div>
        {% endif %}
    </div>
    {% endif %}
</div>
