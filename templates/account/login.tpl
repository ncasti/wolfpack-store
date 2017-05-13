<div class="page-account container page">
    <div class="headerBox-Page">
        {% snipplet "breadcrumbs.tpl" %}
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="section-title m-top text-center">
               <h1 class="title">{{ "Iniciar sesión" | translate }}</h1>
            </div>
        </div>
    </div>
    <hr class="featurette-divider">
    <div class="account-form-wrapper">
        <form id="login-form" action="" method="post" class="form-horizontal">

            <div class="col-md-6">
                <div class="form-group">
                    <div class="col-md-10">
                        <input class="form-control" autocorrect="off" autocapitalize="off" type="email" name="email" value="{{ result.email }}" placeholder="{{ 'Email' | translate }}" />
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-10">
                        <input class="form-control" type="password" name="password" placeholder="{{ 'Contraseña' | translate }}" autocomplete="off"/>
                        <div class="help-block"><a href="{{ store.customer_reset_password_url }}">{{ '¿Olvidaste tu contraseña?' | translate }}</a></div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="col-md-10">
                        <input class="normal-button" type="submit" value="{{ 'Iniciar sesión' | translate }}" />
                    </div>
                </div>
            </div>  
             {% if not result.facebook and result.invalid %}
                <div class="col-md-6">
                    <div class="bg-danger c">{{ 'El email o la contraseña son incorrectos.' | translate }}</div>
                </div>
            {% elseif result.facebook and result.invalid %}
                <div class="col-md-6">
                    <div class="bg-danger c">{{ 'Hubo un problema con el login de Facebook.' | translate }}</div>
                </div>
            {% endif %}
            {% if store_fb_app_id %}
                 <div class="col-md-6 text-center">
                    <i class="fa fa-facebook"></i>
                    <input class="big-button big-product-related-button facebook" type="button" value="Facebook Login" onclick="loginFacebook();" />
                </div>
            {% endif %}


        </form>
    </div>
</div>