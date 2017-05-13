<div itemscope itemtype="http://www.schema.org/WebPage" itemid="body">
    <ul class="breadcrumb-custom m-bottom m-top" itemprop="breadcrumb">
		<li>
			<a class="crumb" href="{{ store.url }}" title="{{ store.name }}">{{ "Inicio" | translate }}</a>
		</li>
		{% for crumb in breadcrumbs %}
			<li>
				<span class="separator"> / </span>
				{% if crumb.last %}
					<span class="crumb"><strong>{{ crumb.name }}</strong></span>
				{% else %}
					<a class="crumb" href="{{ crumb.url }}" title="{{ crumb.name }}">{{ crumb.name }}</a>
				{% endif %}
			</li>
		{% endfor %}
    </ul>
</div>
