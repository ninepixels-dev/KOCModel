'use strict';

h2sFacilities.$inject = [];
function h2sFacilities() {
    return {
        link: function (scope, elem, attr, ctrl) {
            var chart = $('#h2s-chart .area');

            // X Axis
            var value = 10, step = 1;
            for (var i = 1; i < 10; i++) {
                chart.append(createLine('x xv-' + i + ' x-' + step, (value * 100 * i) / 100));
            }

            var value = 100;
            step++;
            for (var i = 1; i < 10; i++) {
                chart.append(createLine('x xv-' + i + ' x-' + step, (value * 100 * i) / 100));
            }

            var value = 1000;
            step++;
            for (var i = 1; i <= 10; i++) {
                chart.append(createLine('x xv-' + i + ' x-' + step, (value * 100 * i) / 100));
            }

            // Y Axis
            var value = 0.01;
            step = 1;
            for (var i = 1; i < 10; i++) {
                chart.append(createLine('y yv-' + i + ' y-' + step, (value * 100 * i) / 100));
            }

            var value = 0.1;
            step++;
            for (var i = 1; i < 10; i++) {
                chart.append(createLine('y yv-' + i + ' y-' + step, (value * 100 * i) / 100));
            }

            var value = 1;
            step++;
            for (var i = 1; i <= 10; i++) {
                chart.append(createLine('y yv-' + i + ' y-' + step, (value * 100 * i) / 100));
            }

            function createLine(axis, value) {
                return '<line class="' + axis + '" value="' + value + '" title="Value: ' + value + '"></line>';
            }

            $('input[name="h2s-value"]').change(function () {
                var val = $(this).val();

                if (val > 0 && val < 1) {
                    return true;
                }

                $(this).val('');
            });

            $('form').submit(function (e) {
                e.preventDefault();
                var h2sValue = $('input[name="h2s-value"]').val();
                var pValue = $('input[name="p-value"]').val();
                var result = h2sValue * Math.sqrt(pValue);
                var rounded = Math.round(result * 10) / 10;

                var parameters = {
                    a: {
                        650: 230.73,
                        300: 420.06,
                        100: 659.51,
                        30: 941.6
                    },
                    b: {
                        650: 1.1329,
                        300: 0.92,
                        100: 0.76,
                        30: 0.6297
                    }
                };

                $('.y').removeClass('active');
                $('.y[value="' + rounded + '"]').addClass('active');

                $('.result').html(rounded);

                angular.forEach(parameters.a, function (value, index) {
                    var partResult = parameters.a[index] * Math.pow(rounded, parameters.b[index]);
                    $('.result--' + index).html(Math.round(partResult));
                });

                scope.$apply(function () {
                    scope.additional = true;
                });
            });
        }
    };
}

blowouts50.$inject = [];
function blowouts50() {
    return {
        link: function (scope) {
            $('form').submit(function (e) {
                var h2sValue = $('input[name="h2s-value"]').val();

                var parameters = {
                    a: {
                        650: 2200,
                        300: 2200,
                        100: 3500,
                        30: 6000
                    },
                    b: {
                        650: 0.95,
                        300: 0.95,
                        100: 0.75,
                        30: 0.62
                    }
                };

                angular.forEach(parameters.a, function (value, index) {
                    var partResult = parameters.a[index] * Math.pow((h2sValue / 100), parameters.b[index]);
                    $('.result--' + index).html(Math.round(partResult));
                });

                scope.$apply(function () {
                    scope.additional = true;
                });
            });
        }
    };
}

blowouts100.$inject = [];
function blowouts100() {
    return {
        link: function (scope) {
            $('form').submit(function (e) {
                var h2sValue = $('input[name="h2s-value"]').val();

                var parameters = {
                    a: {
                        650: 2200,
                        300: 2200,
                        100: 3500,
                        30: 6000
                    },
                    b: {
                        650: 0.95,
                        300: 0.95,
                        100: 0.75,
                        30: 0.62
                    }
                };

                angular.forEach(parameters.a, function (value, index) {
                    var partResult = parameters.a[index] * Math.pow((h2sValue / 100), parameters.b[index]);
                    $('.result--' + index).html(Math.round(partResult));
                });

                scope.$apply(function () {
                    scope.additional = true;
                });
            });
        }
    };
}


angular.module('fieldSpacingTool.h2sFacilities', [])
        .directive('h2sFacilities', h2sFacilities)
        .directive('blowouts50', blowouts50)
        .directive('blowouts100', blowouts100);