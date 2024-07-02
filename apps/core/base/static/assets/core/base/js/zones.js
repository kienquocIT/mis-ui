$(function () {
    $(document).ready(function () {
        let $form = $('#frm_app_zones');

        let $boxApp = $('#box-application');
        let $btnAdd = $('#btn-add-zone');
        let $btnEdit = $('#btn-edit-zone');
        let $btnCAdd = $('#btn-confirm-add');
        let $btnCEdit = $('#btn-confirm-edit');
        let $table = $('#table_zones_list');

        let $eleTitle = $('#add-zone-title');
        let $eleRemark = $('#add-zone-remark');
        let $boxProp = $('#add-zone-box-prop');

        let $eleTitleEdit = $('#edit-zone-title');
        let $eleRemarkEdit = $('#edit-zone-remark');
        let $boxPropEdit = $('#edit-zone-box-prop');

        let $transFact = $('#app-trans-factory');
        let $urlFact = $('#app-url-factory');

        loadInitS2($boxApp);
        // dataTableZone();

        // EVENTS
        $boxApp.on('change', function () {
            $btnAdd[0].removeAttribute('disabled');
        });

        $('#addZoneMdl').on('shown.bs.modal', function () {
            let $modal = $(this);
            loadInitS2($boxProp, [], {
                'application': $boxApp.val(),
                'is_print': false,
                'is_mail': false,
                'is_sale_indicator': false
            }, $modal);
        });

        $btnCAdd.on('click', function () {
            if ($boxProp.val() && $boxProp.val().length > 0 && $eleTitle.val()) {
                $.fn.callAjax2({
                    url: $boxProp.attr('data-url'),
                    method: 'GET',
                    'data': {'id__in': $boxProp.val().join(',')},
                    isLoading: true,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('application_property_list')) {
                            let dataAdd = {};
                            dataAdd['order'] = $table[0].querySelectorAll('.table-row-order').length + 1;
                            dataAdd['title'] = $eleTitle.val();
                            dataAdd['remark'] = $eleRemark.val();
                            dataAdd['properties_data'] = data?.['application_property_list'];
                            $table.DataTable().row.add(dataAdd).draw().node();
                            $eleTitle.val('');
                            $eleRemark.val('');
                            $boxProp.empty();
                        }
                    }
                )
            } else {
                $.fn.notifyB({description: $transFact.attr('data-zone-required')}, 'failure');
                return false;
            }
        });

        $table.on('click', '.del-row', function () {
            deleteRowZone(this.closest('tr'), $table);
            reOrderSTTRow($table);
        });

        $table.on('click', '.edit-row', function () {
            let $modal = $('#editZoneMdl');
            let row = this.closest('tr');
            let rowOrder = row.querySelector('.table-row-order');
            let rowTitle = row.querySelector('.table-row-title');
            let rowRemark = row.querySelector('.table-row-remark');
            let rowPropList = row.querySelector('.table-row-property-list');
            if (rowOrder) {
                $btnCEdit.attr('data-order', rowOrder.innerHTML);
            }
            if (rowTitle) {
                $eleTitleEdit.val(rowTitle.innerHTML);
            }
            if (rowRemark) {
                $eleRemarkEdit.val(rowRemark.innerHTML);
            }
            if (rowPropList) {
                if (rowPropList.getAttribute('data-properties')) {
                    let dataProp = JSON.parse(rowPropList.getAttribute('data-properties'));
                    loadInitS2($boxPropEdit, dataProp, {
                        'application': $boxApp.val(),
                        'is_print': false,
                        'is_mail': false,
                        'is_sale_indicator': false
                    }, $modal);
                    let dataPropID = [];
                    for (let prop of dataProp) {
                        dataPropID.push(prop?.['id']);
                    }
                    $boxPropEdit.val(dataPropID);
                }
            }
            $btnEdit.click();
        });

        $btnCEdit.on('click', function () {
            if ($btnCEdit.attr('data-order')) {
                if ($boxPropEdit.val() && $boxPropEdit.val().length > 0 && $eleTitleEdit.val()) {
                    $.fn.callAjax2({
                        url: $boxPropEdit.attr('data-url'),
                        method: 'GET',
                        'data': {'id__in': $boxPropEdit.val().join(',')},
                        isLoading: true,
                    }).then(
                        (resp) => {
                            let data = $.fn.switcherResp(resp);
                            if (data && resp.data.hasOwnProperty('application_property_list')) {
                                for (let eleOrder of $table[0].querySelectorAll('.table-row-order')) {
                                    if (eleOrder.innerHTML === $btnCEdit.attr('data-order')) {
                                        let row = eleOrder.closest('tr');
                                        let rowTitle = row.querySelector('.table-row-title');
                                        let rowRemark = row.querySelector('.table-row-remark');
                                        let rowPropList = row.querySelector('.table-row-property-list');
                                        if (rowTitle) {
                                            rowTitle.innerHTML = $eleTitleEdit.val();
                                        }
                                        if (rowRemark) {
                                            rowRemark.innerHTML = $eleRemarkEdit.val();
                                        }
                                        if (rowPropList) {
                                            $(rowPropList).empty();
                                            $(rowPropList).attr('data-properties', JSON.stringify(data?.['application_property_list']));
                                            for (let prop of data?.['application_property_list']) {
                                                $(rowPropList).append(`<span class="badge badge-soft-green mr-1 mb-1">${prop?.['title']}</span>`);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    )
                } else {
                    $.fn.notifyB({description: $transFact.attr('data-zone-required')}, 'failure');
                    return false;
                }
            }
        });

        $form.submit(function (e) {
            e.preventDefault();
            if ($boxApp.val()) {
                let dataSubmit = {'application': $boxApp.val()};
                let zones_data = [];
                $table.DataTable().rows().every(function () {
                    let row = this.node();
                    let zone_data = {};
                    let rowOrder = row.querySelector('.table-row-order');
                    let rowTitle = row.querySelector('.table-row-title');
                    let rowRemark = row.querySelector('.table-row-remark');
                    let rowPropList = row.querySelector('.table-row-property-list');
                    if (rowOrder) {
                        zone_data['order'] = parseInt(rowOrder.innerHTML);
                    }
                    if (rowTitle) {
                        zone_data['title'] = rowTitle.innerHTML;
                    }
                    if (rowRemark) {
                        zone_data['remark'] = rowRemark.innerHTML;
                    }
                    if (rowPropList) {
                        if ($(rowPropList).attr('data-properties')) {
                            let propIDList = [];
                            let propListData = JSON.parse($(rowPropList).attr('data-properties'));
                            for (let propData of propListData) {
                                propIDList.push(propData?.['id']);
                            }
                            zone_data['properties_data'] = propIDList;
                        }
                    }
                    zones_data.push(zone_data);
                });
                dataSubmit['zones_data'] = zones_data;
                WindowControl.showLoading();
                $.fn.callAjax2(
                    {
                        'url': $form.attr('data-url'),
                        'method': $form.attr('data-method'),
                        'data': dataSubmit,
                    }
                ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && (data['status'] === 201 || data['status'] === 200)) {
                            $.fn.notifyB({description: data.message}, 'success');
                            setTimeout(() => {
                                window.location.replace($urlFact.attr('data-url-redirect'));
                            }, 1000);
                        }
                    }, (err) => {
                        setTimeout(() => {
                            WindowControl.hideLoading();
                        }, 1000)
                        $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                    }
                )
            }
        });


        // INIT DATATABLE APP LIST
        $table.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: $table.attr('data-url'),
                type: $table.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('tenant_application_list')) {
                        return resp.data['tenant_application_list'] ? resp.data['tenant_application_list'] : []
                    }
                    throw Error('Call data raise errors.')
                },
            },
            pageLength: 50,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                        return `<div class="d-flex justify-content-start">
                                <button class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-collapse-app-wf mr-1" data-row="${dataRow}"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button>
                                <p class="table-row-application mt-2">${row?.['title']}</p>
                            </div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<p></p>`;
                    }
                },
            ]
        });

        // EVENT CLICK TO COLLAPSE IN LINE APP LIST
        //      ACTION: INSERT TABLE WORKFLOW LIST TO NEXT ROW (OF APP LIST)
        $(document).on('click', '.btn-collapse-app-wf', function (event) {
            event.preventDefault();

            let idTbl = UtilControl.generateRandomString(12);
            let trEle = $(this).closest('tr');
            let iconEle = $(this).find('.icon-collapse-app-wf');

            iconEle.toggleClass('fa-caret-right').toggleClass('fa-caret-down');

            if (iconEle.hasClass('fa-caret-right')) {
                iconEle.removeClass('text-dark').addClass('text-secondary');
                trEle.next().find('.child-workflow-group').slideToggle({
                    complete: function () {
                        trEle.next().addClass('hidden');
                    }
                });
            }

            if (iconEle.hasClass('fa-caret-down')) {
                iconEle.removeClass('text-secondary').addClass('text-dark');

                if (!trEle.next().hasClass('child-workflow-list')) {
                    let dtlSub = `<table
                                        id="${idTbl}"
                                        class="table nowrap w-100 mb-5"
                                >
                                    <thead>
                                    <tr class="bg-light">
                                        <th class="w-5"></th>
                                        <th class="w-20">Name</th>
                                        <th class="w-30">Description</th>
                                        <th class="w-40">Properties</th>
                                        <th class="w-5"></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                                <div class="d-flex justify-content-end">
                                    <button type="button" class="btn btn-outline-primary" id="btn-add-zone" data-bs-toggle="modal" data-bs-target="#addZoneMdl">
                                        <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>New</span></span>
                                    </button>
                                    <button type="button" class="btn btn-outline-primary" id="btn-edit-zone" data-bs-toggle="modal" data-bs-target="#editZoneMdl" hidden>
                                        <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>{% trans 'New' %}</span></span>
                                    </button>
                                </div>`;
                    $(this).closest('tr').after(
                        `<tr class="child-workflow-list"><td colspan="2"><div class="child-workflow-group pt-3 pb-3 ml-3 pl-5 pr-5 hidden-simple">${dtlSub}</div></td></tr>`
                    );

                    let rowData = DTBControl.getRowData($(this));
                    let placeGetData = $('#url-factory');
                    let urlData = placeGetData.attr('data-url-workflow-list');
                    let urlWorkflowDetail = placeGetData.attr('data-url-workflow-detail');
                    if ($(this).attr('data-row')) {
                        let dataRow = JSON.parse(($(this).attr('data-row')));
                        $.fn.callAjax2({
                                'url': $urlFact.attr('data-url-zones'),
                                'method': 'GET',
                                'data': {'application_id': dataRow?.['id']},
                                isLoading: false,
                            }
                        ).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    if (data.hasOwnProperty('zones_list') && Array.isArray(data.zones_list)) {
                                        let $table = $(`#${idTbl}`);
                                        dataTableZone($table);
                                        $table.DataTable().clear().draw();
                                        $table.DataTable().rows.add(data?.['zones_list']).draw();

                                    }
                                }
                            }
                        )
                    }
                }
                trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
            }
        });

        // EVENT IN LINE WORKFLOW LIST
        $(document).on('click', '.btn-delete-wf', function (event) {
            event.preventDefault();
            let rowData = DTBControl.getRowData($(this));
            alert('Delete WF: ' + rowData?.['title']);
        });
        $(document).on('click', '.btn-change-wf-doc', function (event) {
            event.preventDefault();
            let rowData = DTBControl.getRowData($(this));
            alert('Change WF of doc: ' + rowData?.['title']);
        });

        // EVENT CLICK TO COLLAPSE IN LINE WORKFLOW LIST
        //      ACTION: INSERT RUNTIME OBJ LIST TO NEXT ROW (OF WORKFLOW LIST)
        $(document).on('click', '.btn-collapse-doc-wf', function (event) {
            event.preventDefault();
            let idTbl = UtilControl.generateRandomString(12);
            let trEle = $(this).closest('tr');
            let iconEle = $(this).find('.icon-collapse-doc-wf');
            iconEle.toggleClass('fa-caret-right').toggleClass('fa-caret-down');

            if (iconEle.hasClass('fa-caret-right')) {
                trEle.removeClass('bg-grey-light-5');
                iconEle.removeClass('text-dark').addClass('text-secondary');
                trEle.next().find('.child-workflow-group').slideToggle({
                    complete: function () {
                        trEle.next().addClass('hidden');
                    }
                });
            }

            if (iconEle.hasClass('fa-caret-down')) {
                trEle.addClass('bg-grey-light-5');
                iconEle.removeClass('text-secondary').addClass('text-dark');

                if (!trEle.next().hasClass('child-workflow-list')) {
                    let dtlSub = `<table id="${idTbl}" class="table nowrap w-100 mb-5"><thead></thead><tbody></tbody></table>`
                    $(this).closest('tr').after(
                        `<tr class="child-workflow-list"><td colspan="6"><div class="child-workflow-group pt-3 pb-3 ml-3 pl-5 pr-5 hidden-simple">${dtlSub}</div></td></tr>`
                    )

                    let rowData = DTBControl.getRowData($(this));
                    let urlRuntimeList = $('#url-factory').attr('data-url-workflow-runtime-list');
                    $('#' + idTbl).DataTableDefault({
                        ajax: {
                            url: SetupFormSubmit.getUrlDetailWithID(urlRuntimeList, rowData.id),
                            type: 'GET',
                            dataSrc: function (resp) {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    console.log(data)
                                    return resp.data['runtime_list'] ? resp.data['runtime_list'] : [];
                                }
                                return [];
                            },
                        },
                        columns: [
                            {
                                title: "#",
                                render: () => {
                                    return '';
                                }
                            },
                            {
                                data: 'doc_title',
                                title: "Title",
                                render: (data, type, row) => {
                                    return data ? data : '';
                                }
                            },
                            {
                                data: 'doc_employee_created',
                                title: "Creator",
                                render: (data, type, row) => {
                                    if (data && $.fn.hasOwnProperties(data, ['id', 'full_name', 'is_active'])) {
                                        if (data['is_active'] === true) return data['full_name'] + ` <span class="badge badge-success badge-indicator"></span>`;
                                        return data['full_name'] + `<span class="badge badge-secondary badge-indicator"></span>`;
                                    }
                                    return '_';
                                }
                            },
                            {
                                data: "date_created",
                                title: "Posting date",
                                render: (data, type, row) => {
                                    return $x.fn.displayRelativeTime(data);
                                }
                            },
                            {
                                data: 'stage_currents',
                                title: "Node currently",
                                render: (data, type, row) => {
                                    if (typeof data === 'object' && $.fn.hasOwnProperties(data, ['id', 'title', 'code'])) {
                                        if (data['code']) {
                                            return `<span class="badge badge-warning badge-outline">${data['code']}</span>`;
                                        } else {
                                            return `<span class="badge badge-success badge-outline">${data['title']}</span>`;
                                        }
                                    }
                                    return '_';
                                }
                            },
                            {
                                data: "state",
                                title: "Status",
                                render: (data, type, row, meta) => {
                                    if (data && Number.isFinite(data)) {
                                        if (txt_state_wf_doc.hasOwnProperty(data)) {
                                            return `<span class="badge ${txt_state_wf_doc[data][1]}">${txt_state_wf_doc[data][0]}</span>`;
                                        }
                                    }
                                    return `<span class="badge badge-soft-success">OK</span>`;
                                }
                            },
                            {
                                title: "Action",
                                render: (data, type, row) => {
                                    if (!(row.state === 2 || row.state === 3 || row.status === 1)) {
                                        return `<button class="btn btn-icon btn-rounded bg-dark-hover mr-1"><span class="icon"><i class="far fa-paper-plane"></i></span></button>`;
                                    }
                                    return '_';
                                }
                            },
                        ]
                    });
                }
                trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
            }

        });


        // FUNCTIONS
        function loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false) {
            let opts = {'allowClear': isClear};
            $ele.empty();
            if (data.length > 0) {
                opts['data'] = data;
            }
            if (Object.keys(dataParams).length !== 0) {
                opts['dataParams'] = dataParams;
            }
            if ($modal) {
                opts['dropdownParent'] = $modal;
            }
            $ele.initSelect2(opts);
            return true;
        }

        function dataTableZone($table, data) {
            // init dataTable
            $table.DataTableDefault({
                data: data ? data : [],
                paging: false,
                info: false,
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row) => {
                            let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                            return `<span class="table-row-order ml-2" data-row="${dataRow}">${row?.['order']}</span>`;
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            return `<p class="table-row-title">${row?.['title']}</p>`;
                        },
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            return `<p class="table-row-remark">${row?.['remark']}</p>`;
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            let listShow = ``;
                            for (let prop of row?.['properties_data']) {
                                listShow += `<span class="badge badge-soft-green mr-1 mb-1">${prop?.['title']}</span>`;
                            }
                            return `<div class="table-row-property-list" data-properties="${JSON.stringify(row?.['properties_data']).replace(/"/g, "&quot;")}">${listShow}</div>`;
                        }
                    },
                    {
                        targets: 4,
                        render: () => {
                            return `<div class="d-flex">
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover edit-row mr-1"><span class="icon"><i class="far fa-edit"></i></span></button>
                                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                    </div>`;

                        }
                    },
                ],
                drawCallback: function () {
                    // add css to Dtb
                    loadCssToDtb('datable-zones');
                },
            });
        }

        function loadCssToDtb(tableID) {
            let tableIDWrapper = tableID + '_wrapper';
            let tableWrapper = document.getElementById(tableIDWrapper);
            if (tableWrapper) {
                let headerToolbar = tableWrapper.querySelector('.dtb-header-toolbar');
                if (headerToolbar) {
                    headerToolbar.classList.add('hidden');
                }
            }
        }

        function deleteRowZone(currentRow, table) {
            // Get the index of the current row within the DataTable
            let rowIndex = table.DataTable().row(currentRow).index();
            let row = table.DataTable().row(rowIndex);
            // Delete current row
            row.remove().draw();
        }

        function reOrderSTTRow(table) {
            let order = 1;
            let itemCount = table[0].querySelectorAll('.table-row-order').length;
            if (itemCount === 0) {
                table.DataTable().clear().draw();
            } else {
                for (let eleOrder of table[0].querySelectorAll('.table-row-order')) {
                    eleOrder.innerHTML = order;
                    order++
                    if (order > itemCount) {
                        break;
                    }
                }
            }
        }


    });
});