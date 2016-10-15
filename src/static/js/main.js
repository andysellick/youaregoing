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
    $scope.savedp = '';
    $scope.prevp = '';
    $scope.levels = [
        {   'time':17,
            'success':'',
            'fail':'',
            'moments':[
                {   'id':'here',
                    'cost':1,
                    'text':'You are sitting in a very confined space. There is a panel of buttons and dials in front of you. A roaring noise overwhelms all but a persistent beeping sound.',
                    'keys':['sitting','buttons','dials','noise','sound']
                },
                {   'id':'sitting',
                    'cost':3,
                    'text':'There is a harness over your shoulders and around your waist. There is a control stick between your knees. There is nothing else here.',
                    'keys':['here','control','harness']
                },
                {   'id':'harness',
                    'cost':3,
                    'text':'You pull at the straps holding you to the seat but they are securely fastened. There is nothing else here.',
                    'keys':['here']
                },
                {   'id':'control',
                    'cost':2,
                    'text':'You grab the joystick with both hands. You can move it up or down.',
                    'keys':['up','down']
                },
                {   'id':'up',
                    'cost':2,
                    'text':'You pull the control stick backwards as hard as you can. The noise outside increases in pitch as the nose of the plane lifts.',
                    'keys':['']
                },
                {   'id':'down',
                    'cost':5,
                    'text':'',
                    'keys':['']
                },
                {   'id':'buttons',
                    'cost':2,
                    'text':'There are a lot of buttons in front of you. Some of them have labels, but you can\'t read them because everything is shaking so much. There is nothing else here.',
                    'keys':['here']
                }
            ]
        }
    ];


	//on load, check localstorage for previous save
	$scope.init = function(){
        $scope.currlevel = $scope.levels[$scope.level];
        $scope.currmoment = $scope.currlevel.moments[$scope.currmoment];
        $scope.time = $scope.currlevel.time;
        console.log($scope.currlevel.time);
        $scope.outputPara();
	};

	$scope.outputPara = function(){
        var txt = $scope.currmoment.text;
        var words = txt.split(' ');
        var matchwords = $scope.currmoment.keys;
        //console.log(words);
        var ret = '';
        for(var i = 0; i < words.length; i++){
            var thisword = words[i].replace(/[^a-zA-Z ]/g, ''); //temporarily strip out any non-alpha chars
            //console.log(thisword);
            var check = matchwords.indexOf(thisword);
            if(check !== -1){
                ret = ret + ' <span class="word" data-ng-click="click(\'' + thisword + '\')">' + words[i] + '</span>';
            }
            else {
                ret = ret + ' ' + words[i];
            }
        }
        $scope.currp = '<p>' + ret + '</p>';
        $scope.savedp = '<p>' + txt + '</p>';
    };

    $scope.click = function(word) {
        var found = 0;
        //console.log(word);
        for(var x = 0; x < $scope.currlevel.moments.length; x++){
            if($scope.currlevel.moments[x].id === word){
                $scope.currmoment = $scope.currlevel.moments[x];
                $scope.time = Math.max(0,$scope.time - $scope.currlevel.moments[x].cost);
                found = 1;
                break;
            }
        }
        if(found){
            if($scope.time > 0){
                $scope.prevp = $scope.savedp;
                $scope.outputPara();
            }
            else {
                console.log('game over');
                $scope.currp = '';
            }
        }
    };

});
