Ext.define('App.view.auth.Login', {
    extend: 'Ext.Container',
    xtype: 'authlogin',

    controller: 'authlogin',

    cls: 'auth-login',

    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },

    items: [{
        cls: 'auth-header',
        reference: 'header',
        html:
            '<img src width="150">'+
            '<div class="caption">Управление таксопарком</div>'
    }, {
        xtype: 'formpanel',
        reference: 'form',
        layout: 'vbox',
        ui: 'auth',

        items: [{
            xtype: 'textfield',
            name: 'username',
            placeholder: 'Пользователь',
            required: true
        }, {
            xtype: 'passwordfield',
            name: 'password',
            placeholder: 'Пароль',
            required: true
        }, {
            xtype: 'combobox',
            placeholder: 'Язык',
            displayField: 'title',
            valueField: 'alias'
        }, {
            xtype: 'button',
            text: 'Вход',
            iconAlign: 'right',
            iconCls: 'x-fa fa-angle-right',
            handler: 'onLoginTap',
            ui: 'action'
        }]
    }]
});
