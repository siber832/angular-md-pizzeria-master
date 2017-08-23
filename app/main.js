const application = angular.module("Pizzeria", ['ngMaterial', 'ngRoute', 'ngCookies'], function($httpProvider){
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
});

/**
 * Setting up the router configuration.
 */


application.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    // General
    $routeProvider
        .when('/', {
            redirectTo: '/pizzas'
        })
        .when('/pizzas', {
            templateUrl: '/angular-md-pizzeria-master/views/pizzas.html',
            controller: function($scope, $http) {
                $http.get('/api/traer-pizzas/', (response) => {
                    console.log("Respuesta: %o", response);
                }, (errRes) => {
                    console.log("Err Respuesta: %o", errRes);
                });
            }
        })
        .when('/pizza/:nombre', {
            template: 'El nombre de la pizza es <strong>{{ nomPicha }}</strong>',
            controller: function($scope, $routeParams) {
                $scope.nomPicha = $routeParams.nombre;
            }
        })
        .when('/nuevo_usuario', {
            templateUrl: '/angular-md-pizzeria-master/views/RegisterUser.html',
            controller: function($scope, $http, $mdToast) {

                $scope.submit = function() {
                    $http.post("http://localhost:50120/Pizzas/register", {
                        user : $scope.user,
                        password: $scope.password,
                        name: $scope.name,
                        surname: $scope.surname,
                        email: $scope.email
                    }).then( (response) => {
                        $mdToast.show($mdToast.simple().textContent('Hello!'));
                    }, (errResponse) => {
                        console.log("Respuesta Erroraaaa: %o", errResponse);
                    });

                }
            }
        })
        .when('/nuevo_comentario', {
            templateUrl: '/angular-md-pizzeria-master/views/new_coment.html',
            controller: function($scope, $http) {
                $scope.submit = function() {
                    $http.post("http://localhost:50120/Pizzas/imagen", {
                        user : $scope.user,
                        password: $scope.password,
                        name: $scope.name,
                        surname: $scope.surname,
                        email: $scope.email
                    }).then( (response) => {
                        alert(response.data)
                    }, (errResponse) => {
                        console.log("Respuesta Erroraaaa: %o", errResponse);
                    });

                }
            }
        })
        .when('/insertar_pizza', {
            templateUrl: '/angular-md-pizzeria-master/views/new_pizza.html',
            controller: function($scope) {
                $scope.setFile = function(element) {
                    $scope.currentFile = element.files[0];
                    var reader = new FileReader();

                    reader.onload = function(event) {
                        $scope.image_source = event.target.result
                        $scope.wei = 200
                        $scope.$apply()

                    }
                    // when the file is read it triggers the onload event above.
                    reader.readAsDataURL(element.files[0]);
                }
            }

        })
        .otherwise({
            redirectTo: '/'
        });

    // Acceso de usuarios
    $routeProvider
        .when('/acceder', {
            templateUrl: '/angular-md-pizzeria-master/views/acceder.html',
            controller: function($scope, $http) {
                $scope.login = function() {
                    $http.post("http://localhost:50120/Pizzas/login", {
                        user : $scope.username,
                        password: $scope.password
                    }).then( (response) => {
                        alert(response.data)
                    }, (errResponse) => {
                        console.log("Respuesta Erroraaaa: %o", errResponse);
                    });
                };
            }
        })
        .when('/registro', {
            templateUrl: '/angular-md-pizzeria-master/views/registro.html',
            controller: function() {

            }
        });
}]);