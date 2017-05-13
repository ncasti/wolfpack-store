<div class="page-account container page">
    <div class="headerBox-Page">
        {% snipplet "breadcrumbs.tpl" %}
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="section-title m-top text-center">
               <h1 class="title">{{ "Crear cuenta" | translate }}</h1>
            </div>
        </div>
    </div>
    <hr class="featurette-divider">
    <div class="account-form-wrapper">
        <form id="login-form" action="" method="post" class="form-horizontal">
            {% if result.errors.name %}
                <div class="bg-danger c">{{ 'Debes ingresar tu nombre!' | translate }}</div>
            {% endif %}
            {% if result.errors.email == 'exists' %}
                <div class="bg-danger c">{{ 'Ya existe una cuenta para este email!' | translate }}</div>
            {% elseif result.errors.email %}
                <div class="bg-danger c">{{ 'Debes ingresar un email válido!' | translate }}</div>
            {% endif %}
            {% if result.errors.password == 'required' %}
                <div class="bg-danger c">{{ 'Debes ingresar tu contraseña!' | translate }}</div>
            {% endif %}
            {% if result.errors.password == 'confirmation' %}
                <div class="bg-danger c">{{ 'Las contraseñas no coinciden.' | translate }}</div>
            {% endif %}


            <div class="col-md-6">
                <div class="form-group">
                    <div class="col-md-10">
                        <input class="form-control" type="text" name="name" id="name" value="{{ result.name }}" placeholder="{{ 'Nombre' | translate }}" />
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-10">
                        <input class="form-control" autocorrect="off" autocapitalize="off" type="email" name="email" id="email" value="{{ result.email }}" placeholder="{{ 'Email' | translate }}" />
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-10">
                        <input class="form-control" type="text" name="phone" id="phone" value="{{ result.phone }}" placeholder="{{ 'Teléfono' | translate }} {{ '(opcional)' | translate }}" />
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-10">
                        <input class="form-control" type="password" name="password" id="password" placeholder="{{ 'Contraseña' | translate }}" autocomplete="off"/>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-10">
                        <input class="form-control" type="password" name="password_confirmation" id="password_confirmation" placeholder="{{ 'Confirmar Contraseña' | translate }}" autocomplete="off"/>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-10">
                        <input class="normal-button" type="submit" value="{{ 'Crear cuenta' | translate }}" />
                    </div>
                </div>
            </div>            
            {% if store_fb_app_id %}
                 <div class="col-md-6 text-center">
                    <i class="fa fa-facebook"></i>
                    <input class="big-button big-product-related-button facebook" type="button" value="Facebook Login" onclick="loginFacebook();" />
                </div>
            {% endif %}


        </form>
    </div>
</div>