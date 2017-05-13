{% if default_lang == 'pt' %}
    {% set color_name = 'Cor' %}
    {% set size_name = 'Tamanho' %}
{% endif %}
{% if default_lang == 'es' %}
    {% set color_name = 'Color' %}
    {% set size_name = 'Talle' %}
{% endif %}
{% if default_lang == 'en' %}
    {% set color_name = 'Color' %}
    {% set size_name = 'Size' %}
{% endif %}
<div id="toggle-filters"  style="display:none">
  <div id="filters-column" class="filters-grid" >
    <div class="row">
      {% if filter_colors %}
          <div class="filter-container col-md-4 p-top">
              <h4>{{ 'Color' | translate }}</h4>
              {% for name,color in insta_colors %}
                  <button type="button"
                          class="color-filter"
                          style="background-color: {{ color[name] }};"
                          title="{{ name }}"
                          onclick="LS.urlAddParam('{{ color_name|replace("'","%27") }}', '{{ name|replace("'","%27") }}');">
                  </button>
              {% endfor %}
          </div>
      {% endif %}
      {% if filter_more_colors %}
          <div class="filter-container col-md-4 p-top">
              {% if filter_colors %}
                  <h4>{{ 'Más colores' | translate }}</h4>
              {% else %}
                  <h4>{{ 'Color' | translate }}</h4>
              {% endif %}
              {% for color in other_colors %}
                  <button type="button"
                          class="size-filter"
                          onclick="LS.urlAddParam('{{ color_name|replace("'","%27") }}', '{{ color|replace("'","%27") }}');">{{ color }}
                  </button>
              {% endfor %}
          </div>
      {% endif %}
      {% if filter_sizes %}
          <div class="filter-container col-md-4 p-top">
              <h4>{{ 'Talle' | translate }}</h4>
              {% for size in size_properties_values %}
                  <button type="button"
                          class="size-filter"
                          onclick="LS.urlAddParam('{{ size_name|replace("'","%27") }}', '{{ size|replace("'","%27") }}');">{{ size }}
                  </button>
              {% endfor %}
          </div>
      {% endif %}

      {% for variants_property in variants_properties %}
          {% if filter_other %}
              <div class="filter-container col-md-4 p-top">
                  <h4>{{ variants_property }}</h4>
                  {% for value in variants_properties_values[variants_property] %}
                      <button type="button"
                              class="other-filter"
                              onclick="LS.urlAddParam('{{ variants_property|replace("'","%27") }}', '{{ value|replace("'","%27") }}');">{{value}}
                      </button>
                  {% endfor %}
              </div>
          {% endif %}
      {% endfor %}
    </div>
  </div>
</div>
