'use strict';

angular.module('simpleAngularTicker', []).
directive('ticker', function ($interval, $timeout) {
    return {

        restrict: 'A',
        scope: true,
        compile: function () {

            return function (scope, element, attributes) {
               
                $timeout(function(){
                    var timing,
                        timingEffect,
                        timingEffectDivideBy = 4,
                        isHovered = false,
                        innerTime,
                        start;

                    if (attributes.timing) {
                        timing = attributes.timing;
                        timingEffect = timing / timingEffectDivideBy;
                    } else {
                        timing = 5000;
                        timingEffect = timing / timingEffectDivideBy / timingEffectDivideBy * 2;
                    }

                    scope.$watch(element, function () {

                        $scope.news={}
                        $scope.types = ['hot'];         
                        $scope.subredit="worldnews";      
                        $scope.type="top";
                        var url="https://api.reddit.com/r/"+$scope.subredit+"/?jsonp=JSON_CALLBACK";
                        $http.jsonp(url).success(function(data) {
                          $scope.elements = [];
                          var dataset = data.data.children;
                          for (var i=0; i<dataset.length; i++ ){
                                $scope.elements.push(dataset[i].data); // response data 
                                // console.log('reddit', $scope.elements);
                              }       
                            });

                        var api = 'https://api.nytimes.com/svc/news/v3/content/all/all.jsonp?api-key=ccb58d5412a54799e82ad086c0387669:5:74719242&responce-format=.jsonp&callback=JSON_CALLBACK'; 
                                        $http.jsonp(api).success(function(data){
                                            // console.log('response', data)
                                            $scope.news = data.results;
                                            // console.log('news scope is', $scope.news)
                                        });

                        var list = element,
                            items = element.find('li'),
                            itemFirst;


                        if (items.length) {
                            list.addClass('active');

                            start = $interval(function () {

                                /*cancel the callback function for fade-out and makes the ticker steady.*/
                                if (isHovered) {
                                    $timeout.cancel(innerTime);
                                    return;
                                }

                                items = list.children('li');
                                itemFirst = angular.element(items[0]);

                                itemFirst.addClass('fade-out minus-margin-top');


                                $timeout(function () {
                                    itemFirst.removeClass('minus-margin-top');
                                    list.append(itemFirst);

                                    innerTime = $timeout(function () {
                                        items.removeClass('fade-out');
                                    }, timingEffect);

                                }, timingEffect);

                            }, timing);

                        } else {
                            console.warn('no items assigned to ticker! Ensure you have correctly assigned items to your ng-repeat.');
                        }

                    });

                    element.on('$destroy', function () {
                        $interval.cancel(start, 0);
                    });

                    /* 
                     *author - mayo
                     *checking for mouse enter the ticker region
                     */
                    element.on('mouseenter', function () {
                        isHovered = true;
                    });

                    /* 
                     *author - mayo
                     *checking for mouse exit the ticker region
                     */
                    element.on('mouseleave', function () {
                        isHovered = false;
                    });
                }, 5000);    
                

            };
        }


    };
});



