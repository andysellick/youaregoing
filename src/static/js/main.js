/* globals angular */

angular.module('going', [])
//http://stackoverflow.com/questions/18157305/angularjs-compiling-dynamic-html-strings-from-database
.directive('dynamic', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.dynamic, function(html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
})
.controller('goingController',function($scope,$interval) {
    $scope.level = 0;
    $scope.currmoment = 0;
    $scope.time = 0;
    $scope.currtext = '';
    $scope.prevtext = '';

    $scope.levels = [
        {   'time':17,
            'moments':[
                {   'id':'start',
                    'cost':1,
                    'text':'You are sitting in a very confined space. There is a panel of buttons and dials in front of you. A roaring noise overwhelms all but a persistent beeping sound.',
                    'keys':['sitting','buttons','dials','noise']
                },
                {   'id':'sitting',
                    'cost':3,
                    'text':'You are strapped tightly in your seat. You pull at the belt straps over your shoulders and around your waist but they remain securely in place.',
                    'keys':[]
                },
                {   'id':'buttons',
                    'cost':2,
                    'text':'There are a lot of buttons in front of them. Some of them have labels, but you can\'t read them because everything is shaking so much.',
                    'keys':[]
                }
            ]
        }
    ];


	//on load, check localstorage for previous save
	$scope.init = function(){
        console.log('init');
        $scope.currlevel = $scope.levels[$scope.level];
        $scope.currmoment = $scope.currlevel.moments[$scope.currmoment];

        var txt = $scope.currmoment.text;
        var words = txt.split(' ');
        var matchwords = $scope.currmoment.keys;
        var ret = '';
        for(var i = 0; i < words.length; i++){
            var check = matchwords.indexOf(words[i]);
            if(check !== -1){
                ret = ret + ' <span class="word" data-ng-click="click(' + check + ')">' + words[i] + '</span>';
            }
            else {
                ret = ret + ' ' + words[i];
            }
        }
        //$scope.html = '<a ng-click="click(1)" href="#">Click me</a>';
        $scope.html = ret;
	};

    $scope.click = function(arg) {
        alert('Clicked ' + arg);
    };

});
