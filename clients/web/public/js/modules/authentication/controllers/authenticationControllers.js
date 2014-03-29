define(['angular', '../services/authenticationServices'], function(angular) {

    'use strict';

    var authenticationControllers = angular.module('authenticationControllers', ['authenticationServices'])

    authenticationControllers.controller('AuthController', ['$scope', '$location', 'UsersService', function($scope, $location, UsersService) {

        function showErrorMessage(response) {

            $scope.showSuccessMessage = false;
            $scope.showErrorMessage = true;
            $scope.errorMessage = response.data;
        };

        function showSuccessMessage(response) {

            $scope.showErrorMessage = false;
            $scope.showSuccessMessage = true;
            $scope.successMessage = response;
            console.debug(response);
        };

        $scope.createUser = function() {

            var user = {

                name: $scope.name,
                username: $scope.username,
                password: $scope.password,
                organizationId: $scope.username,
                roleId: "call-center-agent",
            };

            var success = function(response) {

                $location.path('/');
            };

            UsersService.createUser(user, success, showErrorMessage);
        };

        $scope.authenticateUser = function() {

            var user = {

                username: $scope.username,
                password: $scope.password
            };

            UsersService.authenticateUser(user, showSuccessMessage, showErrorMessage);
        };

    }]);

    return authenticationControllers;
});
