<div class="container">
	<div class="row">
        <div class="col-md-12">
            <div class="section-title m-top text-center">
               <h1 class="title">
                    <i class="fa fa-exclamation-triangle"></i>{{ "La página que estás buscando no existe." | translate }}
                </h1>
            </div>
        </div>
    </div>
	<div class="row text-center">
		<!-- <p class="text-404 text-center">404</p> -->
		<i class="text-404 fa fa-frown-o"></i>
		<p class="text-center">{{ "La página que estás buscando no existe." | translate }}</br>{{ "Quizás te interesen los siguientes productos." | translate }}</p>
		{% set related_products = sections.primary.products | take(4) | shuffle %}
		{% if related_products | length > 1 %}
		<div class="row">
			<div class="col-md-12">
				<div class="section-title">
					<h2 class="title">{{"Productos recomendados" | translate}}</h2>
					<hr class="line" />			
				</div>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<section id="grid" class="grid">
					<div class="row">
					{% for related in related_products %}
						{% include 'snipplets/single_product.tpl' with {product : related} %}
					{% endfor %}
					</div>
				</section>
			</div>
		</div>
		{% endif %}	
	</div>
</div>
