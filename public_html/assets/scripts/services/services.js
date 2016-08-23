'use strict';

googleSheets.$inject = ['$rootScope'];
function googleSheets($rootScope) {
    this.update = function (spreedsheat, rangeUpdate, values, rangeFetch, majorDimension) {

        var CLIENT_ID = '606900612363-ibsaconb28cuqtlfraa13l251efovaq6.apps.googleusercontent.com';
        var SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

        /**
         * Check if current user has authorized this application.
         */
        function checkAuth() {
            gapi.auth.authorize({
                'client_id': CLIENT_ID,
                'scope': SCOPES.join(' '),
                'immediate': true
            }, handleAuthResult);
        }

        /**
         * Handle response from authorization server.
         *
         * @param {Object} authResult Authorization result.
         */
        function handleAuthResult(authResult) {
            var authorizeDiv = document.getElementById('authorize-div');
            if (authResult && !authResult.error) {
                loadSheetsApi(updateData);
            } else {
                handleAuthClick();
            }
        }

        /**
         * Initiate auth flow in response to user clicking authorize button.
         *
         * @param {Event} event Button click event.
         */
        function handleAuthClick(event) {
            gapi.auth.authorize(
                    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
                    handleAuthResult);
            return false;
        }

        /**
         * Load Sheets API client library.
         */
        function loadSheetsApi(returnFunction) {
            var discoveryUrl = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
            gapi.client.load(discoveryUrl).then(returnFunction);
        }

        /**
         * Print the names and majors of students in a sample spreadsheet:
         * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
         */
        function fetchData() {
            gapi.client.sheets.spreadsheets.values.batchGet({
                spreadsheetId: spreedsheat,
                ranges: rangeFetch
            }).then(function (response) {
                $rootScope.$broadcast('fetchDataResult', response.result);
            }, function (response) {
                console.error(response);
            });
        }

        function updateData() {
            console.log(values);
            var returnedValues;
            if (!majorDimension) {
                majorDimension = 'COLUMNS';
                returnedValues = [values];
            } else {
                returnedValues = values;
            }

            gapi.client.sheets.spreadsheets.values.update({
                spreadsheetId: spreedsheat,
                range: rangeUpdate,
                valueInputOption: 'USER_ENTERED',
                majorDimension: majorDimension,
                values: returnedValues
            }).then(function (response) {
                loadSheetsApi(fetchData);
                console.warn('Spreedsheet updated');
            }, function (response) {
                console.error(response);
            });
        }

        checkAuth();
    };

    this.showChart = function (chartInputData, type) {
        if (!google.visualization) {
            google.charts.load('current', {'packages': ['corechart']});
            google.charts.setOnLoadCallback(drawChart);
        } else {
            drawChart();
        }

        function getData() {
            var convertedData = [],
                    maximumNumber = Math.min(chartInputData[0].values.length, chartInputData[1].values.length);

            for (var i = 0; i < chartInputData.length; i++) {
                angular.forEach(chartInputData[i].values, function (value, key) {
                    if (key >= maximumNumber) {
                        return false;
                    }

                    if (typeof convertedData[key] !== 'undefined') {
                        convertedData[key].push(Number(value));
                    } else if (i === 0) {
                        convertedData.push([Number(value)]);
                    }
                });
            }

            convertedData.unshift(['Data', 'Data']);

            return google.visualization.arrayToDataTable(convertedData);
        }

        function drawChart() {
            var options = {
                curveType: 'function',
                legend: {position: 'bottom'},
                vAxis: {format: 'scientific'}
            };

            var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

            if (type !== 'preconfigured') {
                chart.draw(getData(), options);
            } else {
                console.log('preconfigured');
                var data = google.visualization.arrayToDataTable(chartInputData);
                console.log(chartInputData);
                chart.draw(data, options);
            }
            
            $rootScope.$broadcast('chartImage', chart.getImageURI());
        }

    };

}

angular.module('fieldSpacingTool.services', [])
        .service('googleSheets', googleSheets);
