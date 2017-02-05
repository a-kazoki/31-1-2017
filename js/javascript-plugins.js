/*global angular, FB, console*/
// app js
var myApp = angular.module("myApp", ["ngRoute", "ngCookies"]);
window.fbAsyncInit = function () {
    "use strict";
    FB.init({
        appId      : '395476837465709',
        xfbml      : true,
        version    : 'v2.8'
    });
    FB.AppEvents.logPageView();
};
(function (d, s, id) {
    "use strict";
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return; }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

//routes js
myApp.config(["$routeProvider", function ($routeProvider) {
    "use strict";
    $routeProvider
        .when("/", {
            templateUrl : "views/login.html",
            controller : "homeCtrl"
        })
        .when("/signup", {
            templateUrl : "views/contact-create-account.html",
            controller : "registrationCtrl"
        })
        .when("/resetpassword", {
            templateUrl : "views/Reset-password.html",
            controller : "resetCtrl"
        })
        .when("/dashboard", {
            templateUrl : "views/dashboard.html",
            controller : "dashboardCtrl",
            authenticated : true
        })
        .when("/profile", {
            templateUrl : "views/profile.html",
            controller : "profileCtrl",
            authenticated : true
        })
        .otherwise("/", {
            templateUrl : "views/login.html"
        });
}]);
myApp.run(["$rootScope", "$location", "authFact", function ($rootScope, $location, authFact) {
    "use strict";
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if (next.$$route.authenticated) {
            var userAuth = authFact.getAccessToken();
            if (!userAuth) {
                $location.path("/");
            }
        }
    });
}]);

//RegistrationCtrl js
myApp.controller("registrationCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    
    $scope.registrar = function () {
        if ($scope.regpass === $scope.regpassConf) {
            console.log($scope.regname);
            console.log($scope.regemail);
            console.log($scope.regpass);
        /*var data = JSON.stringify({
            "Name": $scope.regname,
            "ImgURL" : "akdjhadkha",
            "Password" : $scope.regpass,
            "Login_Type": "1",
            "EMail": $scope.regemail

        });

        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/Charity/Api/User/Regesteration",
            data: data,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (response) {
                $scope.reply = response.data;
                console.log(response.data);
            }, function (reason) {
                $scope.error = reason.data;
                console.log(reason.data);

            });*/
        }
    };
    
    
    
}]);

//homeCtrl js
myApp.controller("homeCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    $scope.name = "Login Please";
    $scope.signUp = function () {$location.path("/signup"); };
    $scope.forgetpass = function () {$location.path("/resetpassword"); };
    
    $scope.UPsign = function () {
        
        var data = JSON.stringify({
            "User_ID" : "9C427DE4-CAEC-4806-97F7-D3368B6A591E",
            "Password" : "234",
            "Email" : "test@hotmail.com",
            "Device_Token" : "test"
        });
        
        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/autocare/Api/User/Login",
            data: data,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (response) {
                $scope.reply = response.data;
                console.log(response.data);
            }, function (reason) {
                $scope.error = reason.data;
                console.log(reason.data);
        
            });
    };
    
    $scope.FBLogin = function () {
        FB.login(function (response) {
            if (response.authResponse) {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', {fields: 'id,name,email,picture'}, function (response) {
                    console.log('Good to see you, ' + response.name + '.');
                    console.log(response);
                    $cookies.putObject('userData', response);
                    $cookies.put('userid', response.id);
                    $cookies.put('pic', response.picture.data.url);
                    var accessToken = FB.getAuthResponse().accessToken;
                    console.log(accessToken);
                    authFact.setAccessToken(accessToken);
                    $location.path("/dashboard");
                    $scope.$apply();
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    };
}]);

//resetCtrl js
myApp.controller("resetCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    
    $scope.resetpass = function () {
        var data = JSON.stringify({
            "User_ID": null,
            "Email" : "amino_libra@hotmail.com"
        });

        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/autocare/Api/User/ForgetPassword",
            data: data,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (response) {
                $scope.reply = response.data;
                console.log(response.data);
            }, function (reason) {
                $scope.error = reason.data;
                console.log(reason.data);
        
            });
    };
}]);

//dashboardCtrl js
myApp.controller("dashboardCtrl", ["$scope", "$location", "$cookies", function ($scope, $location, $cookies) {
    "use strict";
    var mainCookie = JSON.parse($cookies.get('userData'));
    var favoriteCookie = $cookies.get('userid');
    var favorite1Cookie = $cookies.get('pic');
    $scope.theid = favoriteCookie;
    $scope.thepic = favorite1Cookie;
    var allcookies = $cookies.getAll();
    console.log(mainCookie.email);
    console.log(favoriteCookie);
    console.log(allcookies);
    
    $scope.profile = function () {$location.path("/profile"); };
    
    $scope.logout = function () {
        $location.path("/");
        $cookies.remove("accessToken");
        $cookies.remove("userid");
        $scope.theid = "";
    };
}]);

//profileCtrl js
myApp.controller("profileCtrl", ["$scope", "$location", "$cookies", function ($scope, $location, $cookies) {
    "use strict";
    var mainCookie = JSON.parse($cookies.get('userData'));
    var favoriteCookie = $cookies.get('userid');
    var favorite1Cookie = $cookies.get('pic');
    $scope.uname = mainCookie.name;
    $scope.upic = mainCookie.picture.data.url;
    var allcookies = $cookies.getAll();
    console.log(mainCookie.email);
    console.log(favoriteCookie);
    console.log(allcookies);
    
    /*$scope.profile = function () {$location.path("/profile"); };
    
    $scope.logout = function () {
        $location.path("/");
        $cookies.remove("accessToken");
        $cookies.remove("userid");
        $scope.theid = "";
    };*/
}]);

//authFact js
myApp.factory("authFact", ["$cookies", function ($cookies) {
    "use strict";
    var authFact = {};
    authFact.setAccessToken = function (accessToken) {
        $cookies.put("accessToken", accessToken);
    };
    authFact.getAccessToken = function () {
        authFact.authToken = $cookies.get("accessToken");
        return authFact.authToken;
    };
    return authFact;
}]);