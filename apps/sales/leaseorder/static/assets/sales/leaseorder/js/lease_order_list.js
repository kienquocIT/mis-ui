
$(function () {
    $(document).ready(function () {

        let transEle = $('#trans-factory');
        let urlsEle = $('#app-url-factory');
        let $modalDeliveryInfoEle = $('#deliveryInfoModalCenter');
        let $deliveryEstimatedDateEle = $('#estimated_delivery_date');
        let $deliveryRemarkEle = $('#remarks');
        let $btnDelivery = $('#btn-delivery');

        // date picker
        $('.date-picker').each(function () {
            $(this).daterangepicker({
                singleDatePicker: true,
                timepicker: false,
                showDropdowns: false,
                minYear: 2023,
                locale: {
                    format: 'DD/MM/YYYY',
                },
                maxYear: parseInt(moment().format('YYYY'), 10),
                autoApply: true,
                autoUpdateInput: false,
            }).on('apply.daterangepicker', function (ev, picker) {
                $(this).val(picker.startDate.format('DD/MM/YYYY')).trigger('change');
            });
            $(this).val('').trigger('change');
        });

        function loadDbl() {
            let $table = $('#table_lease_order_list')
            let frm = new SetupFormSubmit($table);
            let changeList = [];
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    // data: {'is_recurring': false},
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('lease_order_list')) {
                            // Filter the array and store excluded items
                            resp.data['lease_order_list'] = resp.data['lease_order_list'].filter(item => {
                                let condition = item?.['is_change'] === true && item?.['document_root_id'] && item?.['system_status'] !== 3;
                                if (condition) {
                                    changeList.push(item);
                                }
                                return !condition; // Return true if condition is false (keep the item), false if condition is true (remove the item)
                            });
                            return resp.data['lease_order_list'] ? resp.data['lease_order_list'] : [];
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                autoWidth: true,
                scrollX: true,
                pageLength: 10,
                columns: [  // (1366p)
                    {
                        targets: 0,
                        width: '1%',
                        render: (data, type, row, meta) => {
                            if (row?.['is_change'] === true && row?.['document_root_id'] && row?.['system_status'] !== 3) {
                                return ``;
                            }
                            return `<span class="table-row-order">${(meta.row + 1)}</span>`
                        }
                    },
                    {
                        targets: 1,
                        width: '5%',
                        render: (data, type, row) => {
                            let link = urlsEle.data('link-detail').format_url_with_uuid(row?.['id']);
                            if (row?.['code']) {
                                if (row?.['is_change'] === true && row?.['document_root_id'] && row?.['system_status'] === 3) {
                                    let target = `.cl-${row?.['document_root_id'].replace(/-/g, "")}`;
                                    return `<div class="d-flex align-items-center">
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
                            return `<a href="${link}" class="link-primary underline_hover">--</a>`;
                        }
                    },
                    {
                        targets: 2,
                        width: '15%',
                        render: (data, type, row) => {
                            const link = urlsEle.data('link-detail').format_url_with_uuid(row?.['id'])
                            return `<a href="${link}" class="link-primary underline_hover">${row?.['title']}</a>`
                        }
                    },
                    {
                        targets: 3,
                        width: '15%',
                        render: (data, type, row) => {
                            if (Object.keys(row?.['customer']).length !== 0) {
                                return `<p>${row?.['customer']?.['title']}</p>`;
                            }
                            return `<p></p>`;
                        }
                    },
                    {
                        targets: 4,
                        width: '15%',
                        render: (data, type, row) => {
                            if (Object.keys(row?.['sale_person']).length !== 0) {
                                return `<p>${row?.['sale_person']?.['full_name']}</p>`;
                            }
                            return `<p></p>`;
                        }
                    },
                    {
                        targets: 5,
                        width: '12%',
                        data: "date_created",
                        render: (data) => {
                            return $x.fn.displayRelativeTime(data, {
                                'outputFormat': 'DD-MM-YYYY',
                            });
                        }
                    },
                    {
                        targets: 6,
                        width: '15%',
                        render: (data, type, row) => {
                            return `<span class="mask-money" data-init-money="${parseFloat(row?.['indicator_revenue'])}"></span>`
                        }
                    },
                    {
                        targets: 7,
                        width: '10%',
                        render: (data, type, row) => {
                            return WFRTControl.displayRuntimeStatus(row?.['system_status']);
                        }
                    },
                    {
                        targets: 8,
                        width: '10%',
                        render: (data, type, row) => {
                            let sttTxt = JSON.parse($('#delivery_status').text())
                            let hidden = "hidden";
                            if (row?.['delivery_status'] === 3) {
                                hidden = "";
                            }
                            return `<span>${sttTxt[row?.['delivery_status']][1]}</span><i class="fas fa-check text-success fs-4" ${hidden}></i>`;
                        }
                    },
                    {
                        targets: 9,
                        width: '1%',
                        className: 'action-center',
                        render: (data, type, row) => {
                            let link = urlsEle.data('link-update').format_url_with_uuid(row?.['id']);
                            let disabledEdit = '';
                            let disabledDeli = '';
                            if ([2, 3, 4].includes(row?.['system_status'])) {
                                disabledEdit = 'disabled';
                            }
                            if (row?.['delivery_call'] === true || ![2, 3].includes(row?.['system_status']) || row?.['opportunity']?.['is_deal_close'] === true) {
                                disabledDeli = 'disabled';
                            }
                            return `<div class="dropdown">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover btn-lg" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item ${disabledEdit} border-bottom mb-2" href="${link}"><i class="dropdown-icon far fa-edit"></i><span>${transEle.attr('data-edit')}</span></a>
                                        <a class="dropdown-item delivery-info ${disabledDeli}" href="#" data-bs-toggle="modal" data-bs-target="#deliveryInfoModalCenter"><i class="dropdown-icon fas fa-truck"></i><span>${transEle.attr('data-delivery')}</span></a>
                                    </div>
                                </div>`;
                        },
                    }
                ],
                rowCallback: (row, data) => {
                    $(row).on('click', '.delivery-info', function () {
                        $btnDelivery.attr('data-id', data?.['id']);
                        let targetCodeEle = $modalDeliveryInfoEle[0].querySelector('.target-code');
                        if (targetCodeEle) {
                            targetCodeEle.innerHTML = data?.['code'] ? data?.['code'] : '';
                        }
                        if (data?.['lease_from']) {
                            $deliveryEstimatedDateEle.val(moment(data?.['lease_from'], "YYYY-MM-DD").format("DD/MM/YYYY"));
                        }
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

        $btnDelivery.on('click', function () {
            if (!$deliveryEstimatedDateEle.val()) {
                $.fn.notifyB({description: transEle.attr('data-required-delivery-date')}, 'failure');
                return false;
            }

            let dataDelivery = {};
            dataDelivery['estimated_delivery_date'] = moment($deliveryEstimatedDateEle.val(), "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss");
            dataDelivery['remarks'] = $deliveryRemarkEle.val();

            WindowControl.showLoading();
            const url = urlsEle.attr('data-create-delivery').replace('1', $(this).attr('data-id'));
            $.fn.callAjax2({
                url: url,
                method: 'POST',
                data: dataDelivery,
                urlRedirect: null,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data?.['status'] === 200) {
                        const config = data?.config
                        let url_redirect = urlsEle.attr('data-delivery')
                        if (config?.is_picking && !data?.['is_not_picking'])
                            url_redirect = urlsEle.attr('data-picking')
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
        });

    });
});