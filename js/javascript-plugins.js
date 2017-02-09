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
            
            var regdata = JSON.stringify({
                "Name": $scope.regname,
                "ImgURL" : null,
                "Password" : $scope.regpass,
                "Login_Type": "1",
                "EMail": $scope.regemail
            });
            $http({
                method: "POST",
                url: "http://yakensolution.cloudapp.net/Charity/Api/User/Regesteration",
                data: regdata,
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
    //preloged in routed inside
    var accessToken = $cookies.get("accessToken");
    authFact.setAccessToken(accessToken);
    $location.path("/dashboard");
    //signup page
    $scope.signUp = function () {$location.path("/signup"); };
    //forget password page
    $scope.forgetpass = function () {$location.path("/resetpassword"); };
    //user password login
    $scope.UPsign = function () {
        console.log($scope.UPpass);
        //verify login
        var logindata = JSON.stringify({
            "Email": $scope.UPemail,
            "Password": $scope.UPpass
        });
        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/Charity/Api/User/Login",
            data: logindata,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (response) {
                $scope.UPlogreply = response.data;
                console.log(response.data);
                if ($scope.UPlogreply.Is_Verified) {
                    $cookies.putObject('userData', response.data);
                    var accessToken = $scope.UPlogreply.User_ID;
                    console.log(accessToken);
                    authFact.setAccessToken(accessToken);
                    $location.path("/dashboard");
                } else if ($scope.UPlogreply.IsSuccess) {
                    console.log($scope.UPlogreply.Is_Verified);
                    $('#unverlog').modal("show");
                } else {
                    $('#wronginfo').modal("show");
                }
                var allcookies = $cookies.getAll();
                console.log(allcookies);
                var udata = JSON.parse($cookies.get('userData'));
                $scope.uid = udata.User_ID;
                console.log(udata.User_ID);
                var detdata = JSON.stringify({
                    "User_ID" : udata.User_ID
                });

                $http({
                    method: "POST",
                    url: "http://yakensolution.cloudapp.net/Charity/Api/User/UserDetails",
                    data: detdata,
                    headers: {'Content-Type': 'application/json'}
                })
                    .then(function (response) {
                        $scope.detailreply = response.data;
                        console.log(response.data);
                        $cookies.putObject('userDetail', response.data);
                    }, function (reason) {
                        $scope.detailerror = reason.data;
                        console.log(reason.data);

                    });
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
                    var data = JSON.stringify({
                        "Name": response.name,
                        "ImgURL" : response.picture.data.url,
                        "FacebookID" : response.id,
                        "Login_Type": "2",
                        "EMail": response.email
                    });
                    $http({
                        method: "POST",
                        url: "http://yakensolution.cloudapp.net/Charity/Api/User/Regesteration",
                        data: data,
                        headers: {'Content-Type': 'application/json'}
                    })
                        .then(function (response) {
                            $scope.fbReply = response.data;
                            $cookies.putObject('userData', response.data);
                            var accessToken = $scope.fbReply.UserID;
                            console.log(accessToken);
                            authFact.setAccessToken(accessToken);
                            $location.path("/dashboard");
                            var allcookies = $cookies.getAll();
                            console.log(allcookies);
                            var udata = JSON.parse($cookies.get('userData'));
                            $scope.uid = udata.UserID;
                            console.log(udata.UserID);
                            var detdata = JSON.stringify({
                                "User_ID" : udata.UserID
                            });

                            $http({
                                method: "POST",
                                url: "http://yakensolution.cloudapp.net/Charity/Api/User/UserDetails",
                                data: detdata,
                                headers: {'Content-Type': 'application/json'}
                            })
                                .then(function (response) {
                                    $scope.detailreply = response.data;
                                    console.log(response.data);
                                    $cookies.putObject('userDetail', response.data);
                                }, function (reason) {
                                    $scope.detailerror = reason.data;
                                    console.log(reason.data);

                                });
                        }, function (reason) {
                            $scope.fbError = reason.data;
                            console.log(reason.data);
                        });
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
myApp.controller("dashboardCtrl", ["$scope", "$location", "$cookies", "$http", function ($scope, $location, $cookies, $http) {
    "use strict";
    
    var allcookies = $cookies.getAll();
    console.log(allcookies);
    //profile page
    $scope.profile = function () {$location.path("/profile"); };
    //logout
    $scope.logout = function () {
        $location.path("/");
        $cookies.remove('accessToken');
        $cookies.remove('userData');
        $cookies.remove('userDetail');
    };
}]);

//profileCtrl js
myApp.controller("profileCtrl", ["$scope", "$location", "$cookies", "$http", function ($scope, $location, $cookies, $http) {
    "use strict";
    
    //dashboard page
    $scope.newsfeed = function () {$location.path("/dashboard"); };
    var allcookies = $cookies.getAll();
    console.log(allcookies);
    
    var mainCookie = JSON.parse($cookies.get('userDetail'));
    console.log(mainCookie);
    $scope.uname = mainCookie.Name;
    $scope.uemail = mainCookie.EMail;
    if (mainCookie.ImgURL === null) {
        $scope.upic = "images/avatar.png";
        console.log($scope.upic);
    } else {
        $scope.upic = mainCookie.ImgURL;
    }
    $scope.uaddress = mainCookie.Address;
    $scope.umobilnumber = mainCookie.MobileNumber;
    $scope.ugender = mainCookie.Gender;
    
    
    //update data
    var udata = JSON.parse($cookies.get('userData'));
    $scope.uid = udata.User_ID;
    
    $scope.updatedata = function () {
        var data = JSON.stringify({
            "UserID": $scope.uid,
            "Name": $scope.newname,
            "Password": $scope.newpass,
            "EMail": $scope.newemail,
            "Img": $scope.newimage,
            "MobileNumber": $scope.newmobile,
            "Address": $scope.newaddress,
            "Gender": $scope.newgender
        });
        console.log(data);

        $http({
            method: "POST",
            url: "http://yakensolution.cloudapp.net/Charity/Api/User/EditProfile",
            data: data,
            headers: {'Content-Type': 'application/json'}
        })
            .then(function (response) {
                $scope.updatereply = response.data;
                console.log(response.data);
                if (response.data.IsSuccess) {
                    $('#updatedata').modal("hide");
                    $location.path("/");
                } else {
                    $('#updatedata').modal("hide");
                    $('#updatedataerror').modal("show");
                }
            }, function (reason) {
                $scope.updateerror = reason.data;
                console.log(reason.data);

            });
    };

    //logout
    $scope.logout = function () {
        $location.path("/");
        $cookies.remove('accessToken');
        $cookies.remove('userData');
        $cookies.remove('userDetail');
    };
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