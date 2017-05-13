{% set num_grids = 0 %}
{% for grids in ['desktop_grid_2', 'desktop_grid_3', 'desktop_grid_4'] %}
        {% set num_grids = num_grids + 1 %}
{% endfor %}
{% if num_grids >= 2 %}
  <div id="change-grid-btn" class="btn-group fixed-bottom pull-right hidden-xs {% if store.live_chat %}change-grid-olark{% endif %}" role="group">
    {% if settings.desktop_grid_2 %}
    <div class="btn-group" role="group">
      <a id="desktop_grid_2" class="btn active">
        <svg id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.9 11.1"><path id="XMLID_7_" class="st0" d="M0 0h6.1v5.2H0z"/><path id="XMLID_9_" class="st0" d="M6.8 0h6.1v5.2H6.8z"/><path id="XMLID_35_" class="st0" d="M0 5.9h6.1v5.2H0z"/><path id="XMLID_34_" class="st0" d="M6.8 5.9h6.1v5.2H6.8z"/></svg>
      </a>
    </div>
    {% endif %}
    {% if settings.desktop_grid_3 %}
    <div class="btn-group" role="group">
      <a id="desktop_grid_3" class="btn{% if not settings.desktop_grid_2 %} active{% endif %}">
        <svg id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.9 11.1"><path id="XMLID_7_" class="st0" d="M0 0h4v5.2H0z"/><path id="XMLID_9_" class="st0" d="M4.5 0h4v5.2h-4z"/><path id="XMLID_11_" class="st0" d="M8.9 0h4v5.2h-4z"/><path id="XMLID_35_" class="st0" d="M0 5.9h4v5.2H0z"/><path id="XMLID_34_" class="st0" d="M4.5 5.9h4v5.2h-4z"/><path id="XMLID_33_" class="st0" d="M8.9 5.9h4v5.2h-4z"/></svg>
      </a>
    </div>
    {% endif %}
    {% if settings.desktop_grid_4 %}
    <div class="btn-group" role="group">
      <a id="desktop_grid_4" class="btn{% if not settings.desktop_grid_3 and not settings.desktop_grid_2 %} active{% endif %}">
        <svg id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.9 11.1"><path id="XMLID_7_" class="st0" d="M0 0h3v5.2H0z"/><path id="XMLID_9_" class="st0" d="M3.3 0h3v5.2h-3z"/><path id="XMLID_11_" class="st0" d="M6.6 0h3v5.2h-3z"/><path id="XMLID_13_" class="st0" d="M9.9 0h3v5.2h-3z"/><path id="XMLID_35_" class="st0" d="M0 5.9h3v5.2H0z"/><path id="XMLID_34_" class="st0" d="M3.3 5.9h3v5.2h-3z"/><path id="XMLID_33_" class="st0" d="M6.6 5.9h3v5.2h-3z"/><path id="XMLID_14_" class="st0" d="M9.9 5.9h3v5.2h-3z"/></svg>
      </a>
    </div>
    {% endif %}
  </div>

  <script>
      // desktop
      $("#desktop_grid_2").click(function() {
        $("#change-grid-btn a").removeClass('active');
        $(this).addClass('active');

          $(".single-product").removeClass("col-sm-3 col-sm-4");
          $(".single-product").addClass("col-sm-6");
          $grid.masonry()
          $filtersgrid.masonry()
      });
      $("#desktop_grid_3").click(function() {
        $("#change-grid-btn a").removeClass('active');
        $(this).addClass('active');

          $(".single-product").removeClass("col-sm-6 col-sm-3");
          $(".single-product").addClass("col-sm-4");
          $grid.masonry()
          $filtersgrid.masonry()
      });
      $("#desktop_grid_4").click(function() {
        $("#change-grid-btn a").removeClass('active');
        $(this).addClass('active');

          $(".single-product").removeClass("col-sm-6 col-sm-4");
          $(".single-product").addClass("col-sm-3");
          $grid.masonry()
          $filtersgrid.masonry()
      });
  </script>
{% endif %}
