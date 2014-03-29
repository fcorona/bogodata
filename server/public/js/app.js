define(['angular', 'angularRoute', 'angularResource', 'modules/authentication/controllers/authenticationControllers', 'modules/authentication/services/authenticationServices'], 
       
       function (angular, authenticationControllers, authenticationServices) {
    
    'use strict';

    return angular.module('bogodata', [

        'ngRoute',
        'ngResource',

        'authenticationControllers',
        'authenticationServices'
    ]);
});
