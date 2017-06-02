/***************************

██████╗  ██████╗ ██╗   ██╗████████╗███████╗██████╗
██╔══██╗██╔═══██╗██║   ██║╚══██╔══╝██╔════╝██╔══██╗
██████╔╝██║   ██║██║   ██║   ██║   █████╗  ██████╔╝
██╔══██╗██║   ██║██║   ██║   ██║   ██╔══╝  ██╔══██╗
██║  ██║╚██████╔╝╚██████╔╝   ██║   ███████╗██║  ██║
╚═╝  ╚═╝ ╚═════╝  ╚═════╝    ╚═╝   ╚══════╝╚═╝  ╚═╝


***************************/

App.Router.reopen({
  rootURL: '/ember'
  ,location: 'history'
});

App.Router.map(function() {
    this.resource('precap', { path: '/:precap_id' }, function(){
        this.route('send');
        this.route('find');
        this.route('directory');
        this.route('settings');
    });
    //this.resource('precaps', { path: '/' });
});

/*
App.Router.reopen({
    notifyGoogleAnalytics: function() {
        return ga('send', 'pageview', {
            'page': this.get('url'),
            'title': this.get('url')
        });
    }.on('didTransition')
});
*/
