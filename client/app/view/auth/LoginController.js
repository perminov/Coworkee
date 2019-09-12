Ext.define('App.view.auth.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authlogin',
    host: 'https://crm.devel.cariot.ru',
    init: function() {
        var me = this;

        // Call parent
        this.callParent(arguments);

        // Get initial options
        Ext.Ajax.request({url: this.host + '/crm/v1/options_pre'}).then(function(response, opts) {
            var opt = Ext.decode(response.responseText).options_pre;
            me.lookup('header').el.down('img').set({src: me.host.replace('crm.', '') + opt.LOGO});
            me.lookup('form').down('combobox').setStore({
                fields: ['title', 'alias'],
                data: function(lang) {
                    var data = [], i;
                    for (i = 0; i < lang.length; i++)
                        data.push({alias: lang[i], title: lang[i]});
                    return data;
                }(opt.LOCALE_AVAILABLE)
            });
            me.lookup('form').down('combobox').setValue(opt.LOCALE_DEFAULT);
        }, function(response, opts) {
            console.log('server-side failure with status code ' + response.status);
        });
    },

    onLoginTap: function() {
        var me = this,
            form = me.lookup('form'),
            values = form.getValues();

        form.clearErrors();

        Ext.Viewport.setMasked({ xtype: 'loadmask' });

        Ext.Ajax.request({
            url: 'https://devel.cariot.ru/data' + '/auth',
            method: 'POST',
            params: values,
            scope: this,
            callback: function(options, success, response){
                if (response.responseText === "lf") form.setErrors({username: 'Неверное имя пользователя и/или пароль'});
                else me.fireEvent('login', response.responseText);
                Ext.Viewport.setMasked(false);
            }
        });
    }
});
