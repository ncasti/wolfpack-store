{% if pages.numbers %}
<ul class="pagination">
	{% if pages.previous %}
	<li><a href="{{ pages.previous }}">&larr;</a></li>
	{% else %}
	<li class="disabled"><a href="#">&larr;</a></li>
	{% endif %}
	{% for page in pages.numbers %}
	 	{% if page.selected %}
	 		<li class="active"><a href="{{ page.url }}">{{ page.number }} <span class="sr-only">(current)</span></a></li>
	 	{% else %}
			<li><a href="{{ page.url }}">{{ page.number }}</a></li>
	 	{% endif %}
	{% endfor %}
	{% if pages.next %}
	<li><a href="{{ pages.next }}">&rarr;</a></li>
	{% else %}
	<li class="disabled"><a href="#">&rarr;</a></li>
	{% endif %}	
</ul>
{% endif %}