define(['angular', 'app'], function(angular, app) {

    'use strict';

    return app.config(['$routeProvider', function($routeProvider) {

        $routeProvider.when('/', {

            templateUrl: 'js/modules/infrastructure/templates/index.html'
        })

        .when('/features', {

            templateUrl: 'js/modules/infrastructure/templates/features.html'
        })
        
        .when('/how-it-works', {

            templateUrl: 'js/modules/infrastructure/templates/how-it-works.html'
        })
        
        .when('/pricing', {

            templateUrl: 'js/modules/infrastructure/templates/pricing.html'
        })
        
        .when('/api', {

            templateUrl: 'js/modules/infrastructure/templates/api.html'
        })
        
        .when('/contact-us', {

            templateUrl: 'js/modules/infrastructure/templates/contact-us.html'
        })

        .when('/sign-in', {

            controller: 'AuthController',
            templateUrl: 'js/modules/authentication/templates/sign-in.html',
        })

        .when('/register', {

            controller: 'AuthController',
            templateUrl: 'js/modules/authentication/templates/register.html',
        })
        
        .when('/404', {

            templateUrl: 'js/modules/infrastructure/templates/errors/404.html'
        })
        
        .otherwise({

            redirectTo: '/404'
        });
    }]);
});
