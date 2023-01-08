/*Blog Init*/
"use strict";
$(function () {
    let config = {
        dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"flip>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
        ordering: false,
        columnDefs: [{
            "searchable": false, "orderable": false, // "targets": [0,1,3,4,5,6,7,8,9]
        }],
        order: [2, 'asc'],
        language: {
            search: "",
            searchPlaceholder: "Search",
            info: "_START_ - _END_ of _TOTAL_",
            sLengthMenu: "View  _MENU_",
            paginate: {
                next: '<i class="ri-arrow-right-s-line"></i>', // or '→'
                previous: '<i class="ri-arrow-left-s-line"></i>' // or '←'
            }
        },
        drawCallback: function () {
            $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
            feather.replace();
        },
        data: [],
        columns: [{
            'data': 'level', render: (data, type, row, meta) => {
                return String.format(data);
            }
        }, {
            'data': 'description', render: (data, type, row, meta) => {
                return `<input type="text" min="0" class="form-control" name="group-level-description" placeholder="Group Description" value="${data}">`;
            }
        }, {
            'data': 'first_manager_description', render: (data, type, row, meta) => {
                return `<input type="text" min="0" class="form-control" name="group-level-first-manager-description" placeholder="1st Manager Description" value="${data}">`;
            }
        }, {
            'data': 'second_manager_description', render: (data, type, row, meta) => {
                return `<input type="text" min="0" class="form-control" name="group-level-second-manager-description" placeholder="2nd Manager Description" value="${data}">`;
            }
        }, {
            'className': 'action-center', 'render': (data, type, row, meta) => {
                return `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover group-level-del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
            }
        },]
    }

    function initDataTable(config) {
        /*DataTable Init*/
        let dtb = $('#datable-group-level');
        if (dtb.length > 0) {
            var targetDt = dtb.DataTable(config);
            /*Checkbox Add*/
            // var tdCnt = 0;
            // $('table tr').each(function () {
            //     $('<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="chk_sel_' + tdCnt + '"><label class="form-check-label" for="chk_sel_' + tdCnt + '"></label></span>').appendTo($(this).find("td:first-child"));
            //     tdCnt++;
            // });
            // $(document).on('click', '.del-button', function () {
            //     targetDt.rows('.selected').remove().draw(false);
            //     return false;
            // });
            $("div.blog-toolbar-left").html('<div class="d-xxl-flex d-none align-items-center"> <select class="form-select form-select-sm w-150p"><option selected>Select Template</option></select> <button class="btn btn-sm btn-light ms-2">Apply</button></div><div class="d-xxl-flex d-none align-items-center form-group mb-0"></div>');
            dtb.parent().addClass('table-responsive');


            /*Select all using checkbox*/
            var DT1 = dtb.DataTable();
            $(".check-select-all").on("click", function (e) {
                $('.check-select').attr('checked', true);
                if ($(this).is(":checked")) {
                    DT1.rows().select();
                    $('.check-select').prop('checked', true);
                } else {
                    DT1.rows().deselect();
                    $('.check-select').prop('checked', false);
                }
            });
            $(".check-select").on("click", function (e) {
                if ($(this).is(":checked")) {
                    $(this).closest('tr').addClass('selected');
                } else {
                    $(this).closest('tr').removeClass('selected');
                    $('.check-select-all').prop('checked', false);
                }
            });
        }
    }

    function loadDataTable() {
        let tb = $('#datable-group-level');
        $.fn.callAjax(tb.attr('data-url'), tb.attr('data-method')).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (data.hasOwnProperty('group_level_list')) config['data'] = data.group_level_list;
                    initDataTable(config);
                }
            },
        )
    }

    loadDataTable();
});


// Action on add row
$(document).on('click', '#btn-add-group-level', function () {
    tableGroupLevelAdd()
});


function tableGroupLevelAdd() {
    let tableApply = document.getElementById("datable-group-level");
    if (tableApply.tBodies[0].rows[0].children[0].classList[0] === "dataTables_empty") {
            tableApply.deleteRow(1);
        }
    let tableRowLen = tableApply.tBodies[0].rows.length;
    let level =  (tableRowLen + 1)
    let checkBoxId = `chk_sel_${(tableRowLen + 1)}`

    $('#datable-group-level tbody').append(`<tr> <td><span id="group-level">${level}</span></td> <td><input type="text" min="0" class="form-control" name="group-level-description" placeholder="Group Description"></td> <td><input type="text" min="0" class="form-control" name="group-level-first-manager-description" placeholder="1st Manager Description"></td> <td><input type="text" min="0" class="form-control" name="group-level-second-manager-description" placeholder="2nd Manager Description"></td> <td class=" action-center"><a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover group-level-del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#"><span class="btn-icon-wrap"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a></td> </tr>`);
    return false;
}


// Action on delete row
$(document).on('click', '.group-level-del-button', function (e) {
    // $(this).closest('tr').prev().remove();
    // $(this).closest('tr').next().remove();
    let currentRow = $(this).closest('tr')
    let currentLevel = Number(currentRow[0].children[0].innerText)
    let tableApply = document.getElementById("datable-group-level");
    let tableRowLen = tableApply.tBodies[0].rows.length;

    let idx = currentRow[0].rowIndex;

    // Reorder level of above rows from delete row
    for (let i = currentLevel; i < tableRowLen; i++) {
        let upperRow = currentRow[0].parentNode.rows[ (++idx - 1) ];
        let upperRowLevel = Number(upperRow.children[0].innerText)
        upperRow.children[0].innerText=String(upperRowLevel - 1)
    }

    currentRow.remove();
    return false;
});


// Save form group level
$(document).on('click', '.btn-save-group-level', function (e) {
    let groupLevelSave = {}
    let tableDataSave = []
    let rowDataSave = {}
    let keys = [
        "level",
        "description",
        "first_manager_description",
        "second_manager_description"
    ]
    let tableSave = document.getElementById("datable-group-level");
    let tableRowLen = tableSave.tBodies[0].rows.length;
    for (let idx = 0; idx < tableRowLen; idx++) {
        rowDataSave = {}
        let row = tableSave.rows[(idx+1)];
        let childrenLength = row.children.length
        for (let i = 0; i < (childrenLength - 1); i++) {
            let child = row.children[(i)]
            let childText = child.innerText
            let childValue = child.firstChild.value
            if (keys[i]) {
                if (childValue) {
                    rowDataSave[keys[i]] = childValue
                } else {
                    rowDataSave[keys[i]] = Number(childText)
                }
            }
        }
        tableDataSave.push(rowDataSave)
    }
    if (tableDataSave) {
        groupLevelSave['group_level_data'] = tableDataSave
    }

    let crf_token = $("input[name=csrfmiddlewaretoken]").val();
    $.fn.callAjax('/hr/level/api', "POST", groupLevelSave, crf_token)
        .then(
            (res) => {
                $.fn.notifyPopup({description: res.detail}, 'success');
                location.reload();
            },
            (err) => {
                $.fn.notifyPopup({description: err.detail}, 'failure');
            })
});