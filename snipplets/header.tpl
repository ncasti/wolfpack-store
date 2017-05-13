<div class="header-bar">
    <div class="header-bar-top">
        <div class="container">
          <div class="row p-top-half p-bottom-half">
                <div class="mobile col-xs-2 col-sm-1 col-md-1">
                    <div class="menu-btn"><i class="fa fa-bars fa-2x"></i></div>
                </div>
                <div class="col-xs-1 col-sm-2 col-md-4 text-left hidden-xs hidden-sm">
                  <div class="searchbox">
                      <form action="{{ store.search_url }}" method="get" role="form">
                          <input class="text-input hidden-xs hidden-sm" type="text" name="q" placeholder="{{ 'Buscar' | translate }}"/>
                          <i class="fa fa-search"></i>
                          <input class="submit-button" type="submit" value=""/>
                      </form>
                  </div>
                </div>
                <div class="col-xs-5 col-sm-5 col-md-4 text-right text-mobile-left no-padding">
                  {% if languages | length > 1 %}
                      <div class="languages dropdown pull-right">
                          {% for language in languages %}
                              {% if language.active %}
                                  <a  class="btn dropdown-toggle" id="dropdownMenu1" data-toggle="dropdown">
                                      {{ language.country | flag_url | img_tag(language.name) }}
                                      <span class="caret"></span>
                                  </a>
                              {% endif %}
                          {% endfor %}
                          <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu1">
                              {% for language in languages %}
                                  <li role="presentation">
                                      <a role="menuitem" tabindex="-1" href="{{ language.url }}" class="{{ class }}">
                                          {{ language.country | flag_url | img_tag(language.name) }}<span>&nbsp{{ language.name }}</span>
                                      </a>
                                  </li>
                              {% endfor %}
                          </ul>
                      </div>
                  {% endif %}
                    {% if store.has_accounts %}
                        <div id="auth" class="pull-left">
                          <div class="hidden-xs hidden-sm col-der-top">
                            {% if not customer %}
                                {% if 'mandatory' not in store.customer_accounts %}
                                    {{ "Crear cuenta" | translate | a_tag(store.customer_register_url) }}
                                    <span>/</span>
                                {% endif %}
                                {{ "Iniciar sesión" | translate | a_tag(store.customer_login_url) }}
                            {% else %}
                                {{ "Mi cuenta" | translate | a_tag(store.customer_home_url) }}
                                <span>&nbsp;/&nbsp;</span>
                                {{ "Cerrar sesión" | translate | a_tag(store.customer_logout_url) }}
                            {% endif %}
                          </div>
                          <span class="visible-xs-inline visible-sm-inline">
                            {% if not customer %}
                                {% if 'mandatory' not in store.customer_accounts %}
                                <a href="{{ store.customer_register_url }}"><i class="fa fa-user-plus"></i></a>
                                    <span>&nbsp;/&nbsp;</span>
                                {% endif %}
                                <a href="{{ store.customer_login_url }}"><i class="fa fa-user"></i></a>
                            {% else %}
                              <a href="{{ store.customer_home_url }}"><i class="fa fa-user-plus"></i></a>
                                <span>&nbsp;/&nbsp;</span>
                              <a href="{{ store.customer_logout_url }}"><i class="fa fa-user-plus"></i></a>
                            {% endif %}
                          </span>
                        </div>
                    {% endif %}
                </div>
                  <div class="col-xs-5 col-sm-6 col-md-3 pull-right text-right p-right">
                      {% snipplet "cart.tpl" %}
                  </div>
            </div>
        </div>
    </div>
    <div id="mobile-search" class="row hidden-md hidden-lg">
      <form action="{{ store.search_url }}" method="get" role="form">
          <input class="text-input" type="text" name="q" placeholder="{{ 'Buscar' | translate }}"/>
          <i class="fa fa-search"></i>
          <input class="submit-button" type="submit" value=""/>
      </form>
    </div>
    <div class="hidden-sm hidden-md hidden-lg">
      {% if has_logo %}
        <div id="logo">
          {{ store.logo | img_tag | a_tag(store.url) }}
        </div>
        <div class="text-logo-mobile text-center hidden"><a href="{{ store.url }}">{{ store.name }}</a></div>
      {% else %}
         <div id="logo" class="hidden">
          {{ store.logo | img_tag | a_tag(store.url) }}
        </div>
        <div class="text-logo-mobile text-center"><a href="{{ store.url }}">{{ store.name }}</a></div>
      {% endif %}
    </div>
</div>
