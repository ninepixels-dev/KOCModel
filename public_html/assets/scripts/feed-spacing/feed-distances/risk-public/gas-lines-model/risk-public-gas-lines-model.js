'use strict';

publicGasLinesModel.$inject = ['closeExcel', '$rootScope'];
function publicGasLinesModel(closeExcel, $rootScope) {
    return {
        link: function (scope, elem, attr, ctrl) {
            scope.doCalculation = function () {
                var data = [], size = 1;

                var tmpData = [];
                $('input').each(function () {
                    size++;
                    tmpData[$(this).attr('name')] = $(this).val();
                });

                for (var i = 1; i < size; i++) {
                    data.push(tmpData['data-' + i]);
                }

                scope.excelLoaded = false;
                $("#myModal").modal();
                $("#myModal").on('shown.bs.modal', function () {
                    var Excel = new ActiveXObject("Excel.Application");

                    Excel.Visible = false;
                    Excel.DisplayAlerts = false;

                    var Excel_File = Excel.Workbooks.Open("http://kuwait.ninepixels.rs/workbooks/gaslines_model_public.xlsx");
                    var inputSheets = Excel_File.Sheets("Gas pipeline input sheet");
                    var fireBallSheet = Excel_File.Sheets("Fire Ball");

                    angular.forEach(data, function (item, index) {
                        inputSheets.Cells(index + 1, 2).value = item;
                    });

                    // Add data to $rootScope for Well flowlines model
                    var releaseRate = [];
                    for (var i = 4; i < 104; i++) {
                        releaseRate.push(fireBallSheet.Cells(i, 5).value);
                    }
                    $rootScope.plantGasLinesModel = releaseRate;

                    // Open new file and paste results
                    var Excel_Templates = Excel.Workbooks.Open("http://kuwait.ninepixels.rs/workbooks/templates/Gas Line Results Public.xlsx");
                    var gasLineResults = Excel_Templates.Sheets("Gas_Lines_Data");

                    inputSheets.Range("B1", "B11").Copy;
                    gasLineResults.Range("B1", "B11").PasteSpecial;

                    inputSheets.Range("A1", "C17").Copy;
                    gasLineResults.Range("A1", "C17").PasteSpecial;

                    inputSheets.Range("A23", "F25").Copy;
                    gasLineResults.Range("A23", "F25").PasteSpecial;

                    inputSheets.ChartObjects("Chart 1").Chart.CopyPicture();

                    // Add new Sheet and paste picture of chart
                    var gasLinesTransect = Excel_Templates.Sheets.Add();
                    gasLinesTransect.name = "Gas_Lines_Transect";
                    gasLinesTransect.Pictures.Paste;

                    scope.name = $('input[name="data-1"]').val() + '.xlsx';

                    // Expand environment
                    var wshShell = new ActiveXObject("WScript.Shell");
                    var userProfile = wshShell.ExpandEnvironmentStrings("%USERPROFILE%\\Desktop\\" + scope.name);

                    scope.excelLoaded = true;
                    scope.url = userProfile;
                    scope.$apply();

                    // Save and close all files and excel
                    Excel_Templates.SaveAs(userProfile);

                    Excel_Templates.Close();
                    Excel_File.Close();

                    Excel = closeExcel.close(Excel);
                    Excel = null;

                    scope.closeModal = function () {
                        if (Excel) {
                            Excel = closeExcel.close(Excel);
                        }
                        $('#myModal').modal('hide');
                    };
                });
            };
        }

    };
}

angular.module('fieldSpacingTool.publicGasLinesModel', [])
        .directive('publicGasLinesModel', publicGasLinesModel);