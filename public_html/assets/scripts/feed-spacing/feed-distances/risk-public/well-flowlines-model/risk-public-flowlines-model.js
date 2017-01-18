'use strict';

publicFlowLinesModel.$inject = ['closeExcel'];
function publicFlowLinesModel(closeExcel) {
    return {
        link: function (scope, elem, attr, ctrl) {
            scope.doCalculation = function () {
                var data = [], size = 1;

                var tmpData = [];
                $('input[name]').each(function () {
                    size++;
                    tmpData[$(this).attr('name')] = $(this).val();
                });

                for (var i = 1; i < size; i++) {
                    data.push(tmpData['data-' + i]);
                }

                var releaseRateGaslineModel = $rootScope.plantGasLinesModel;
                var factorStep3 = $('.step-5-factor').val();

                scope.excelLoaded = false;
                $("#myModal").modal();
                $("#myModal").on('shown.bs.modal', function () {
                    var Excel = new ActiveXObject("Excel.Application");

                    Excel.Visible = false;
                    Excel.DisplayAlerts = false;

                    var Excel_File = Excel.Workbooks.Open("http://kuwait.ninepixels.rs/workbooks/well_lines_public.xlsx");
                    var inputSheets = Excel_File.Sheets("Well lines input sheet");
                    var fireBallSheet = Excel_File.Sheets("Fire Ball");

                    angular.forEach(data, function (item, index) {
                        inputSheets.Cells(index + 1, 2).value = item;
                    });

                    angular.forEach(releaseRateGaslineModel, function (item, index) {
                        fireBallSheet.Cells(index + 4, 5).value = (item * factorStep3);
                    });

                    // 5mm hole, 50mm hole
                    inputSheets.Cells(17, 2).value = $('.hole-50').val();
                    inputSheets.Cells(18, 2).value = $('.hole-5').val();

                    // Open new file and paste results
                    var Excel_Templates = Excel.Workbooks.Open("http://kuwait.ninepixels.rs/workbooks/templates/Well Results Public.xlsx");
                    var gasLineResults = Excel_Templates.Sheets("Well_Lines_Data");

                    inputSheets.Range("B1", "B11").Copy;
                    gasLineResults.Range("B1", "B9").PasteSpecial;

                    inputSheets.Range("B17", "B18").Copy;
                    gasLineResults.Range("B17", "B18").PasteSpecial;

                    inputSheets.ChartObjects("Chart 3").Chart.CopyPicture();

                    // Add new Sheet and paste picture of chart
                    var gasLinesTransect = Excel_Templates.Sheets.Add();
                    gasLinesTransect.name = "Well_Lines_Transect";
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

angular.module('fieldSpacingTool.publicFlowLinesModel', [])
        .directive('publicFlowLinesModel', publicFlowLinesModel);