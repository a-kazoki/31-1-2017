/*global $, angular, FB, console*/
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
            controller : "loginCtrl"
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
            
            var data = JSON.stringify({
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
                    $scope.regReply = response.data;
                    console.log(response.data);
                    console.log($scope.regReply.IsSuccess);
                    console.log($scope.regReply.ErrorMessage);
                    if ($scope.regReply.IsSuccess) {
                        $('#vercode').modal("show");
                    } else {
                        $('#vercodeerror').modal("show");
                    }
                }, function (reason) {
                    $scope.regError = reason.data;
                    console.log(reason.data);

                });
            
            
            
        }
    };
    $scope.verification = function () {
        
        console.log($scope.regReply.UserID);
        console.log($scope.verCode);
        
        
        var data = JSON.stringify({
            "User_ID" : $scope.regReply.UserID,
            "VerficationCode": $scope.verCode
        });

        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/Charity/Api/User/VerfiedAccnt",
            data: data,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (response) {
                $scope.verReply = response.data;
                console.log(response.data);
                if ($scope.verReply.IsSuccess) {
                    $('#vercode').modal("hide");
                    $location.path("/");
                } else {
                    $('#vercode').modal("hide");
                    $('#vercodeerror').modal("show");
                }
            }, function (reason) {
                $scope.verError = reason.data;
                console.log(reason.data);

            });
    };
    
    
    
}]);

//loginCtrl js
myApp.controller("loginCtrl", ["$scope", "authFact", "$location", "$cookies", "$http", function ($scope, authFact, $location, $cookies, $http) {
    "use strict";
    //signup page
    $scope.signUp = function () {$location.path("/signup"); };
    //forget password page
    $scope.forgetpass = function () {$location.path("/resetpassword"); };
    //user password login
    $scope.UPsign = function () {
        console.log($scope.UPpass);
        var data = JSON.stringify({
            "Email": $scope.UPemail,
            "Password": $scope.UPpass
        });
        
        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/Charity/Api/User/Login",
            data: data,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (response) {
                $scope.UPlogreply = response.data;
                console.log(response.data);
                if ($scope.UPlogreply.Is_Verified) {
                    console.log($scope.UPlogreply.Is_Verified);
                } else {
                    console.log($scope.UPlogreply.Is_Verified);
                    $('#unverlog').modal("show");
                }
            }, function (reason) {
                $scope.UPlogerror = reason.data;
                console.log(reason.data);
        
            });
    };
    //unverified login
    $scope.unverlog = function () {
        console.log($scope.UPlogreply.User_ID);
        console.log($scope.verCodelog);
        var data = {
            "User_ID" : $scope.UPlogreply.User_ID,
            "VerficationCode": $scope.verCodelog
        };
        
        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/Charity/Api/User/VerfiedAccnt",
            data: data,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (response) {
                $scope.unverlogReply = response.data;
                console.log(response.data);
                if ($scope.unverlogReply.IsSuccess) {
                    $('#unverlog').modal("hide");
                } else {
                    $('#unverlog').modal("hide");
                    $('#unverlogerror').modal("show");
                }
            }, function (reason) {
                $scope.unverlogError = reason.data;
                console.log(reason.data);

            });
    };
    //facebook login
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
    //forget pass send email
    $scope.forgetpass = function () {
        var data = JSON.stringify({
            "Email" : $scope.forgetpassemail
        });

        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/Charity/Api/User/ForgetPassword",
            data: data,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (response) {
                $scope.forgetreply = response.data;
                console.log(response.data);
                if ($scope.forgetreply.IsSuccess) {
                    $('#forgetpass').modal("show");
                } else {
                    $('#forgetpasserror').modal("show");
                }
            }, function (reason) {
                $scope.forgeterror = reason.data;
                console.log(reason.data);
        
            });
    };
    //reset the new pass
    $scope.resetpass = function () {
        var data = JSON.stringify({
            "Email": $scope.repassemail,
            "Password": $scope.repasspass,
            "ConfirmPassword": $scope.repassrepass,
            "VerficationCode": $scope.repassconfcode
        });

        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/Charity/Api/User/ResetPassword",
            data: data,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (response) {
                $scope.resetreply = response.data;
                console.log(response.data);
                if ($scope.resetreply.IsSuccess) {
                    $('#forgetpass').modal("hide");
                    $location.path("/");
                } else {
                    $('#resetpasserror').modal("show");
                }
            }, function (reason) {
                $scope.reseterror = reason.data;
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
    //profile page
    $scope.profile = function () {$location.path("/profile"); };
    //logout
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