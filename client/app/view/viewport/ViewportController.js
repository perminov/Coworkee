Ext.define('App.view.viewport.ViewportController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.viewport',

    mixins: [ 'Ext.mixin.Mashup' ],

    requiredScripts: [ '/api' ],
    //requiredScripts: [ 'https://devel.cariot.ru/data/auth' ],

    listen: {
        controller: {
            '*': {
                login: 'onLogin',
                logout: 'onLogout',
                unmatchedroute: 'handleUnmatchedRoute'
            }
        }
    },

    routes: {
        //'login': 'handleLoginRoute'
    },

    onLaunch: function() {
        this.originalRoute = App.getApplication().getDefaultToken();
        //this.initDirect();
        this.restoreSession();
    },

    showView: function(xtype) {
        var view = this.lookup(xtype),
            viewport = this.getView();

        if (!view) {
            viewport.removeAll(true);
            view = viewport.add({
                xtype: xtype,
                reference: xtype
            });
        }

        viewport.setActiveItem(view);
    },

    showAuth: function() {
        this.showView('authlogin');
    },

    showMain: function() {
        this.showView('main');
    },

    // ROUTING

    handleLoginRoute: function() {
        var session = this.session;
        if (session && session.isValid()) {
            this.redirectTo('', {replace: true});
            return;
        }

        this.showAuth();
    },

    handleUnmatchedRoute: function(route) {
        var me = this;

        /*if (!me.session || !me.session.isValid()) {
            // There is no authenticated user, let's redirect to the login page but keep track
            // of the original route to restore the requested route after user authentication.
            me.originalRoute = route;
            me.redirectTo('login', {replace: true});
            return;
        }

        // There is an authenticated user, so let's simply redirect to the default token.
        var target = App.getApplication().getDefaultToken();
        Ext.log.warn('Route unknown: ', route);
        if (route !== target) {
            me.redirectTo(target, {replace: true});
        }*/
    },

    restoreSession: function() {
        var li = localStorage.getItem('LoggedIn'), cs = localStorage.getItem('csess');
        if (li == 'true' && cs != 'null') this.initiateSession(cs);
        else this.terminateSession();
    },

    initiateSession: function(token) {
        localStorage.setItem("LoggedIn", true);
        localStorage.setItem("csess", token);
        this.showMain();
    },

    terminateSession: function() {
        localStorage.setItem("LoggedIn", null);
        localStorage.setItem("csess", null);
        this.showAuth();
    },

    onLogin: function(token) {
        this.initiateSession(token);
        this.redirectTo(this.originalRoute, {replace: true});
    },

    onLogout: function() {
        var me = this,
            view = me.getView(),
            session = me.session;

        /*if (!session || !session.isValid()) {
            return false;
        }*/

        view.setMasked({ xtype: 'loadmask' });
        Ext.Ajax.request({
            url: 'https://devel.cariot.ru/data' + '/auth',
            method: 'DELETE',
            scope: this,
            callback: function(){
                me.originalRoute = Ext.History.getToken();
                me.terminateSession();
                view.setMasked(false);
                me.redirectTo('login', {replace: true});
            }
        });

        /*session.logout().catch(function() {
            // TODO handle errors
        }).then(function() {
            me.originalRoute = Ext.History.getToken();
            me.terminateSession();
            view.setMasked(false);
            me.redirectTo('login', {replace: true});
        });*/
    }
});

