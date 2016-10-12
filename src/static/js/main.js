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
    //FIXME bug if keyword is last in sentence, doesn't highlight
    $scope.levels = [
        {   'time':17,
            'moments':[
                {   'id':'here',
                    'cost':1,
                    'text':'You are sitting in a very confined space. There is a panel of buttons and dials in front of you. A roaring noise overwhelms all but a persistent beeping sound.',
                    'keys':['sitting','buttons','dials','noise','sound']
                },
                {   'id':'sitting',
                    'cost':3,
                    'text':'You are strapped tightly in your seat. You pull at the belt straps over your shoulders and around your waist but they remain securely in place. There is nothing else here.',
                    'keys':['here']
                },
                {   'id':'buttons',
                    'cost':2,
                    'text':'There are a lot of buttons in front of them. Some of them have labels, but you can\'t read them because everything is shaking so much. You can go back to the start if you want.',
                    'keys':['start']
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
            var thisword = words[i].replace(/[^a-zA-Z ]/g, ""); //temporarily strip out any non-alpha chars
            //console.log(thisword);
            var check = matchwords.indexOf(thisword);
            if(check !== -1){
                ret = ret + ' <span class="word" data-ng-click="click(\'' + thisword + '\')">' + words[i] + '</span>';
            }
            else {
                ret = ret + ' ' + words[i];
            }
        }
        $scope.html = ret;
    };

    $scope.click = function(word) {
        //console.log(word);
        for(var x = 0; x < $scope.currlevel.moments.length; x++){
            if($scope.currlevel.moments[x].id === word){
                $scope.currmoment = $scope.currlevel.moments[x];
                $scope.time = Math.max(0,$scope.time - $scope.currlevel.moments[x].cost);
                break;
            }
        }
        if($scope.time > 0){
            $scope.outputPara();
        }
        else {
            console.log('game over');
            $scope.html = '';
        }
    };

});
