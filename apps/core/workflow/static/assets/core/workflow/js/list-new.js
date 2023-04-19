class MainTableEvent{
    getHTMLChildTable(){
        // let $HTML = ''
        return $('.wf-template .child-table').html()
    }
    addNewBtnClick(pk){
        if (pk && pk.valid_uuid4()){
            $('.add_new_wf').on('click', function(){
                // encode pk and open new tab with param
                let url = $('#url-factory').attr('data-new') + '?app=' + pk
                window.open(url)
            });
        }
    };
}; // end Main table

class ChildTableEvent{
    getChildTableData(pk){
        let url = $('#url-factory').attr('data-child')
        $.fn.callAjax(url, 'GET', {application: pk})
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    this.loadTable(data);
                }
            )
    }
    loadTable(data){
        let dumpData = [{
            title: 'WF contact lên giám đốc khối',
            apply_day: '2023-03-29 11:26:14',
            is_active: true,
            all_request: 3,
            error_request: 1,
            id: "9840d538-da65-4d3f-90b0-7b54c65dc0d8"
        }]
        let _childTable = $('#table_workflow_list tr table.child-table').DataTable({
            data: dumpData,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
            },
            rowCallback: function (row, data) {
                // handle onclick btn
                $('.actions-btn a', row).off().on('click', function (e) {
                    e.stopPropagation();
                    actionsClick(row, data, e)
                })
            },
            columns: [
                {
                    targets: 0,
                    width: "35%",
                    class: "text-center",
                    render: (row, type, data) => {
                        return `<div class="d-flex align-items-center"><i class="fa font-4 fa-chevron-circle-down`
                        + ` mr-1 p-2 main-tb-ico"></i><span>${data.title}</span></div>`

                    }
                },
                {
                    targets: 1,
                    width: "15%",
                    class: "text-center",
                    render: (row, type, data) => {
                        return `<p>${moment(data.apply_day, 'YYYY-MM-DD').format('DD/MM/YYYY')}</p>`;
                    }
                },
                {
                    targets: 2,
                    width: "15%",
                    class: "text-center",
                    render: (data, type, row) => {
                        let isCheck = row.is_active ? 'checked' : ''
                        return `<div class="form-check form-check-sm">`
                            + `<input type="checkbox" class="form-check-input" ${isCheck}></div>`;
                    }
                },
                {
                    targets: 3,
                    width: "15%",
                    class: "text-center",
                    render: (data, type, row) => {
                        let all_request = row.all_request,
                            error_request = row.error_request,
                            error_html = '';
                        if (error_request > 0) error_html = `<span class="btn btn-soft-danger">${error_request}</span>`
                        return `<div><span class="mr-2">${all_request}</span>${error_html}</div>`;
                    }
                },
                {
                    targets: 4,
                    width: "20%",
                    class: "text-center",
                    render: (data, type, row) => {
                        let _id = row.order
                        if (row.hasOwnProperty('id') && row.id)
                            _id = row.id
                        let disabled = '';
                        return `<div class="actions-btn">
                                    <a class="btn btn-flush-dark flush-soft-hover ${disabled}"
                                       title="Edit"
                                       href="#"
                                       data-id="${_id}"
                                       data-action="edit">
                                        <span class="feather-icon"><i data-feather="edit"></i></span>
                                    </a>
                                    <a class="btn btn-flush-dark flush-soft-hover ${disabled}"
                                       title="Delete"
                                       href="#"
                                       data-id="${_id}"
                                       data-action="delete">
                                        <span class="feather-icon"><i data-feather="trash-2"></i></span>
                                    </a>
                                    <a class="btn btn-flush-dark flush-soft-hover ${disabled}"
                                       title="Delete"
                                       href="#"
                                       data-id="${_id}"
                                       data-action="tranfer">
                                        <span class="feather-icon"><i data-feather="send"></i></span>
                                    </a>
                                </div>`;
                    },
                }
            ],
        })
        $('#table_workflow_list tr table.child-table tbody').on('click', 'td .main-tb-ico', function (e) {
            e.stopPropagation();
            let tr = $(this).closest('tr');
            let row = _childTable.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            } else {
                // Open this row
                row.child($('.wf-template .grand-child-table').html()).show();
                row.child().find('table').attr('id', 'grand-child_' + row.data().id)
                // add event on click add new workflow
                GrandChildEvt.init(row.data().id)
                tr.addClass('shown');
            }
        });
    };

    init(pk){
        this.getChildTableData(pk);
    }
}

class GrandChildEvent{
    getDataList(pk){
        let url = $('#url-factory').attr('data-grand-child')
        $.fn.callAjax(url, 'GET', {application: pk})
            .then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    this.loadGrandChildTable(data);
                }
            )
    }
    loadGrandChildTable(data){
        let dumpData = [
            {
                creator: "Nguyen Truong An",
                posting_data: "2023-03-29 11:26:14",
                current_node: "Manager duyệt",
                status: true,
                id: "9840d538-da65-4d3f-90b0-7b54c65dc0d8",
            },
            {
                creator: "Nguyen An Nhien",
                posting_data: "2023-06-23 11:26:14",
                current_node: "Giám đốc duyệt",
                status: false,
                id: "ec08c0bd-20a7-4fa3-8d3e-77318173e543",
            }
        ]
        let _grandChildTable = $('#table_workflow_list tr table.grand-child-table').DataTable({
            data: dumpData,
            searching: false,
            ordering: false,
            paginate: false,
            info: false,
            drawCallback: function (row, data) {
                // render icon after table callback
                feather.replace();
            },
            rowCallback: function (row, data, idx) {
                // handle onclick btn
                $('.actions-btn a', row).off().on('click', function (e) {
                    e.stopPropagation();
                    // actionsClick(row, data, e)
                })
                $('td:eq(0)', row).html(idx + 1)
            },
            columns: [
                {
                    targets: 0,
                    width: "5%",
                    class: "text-center",
                    defaultContent: '',
                },
                {
                    targets: 1,
                    width: "35%",
                    class: "text-center",
                    render: (row, type, data) => {
                        return `<p>${data.creator}</p>`;
                    }
                },
                {
                    targets: 2,
                    width: "15%",
                    class: "text-center",
                    render: (row, type, data) => {
                        return `<p>${moment(data.posting_data, 'YYYY-MM-DD').format('DD/MM/YYYY')}</p>`;
                    }
                },
                {
                    targets: 3,
                    width: "15%",
                    class: "text-center",
                    render: (row, type, data) => {
                        return `<p>${data.current_node}</p>`;
                    }
                },
                {
                    targets: 4,
                    width: "15%",
                    class: "text-center",
                    render: (row, type, data) => {
                        let val_txt = data.status ? 'Ok' : 'Error'
                        let val_cls = data.status ? 'success' : 'danger'
                        return `<span class="btn btn-soft-${val_cls}">${val_txt}</span>`;
                    }
                },
                {
                    targets: 4,
                    width: "15%",
                    class: "text-center",
                    render: (data, type, row) => {
                        let _id = row.order
                        if (row.hasOwnProperty('id') && row.id)
                            _id = row.id
                        let disabled = '';
                        return `<div class="actions-btn">
                                    <a class="btn btn-flush-dark flush-soft-hover ${disabled}"
                                       title="Delete"
                                       href="#"
                                       data-id="${_id}"
                                       data-action="tranfer">
                                        <span class="feather-icon"><i data-feather="send"></i></span>
                                    </a>
                                </div>`;
                    },
                }
            ],
        })
    }
    init(pk){
        this.getDataList(pk)
    }
}
let MainEvt = new MainTableEvent();
let ChildEvt = new ChildTableEvent();
let GrandChildEvt = new GrandChildEvent()
$(function () {
    // declare main variable
    let $table = $('#table_workflow_list');
    let LIST_URL = $table.attr('data-url');
    let sty_mode = {
        0: 'danger',
        1: 'success',
        2: 'warning',
    }
    let txt_mode = {
        0: $('.wf-mode a:nth-child(1)').text(),
        1: $('.wf-mode a:nth-child(2)').text(),
        2: $('.wf-mode a:nth-child(3)').text(),
    }
    let error_map = {
        0: 'danger',
        1: 'success',
    };

    // run main table list
    let _mainTable = $table.DataTableDefault({
        ajax: {
            url: LIST_URL,
            type: "GET",
            dataSrc: 'data.workflow_list',
            data: function (params) {
                params['is_ajax'] = true;
                return params
            },
            error: function (jqXHR) {
                $table.find('.dataTables_empty').text(jqXHR.responseJSON.data.errors)
            }
        },
        columns: [
            {
                targets: 0,
                width: "40%",
                render: (row, type, data) => {
                    return `<div class="d-flex align-items-center"><i class="fa font-4 fa-chevron-circle-down`
                        + ` mr-1 p-2 main-tb-ico"></i><span>${data.title}</span></div>`

                }
            },
            {
                targets: 1,
                width: "25%",
                render: () => {
                    let mode = 1;
                    return `<div class="d-flex justify-content-between align-items-center"><button type="button" `
                        + `class="btn btn-soft-${sty_mode[mode]}">${txt_mode[mode]}</button>`
                        + `${$('.dropdown-lv-1').html()}</div>`

                }
            },
            {
                targets: 2,
                width: "10%",
                class: 'text-center',
                render: (row, type, data) => {
                    data.error = 1;
                    let temp = data.error === 0 ? error_map[1] : error_map[0];
                    return `<button type="button" class="btn btn-soft-${temp}">${data.error}</button>`;
                }
            },
            {
                targets: 3,
                width: "25%",
                render: (row, type, data) => {
                    data.wf_current = 'WF PAKD';
                    let select = jQuery('<select>');
                    select.addClass('dropdown-select_two')
                    select.attr('data-param', JSON.stringify({application: '50348927-2c4f-4023-b638-445469c66953'}))
                    // {application: data.application}
                    return `<div class="d-flex justify-content-between align-items-center"><span>${data.wf_current}</span>`
                        + `<div class="dropdown custom-dropdown-tb-2"><i class="fa fa-caret-down font-6 dropdown-toggle"`
                        + ` data-bs-toggle="dropdown"></i>`
                        + `<div class="dropdown-menu wf-mode">${select}</div></div></div>`
                }
            },
        ]
    }, false);
    // create event on click icon toggle of row
    $('#table_workflow_list tbody').on('click', 'td .main-tb-ico', function () {
        let tr = $(this).closest('tr');
        let row = _mainTable.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(MainEvt.getHTMLChildTable()).show();
            row.child().find('table').attr('id', 'child_'+row.data().id)
            // add event on click add new workflow
            MainEvt.addNewBtnClick(row.data().id)
            ChildEvt.init(row.data().id)
            tr.addClass('shown');
        }
    });
    // end setup table

    // hide icon default dropdown
    $('.custom-dropdown-tb i:after').hide();
});
