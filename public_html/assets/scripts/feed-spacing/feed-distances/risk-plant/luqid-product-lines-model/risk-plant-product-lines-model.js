'use strict';

plantProductLinesModel.$inject = ['closeExcel'];
function plantProductLinesModel(closeExcel) {
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
                    var Excel;

                    try {
                        Excel = GetObject("", "Excel.Application");
                    } catch (e) {
                        Excel = new ActiveXObject("Excel.Application");
                    }

                    Excel.Visible = false;
                    Excel.DisplayAlerts = false;

                    var Excel_File = Excel.Workbooks.Open("http://kuwait.ninepixels.rs/workbooks/liquid_product_pipelines.xlsx");
                    var inputSheets = Excel_File.Sheets("Input sheet");

                    angular.forEach(data, function (item, index) {
                        inputSheets.Cells(index + 1, 2).value = item;
                    });

                    // Open new file and paste results
                    var Excel_Templates = Excel.Workbooks.Open("http://kuwait.ninepixels.rs/workbooks/templates/Liquid Results.xlsx");
                    var liquidLinesData = Excel_Templates.Sheets("Liquid_Lines_Data");

                    inputSheets.Range("B1", "B12").Copy;
                    liquidLinesData.Range("B1", "B12").PasteSpecial;

                    inputSheets.Range("B16", "J19").Copy;
                    liquidLinesData.Range("B16", "J19").PasteSpecial;

                    inputSheets.ChartObjects("Chart 1").Chart.CopyPicture();

                    // Add new Sheet and paste picture of chart
                    var liquidLinesTransect = Excel_Templates.Sheets.Add();
                    liquidLinesTransect.name = "Liquid_Lines_Transect";
                    liquidLinesTransect.Pictures.Paste;

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

angular.module('fieldSpacingTool.plantProductLinesModel', [])
        .directive('plantProductLinesModel', plantProductLinesModel);