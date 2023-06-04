/*Blog Init*/
"use strict";
$(function () {
    let tb = $('#datatable_role_list');
    tb.DataTableDefault({
        ajax: {
            url: tb.attr('data-url'),
            type: tb.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && resp.data.hasOwnProperty('role_list')) config['data'] = data['role_list'];
                return [];
            },
        },
        columns: [
            {
                'render': (data, type, row, meta) => {
                    let currentId = "chk_sel_" + String(meta.row + 1)
                    return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
                }
            }, {
                'data': 'title',
                'render': (data, type, row, meta) => {
                    return `<div class="text-center">
                                <a href="#">
                                        <span class=""><b>` + row.title + `</b></span>  
                                </a>
                            </div>`;
                }
            }, {
                'data': 'abbreviation',
                render: (data, type, row, meta) => {
                    return `<span>` + row.abbreviation + `</span>`;
                }
            }, {
                'data': 'holder',
                render: (data, type, row, meta) => {
                    let element = ''
                    for (let i = 0; i < row.holder.length; i++) {
                        element += `<span class="badge badge-soft-primary w-30 mt-1 ml-1">` + row.holder[i].full_name + `</span>`;
                    }
                    if (row.holder.length > 3)
                        return `<div class="row text-center initial-wrap">` + element + `</div>`
                    else
                        return `<div class="row text-center"><center>` + element + `</center></div>`
                }
            }, {
                'className': 'action-center',
                'render': (data, type, row, meta) => {
                    let bt2 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Edit" href="#" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="edit"></i></span></span></a>`;
                    let bt3 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="#" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    return `<div class="text-center">` + bt2 + bt3 + `</div>`;
                }
            },
        ],
    });


    $("tbody").on("click", ".del-button", function () {
        if (confirm("Confirm Delete Role") === true) {
            let csr = $("input[name=csrfmiddlewaretoken]").val();
            let role_id = $(this).attr('data-id');
            let form = $('#form-delete');
            let role_data = {
                'csrfmiddlewaretoken': csr,
                'id': role_id
            }
            let data_url = form.attr('data-url');
            $.fn.callAjax(data_url + '/' + role_id + '/api', "DELETE", role_data, csr).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    console.log(resp);
                    $.fn.notifyPopup({description: "Thành công"}, 'success')
                    $.fn.redirectUrl(location.pathname, 1000);
                }
            }, (errs) => {
                $.fn.notifyPopup({description: "Thất bại"}, 'failure')
            },)
        }
    });

    $("tbody").on("click", ".edit-button", function () {
        let form = $('#form-delete');
        let data_url = form.attr('data-url') + '/' + $(this).attr('data-id');
        $(this).attr("href", data_url);
    });


    $(document).on('click', '.check-select', function () {
        if ($(this).is(":checked")) {
            $(this).closest('tr').addClass('selected');
        } else {
            $(this).closest('tr').removeClass('selected');
            $('.check-select-all').prop('checked', false);
        }
    });


    $(document).on('click', '.check-select-all', function () {
        $('.check-select').attr('checked', true);
        let table = $('#datatable_role_list').DataTable();
        let indexList = table.rows().indexes();
        console.log(indexList.length)
        if ($(this).is(":checked")) {
            for (let idx = 0; idx < indexList.length; idx++) {
                let rowNode = table.rows(indexList[idx]).nodes()[0];
                rowNode.classList.add('selected');
                rowNode.firstElementChild.children[0].firstElementChild.checked = true;
            }
            $('.check-select').prop('checked', true);
        } else {
            for (let idx = 0; idx < indexList.length; idx++) {
                let rowNode = table.rows(indexList[idx]).nodes()[0];
                rowNode.classList.remove("selected");
                rowNode.firstElementChild.children[0].firstElementChild.checked = false;
            }
            $('.check-select').prop('checked', false);
        }
    });
});
