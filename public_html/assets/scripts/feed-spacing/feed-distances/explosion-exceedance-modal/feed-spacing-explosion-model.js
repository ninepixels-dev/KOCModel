'use strict';

explosionModel.$inject = ['closeExcel'];
function explosionModel(closeExcel) {
    return {
        link: function (scope, elem, attr, ctrl) {
            scope.addFields = function (table, cloneTable) {
                $('table.' + table + ' tr.input-fields:last-of-type').clone().appendTo('table.' + table);
                if (cloneTable) {
                    $('table.' + cloneTable + ' tr.input-fields:last-of-type').clone().appendTo('table.' + cloneTable);
                }
                if (table === 'building-details') {
                    $('table.separation-distances th.input-header:last-of-type').clone().appendTo('table.separation-distances tr:not(.input-fields)');
                    $('table.separation-distances tr.input-fields').each(function () {
                        $('table.separation-distances tr.input-fields:last-of-type td.input-row:last-of-type').clone().appendTo($(this));
                    });
                }

                updateInputListeners();
            };

            // Updating similar fields
            function updateInputListeners() {
                $('table.cam-setup td:first-of-type input').change(function () {
                    var index = $(this).closest('tr').index() + 1;
                    $('table.separation-distances tr:nth-of-type(' + index + ') td:nth-of-type(1) input').val($(this).val());
                });
                $('table.separation-distances td:first-of-type input').change(function () {
                    var index = $(this).closest('tr').index() + 1;
                    $('table.cam-setup tr:nth-of-type(' + index + ') td:nth-of-type(1) input').val($(this).val());
                });

                $('table.building-details td:first-of-type input').change(function () {
                    var index = $(this).closest('tr').index() + 1;
                    $('table.separation-distances th:nth-of-type(' + index + ') input').val($(this).val());
                });
                $('table.separation-distances th input').change(function () {
                    var index = $(this).closest('th').index() + 1;
                    $('table.building-details tr:nth-of-type(' + index + ') td:nth-of-type(1) input').val($(this).val());
                });
            }

            updateInputListeners();

            scope.doCalculation = function () {
                scope.excelLoaded = false;
                $("#myModal").modal();
                $("#myModal").on('shown.bs.modal', function () {
                    var Excel = new ActiveXObject("Excel.Application");

                    Excel.Visible = false;
                    Excel.DisplayAlerts = false;

                    var Excel_File = Excel.Workbooks.Open("http://kuwait.ninepixels.rs/workbooks/exceedance_model.xlsm");

                    var solver = Excel.Addins("Solver Add-in");
                    Excel.Workbooks.Open(solver.FullName);
                    Excel.Workbooks(solver.Name).RunAutoMacros(1);

                    var inputSheets = Excel_File.Sheets("Input");

                    // Get Data from Cam Setup Table
                    var row, column;
                    $('table.cam-setup tr.input-fields').each(function (index) {
                        row = index + 5;
                        $(this).find('input, select').each(function (subIndex) {
                            column = subIndex + 1;
                            inputSheets.Cells(row, column).value = $(this).val();
                        });
                    });

                    var row, column;
                    $('table.building-details tr.input-fields').each(function (index) {
                        row = index + 9;
                        $(this).find('input:not(.ignore-field), select:not(.ignore-field)').each(function (subIndex) {
                            column = subIndex + 1;
                            inputSheets.Cells(column, row).value = $(this).val();
                        });
                    });

                    var row, column;
                    $('table.separation-distances tr.input-fields').each(function (index) {
                        row = index + 5;
                        $(this).find('input:not(.ignore-field)').each(function (subIndex) {
                            column = subIndex + 9;
                            inputSheets.Cells(row, column).value = $(this).val();
                        });
                    });

                    // Run Exceedance macro
                    Excel.Run("'exceedance_model.xlsm'!exceedance");

                    inputSheets.Range("A1", "R24").Copy;

                    // Open new file and paste results
                    var Excel_Templates = Excel.Workbooks.Open("http://kuwait.ninepixels.rs/workbooks/templates/Exceedance Results.xlsx");
                    var exceedanceData = Excel_Templates.Sheets("Exceedance_Data");

                    exceedanceData.Range("A1", "R24").PasteSpecial;

                    inputSheets.ChartObjects("Chart 2").Chart.CopyPicture();

                    // Add new Sheet and paste picture of chart
                    var exceedanceCurves = Excel_Templates.Sheets.Add();
                    exceedanceCurves.name = "Exceedance_Curves";
                    exceedanceCurves.Pictures.Paste;


                    // Expand environment
                    var wshShell = new ActiveXObject("WScript.Shell");
                    var userProfile = wshShell.ExpandEnvironmentStrings("%USERPROFILE%\\Desktop\\Exceedance Results.xlsx");

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

angular.module('fieldSpacingTool.explosionModel', [])
        .directive('explosionModel', explosionModel);