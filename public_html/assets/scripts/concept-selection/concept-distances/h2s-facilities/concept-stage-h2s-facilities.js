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

            $('form').submit(function (e) {
                e.preventDefault();
                var h2sValue = $('input[name="h2s-value"]').val();
                var pValue = $('input[name="p-value"]').val();

                var result = h2sValue * Math.sqrt(pValue);

                $('.y').removeClass('active');
                $('.y[value="' + result + '"]').addClass('active');

                $('.result').html(result);
            });
        }
    };
}

angular.module('fieldSpacingTool.h2sFacilities', [])
        .directive('h2sFacilities', h2sFacilities);