
$(function () {
    $(document).ready(function () {

        function loadDbl() {
            let $table = $('#table_sale_order_list')
            let frm = new SetupFormSubmit($table);
            let changeList = [];
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('sale_order_list')) {
                            // Filter the array and store excluded items
                            resp.data['sale_order_list'] = resp.data['sale_order_list'].filter(item => {
                                let condition = item?.['is_change'] === true && item?.['document_root_id'] && item?.['system_status'] !== 3;
                                if (condition) {
                                    changeList.push(item);
                                }
                                return !condition; // Return true if condition is false (keep the item), false if condition is true (remove the item)
                            });
                            return resp.data['sale_order_list'] ? resp.data['sale_order_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                autoWidth: true,
                scrollX: true,
                pageLength:50,
                columns: [  // (1366p)
                    {
                        targets: 0,
                        width: '5%',
                        render: (data, type, row) => {
                            if (row?.['code']) {
                                const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row?.['id']);
                                if (row?.['is_change'] === true && row?.['document_root_id'] && row?.['system_status'] === 3) {
                                    let target = `.cl-${row?.['document_root_id'].replace(/-/g, "")}`;
                                    return `<div class="d-flex">
                                            <div class="row"><a href="${link}" class="link-primary underline_hover"><span class="badge-parent badge-parent-primary">${row?.['code']} <span class="badge-child badge-child-blue">CR</span></span></a></div>
                                            <small><button 
                                                type="button" 
                                                class="btn btn-icon btn-xs cl-parent" 
                                                data-bs-toggle="collapse"
                                                data-bs-target="${target}"
                                                data-bs-placement="top"
                                                aria-expanded="false"
                                                aria-controls="newGroup"
                                            >
                                                <span class="icon"><small><i class="fas fa-chevron-right mt-2"></i></small></span>
                                            </button></small>
                                        </div>`;
                                }
                                if (row?.['is_change'] === true && row?.['document_root_id'] && row?.['system_status'] !== 3) {
                                    return `<div class="row"><a href="${link}" class="link-primary underline_hover"><span class="badge-parent badge-parent-secondary">${row?.['code']} <span class="badge-child badge-child-blue">${row?.['document_change_order'] ? row?.['document_change_order'] : 0}</span></span></a></div>`;
                                }
                                return `<div class="row"><a href="${link}" class="link-primary underline_hover"><span class="badge-parent badge-parent-primary">${row?.['code']}</span></a></div>`;
                            }
                            return `<p></p>`;
                        }
                    },
                    {
                        targets: 1,
                        width: '20%',
                        render: (data, type, row) => {
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 2,
                        width: '20%',
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row?.['customer']).length !== 0) {
                                ele = `<p>${row?.['customer']?.['title']}</p>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 3,
                        width: '10%',
                        render: (data, type, row) => {
                            let ele = `<p></p>`;
                            if (Object.keys(row?.['sale_person']).length !== 0) {
                                ele = `<div class="row"><span class="badge badge-primary badge-outline">${row?.['sale_person']?.['full_name']}</span></div>`;
                            }
                            return ele;
                        }
                    },
                    {
                        targets: 4,
                        width: '10%',
                        data: "date_created",
                        render: (data) => {
                            return $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                            });
                        }
                    },
                    {
                        targets: 5,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['indicator_revenue'])}"></span>`
                        }
                    },
                    {
                        targets: 6,
                        width: '8%',
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#stt_sys').text())
                            let sttData = [
                                "soft-light",
                                "soft-primary",
                                "soft-info",
                                "soft-success",
                                "soft-danger",
                            ]
                            return `<div class="row"><span class="badge badge-${sttData[row?.['system_status']]}">${sttTxt[row?.['system_status']][1]}</span></div>`;
                        }
                    },
                    {
                        targets: 7,
                        width: '8%',
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#delivery_status').text())
                            let sttData = [
                                "soft-light",
                                "soft-warning",
                                "soft-info text-sky",
                                "soft-success",
                            ]
                            return `<div class="row"><span class="badge badge-${sttData[row?.['delivery_status']]}">${sttTxt[row?.['delivery_status']][1]}</span></div>`;
                        }
                    },
                    {
                        targets: 8,
                        width: '5%',
                        className: 'action-center',
                        render: (data, type, row) => {
                            const link = $('#sale-order-link').data('link-update').format_url_with_uuid(row?.['id']);
                            const $elmTrans = $('#trans-factory')
                            let isEdit = ``;
                            let isDelivery = ``;
                            if (![2, 3, 4].includes(row?.['system_status'])) {
                                isEdit = `<a class="dropdown-item" href="${link}"><i class="dropdown-icon far fa-edit text-primary"></i><span>${$elmTrans.attr('data-change')}</span></a>`;
                            }
                            if (!row.delivery_call && [2, 3].includes(row?.['system_status'])) {
                                isDelivery = `<a class="dropdown-item" href="#" id="create_delivery"><i class="dropdown-icon fas fa-truck text-primary"></i><span>${$elmTrans.attr('data-delivery')}</span></a>`;
                            }
                            return `<div class="dropdown">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                    <div role="menu" class="dropdown-menu">
                                        ${isEdit}
                                        ${isDelivery}
                                    </div>
                                </div>`;
                        },
                    }
                ],
                rowCallback: (row, data) => {
                    $('#create_delivery', row).off().on('click', function () {
                        WindowControl.showLoading();
                        const url = $('#sale-order-link').attr('data-create-delivery').replace('1', data.id);
                        $.fn.callAjax2({
                            url: url,
                            method: 'POST',
                            data: {},
                            urlRedirect: null,
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data?.['status'] === 200) {
                                    const config = data?.config
                                    let url_redirect = $('#sale-order-link').attr('data-delivery')
                                    if (config?.is_picking && !data?.['is_not_picking'])
                                        url_redirect = $('#sale-order-link').attr('data-picking')
                                    setTimeout(() => {
                                        window.location.href = url_redirect
                                    }, 1000);
                                }
                            },
                            (errs) => {
                                WindowControl.hideLoading();
                                $.fn.notifyB({description: errs.data.errors}, 'failure');
                            }
                        )
                    })
                },
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                    // setup groupChild to groupParent
                    for (let parent of $table[0].querySelectorAll('.cl-parent')) {
                        if ($(parent).is('button') && $(parent).attr('data-bs-toggle') === 'collapse') {
                            let tableDtb = $table.DataTable();
                            let rowParent = $(parent)[0].closest('tr');
                            let targetCls = $(parent).attr('data-bs-target');
                            if (targetCls) {
                                if ($table[0].querySelectorAll(`${targetCls}`).length <= 0) {
                                    for (let data of changeList) {
                                        let classCl = '.cl-' + data?.['document_root_id'].replace(/-/g, "");
                                        if (classCl === targetCls) {
                                            let newRow = tableDtb.row.add(data).node();
                                            $(newRow).addClass(classCl.slice(1));
                                            $(newRow).addClass('collapse');
                                            $(newRow).css('background-color', '#eaeaea');
                                            $(newRow).detach().insertAfter(rowParent);
                                        }
                                    }
                                }
                            }
                            // mask money
                            $.fn.initMaskMoney2();
                        }
                    }
                    $table.on('click', '.cl-parent', function () {
                        $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
                    });
                },
            });
        }

        loadDbl();

    });
});