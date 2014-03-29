define(['angular'], function(angular) {

    'use strict';

    var authenticationServices = angular.module('authenticationServices', ['ngResource']);

    authenticationServices.factory('UsersService', ['$resource', function($resource) {

        var url = 'http://localhost:9002/api/users';
        var paramDefaults = '';

        var actions = {

            createUser: { method: 'POST', url: url },
            authenticateUser: { method: 'POST', url: url + '/token' } 
        };

        return $resource(url, paramDefaults, actions);

    }]);

    return authenticationServices;
});
