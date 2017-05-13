<div class="page-account container page">
    <div class="headerBox-Page row">
        <div class="col-md-12 col-sm-12 col-xs-12">
            {% snipplet "breadcrumbs.tpl" %}
        </div>
        <div class="col-md-12">
            <div class="section-title m-top text-center">
               <h1 class="title">{{ "Mi cuenta" | translate }}</h1>
            </div>
        </div>
    </div>
    <hr class="featurette-divider">
    <div class="account-form-wrapper span6 offset3 sst">
        <form action="" method="post" class="form-horizontal">
            {% if result.errors.name %}
                <div class="bg-danger c">{{ 'Debes ingresar tu nombre!' | translate }}</div>
            {% endif %}
            {% if result.errors.address %}
                <div class="bg-danger c">{{ 'Debes ingresar tu dirección!' | translate }}</div>
            {% endif %}
            {% if result.errors.number %}
                <div class="bg-danger c">{{ 'Debes ingresar tu número!' | translate }}</div>
            {% endif %}
            {% if result.errors.floor %}
                <div class="bg-danger c">{{ 'Debes ingresar tu piso!' | translate }}</div>
            {% endif %}
            {% if result.errors.locality %}
                <div class="bg-danger c">{{ 'Debes ingresar tu localidad!' | translate }}</div>
            {% endif %}
            {% if result.errors.zipcode %}
                <div class="bg-danger c">{{ 'Debes ingresar tu código postal!' | translate }}</div>
            {% endif %}
            {% if result.errors.city %}
                <div class="bg-danger c">{{ 'Debes ingresar tu ciudad!' | translate }}</div>
            {% endif %}
            {% if result.errors.province %}
                <div class="bg-danger c">{{ 'Debes ingresar tu provincia!' | translate }}</div>
            {% endif %}
            {% if result.errors.country %}
                <div class="bg-danger c">{{ 'Debes ingresar tu país!' | translate }}</div>
            {% endif %}
            {% if result.errors.phone %}
                <div class="bg-danger c">{{ 'Debes ingresar tu teléfono!' | translate }}</div>
            {% endif %}
            <div class="form-group">
                <label class="control-label col-sm-4" for="name">{{ 'Nombre' | translate }}</label>
                <div class="col-sm-5">
                    <input class="form-control" type="text" name="name" id="name" value="{{ result.name | default(address.name) }}" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-4" for="address">{{ 'Dirección' | translate }}</label>
                <div class="col-sm-5">
                    <input class="form-control" type="text" name="address" id="address" value="{{ result.address | default(address.address) }}" />
                </div>
            </div>
            {% if current_language.country == 'BR' %}
                <div class="form-group">
                    <label class="control-label col-sm-4" for="number">{{ 'Número' | translate }}</label>
                    <div class="col-sm-5">
                        <input class="form-control" type="text" name="number" id="number" value="{{ result.number | default(address.number) }}" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label col-sm-4" for="floor">{{ 'Piso' | translate }}</label>
                    <div class="col-sm-5">
                        <input class="form-control" type="text" name="floor" id="floor" value="{{ result.floor | default(address.floor) }}" />
                    </div>
                </div>
                <div class="form-group">
                    <label class="control-label col-sm-4" for="locality">{{ 'Localidad' | translate }}</label>
                    <div class="col-sm-5">
                        <input class="form-control" type="text" name="locality" id="locality" value="{{ result.locality | default(address.locality) }}" />
                    </div>
                </div>
            {% endif %}
            <div class="form-group">
                <label class="control-label col-sm-4" for="zipcode">{{ 'Código Postal' | translate }}</label>
                <div class="col-sm-5">
                    <input class="form-control" type="text" name="zipcode" id="zipcode" value="{{ result.zipcode | default(address.zipcode) }}" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-4" for="city">{{ 'Ciudad' | translate }}</label>
                <div class="col-sm-5">
                    <input class="form-control" type="text" name="city" id="city" value="{{ result.city | default(address.city) }}" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-4" for="province">{{ 'Provincia' | translate }}</label>
                <div class="col-sm-5">
                    <input class="form-control" type="text" name="province" id="province" value="{{ result.province | default(address.province) }}" />
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-4" for="country">{{ 'País' | translate }}</label>
                <div class="col-sm-5">
                    <select class="form-control on-steroids" name="country" id="country">{{ country_options }}</select>
                </div>
            </div>
            <div class="form-group">
                <label class="control-label col-sm-4" for="phone">{{ 'Teléfono' | translate }}</label>
                <div class="col-sm-5">
                    <input class="form-control" type="text" name="phone" id="phone" value="{{ result.phone | default(address.phone) }}" />
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-offset-4 col-sm-5">
                    <input class="big-button big-product-related-button" type="submit" value="{{ 'Guardar cambios' | translate }}" />
                </div>
            </div>
        </form>
    </div>
</div>
