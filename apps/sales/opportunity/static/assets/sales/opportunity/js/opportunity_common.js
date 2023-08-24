class OpportunityLoadPage {
    static transEle = $('#trans-factory');
    static urlEle = $('#url-factory');

    static loadCustomer(ele, data, config, emp_current) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                if (config) {
                    let list_result = []
                    resp.data[keyResp].map(function (item) {
                        let list_id_am = item.manager.map(obj => obj.id)
                        if (list_id_am.includes(emp_current)) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                } else {
                    return resp.data[keyResp]
                }
            }
        })
    }

    static loadProductCategory(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadSalePerson(ele, data, config, emp_current_id, list_account_manager) {
        ele.initSelect2({
            data: data,
            callbackDataResp(resp, keyResp) {
                let list_result = []
                if (config) {
                    let emp_current = resp.data[keyResp].find(obj => obj.id === emp_current_id)
                    resp.data[keyResp].map(function (item) {
                        if (item.group.id === emp_current.group.id && list_account_manager.includes(item.id)) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                } else {
                    resp.data[keyResp].map(function (item) {
                        if (item.id === emp_current_id.id) {
                            list_result.push(item)
                        }
                    })
                    return list_result
                }
            }
        })
    }

    static loadSalePersonPageDetail(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static loadEndCustomer(ele, data) {
        ele.initSelect2({
            data: data,
        })
    }

    static combinesData(frmEle) {
        let frm = new SetupFormSubmit($(frmEle));

        frm.dataForm['product_category'] = $('#select-box-product-category').val();
        return {
            url: frm.dataUrl,
            method: frm.dataMethod,
            data: frm.dataForm,
            urlRedirect: frm.dataUrlRedirect,
        };
    }
}

// function in page list

function loadDtbOpportunityList() {
    if (!$.fn.DataTable.isDataTable('#table_opportunity_list-purchase-request')) {
        let $table = $('#table_opportunity_list')
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
            useDataServer: true,
            rowIdx: true,
            ajax: {
                url: frm.dataUrl,
                type: frm.dataMethod,
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('opportunity_list')) {
                        return resp.data['opportunity_list'] ? resp.data['opportunity_list'] : [];
                    }
                    throw Error('Call data raise errors.')
                },
            },
            columns: [
                {
                    targets: 0,
                    render: () => {
                        return ``
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        const link = $('#opportunity-link').data('link-update').format_url_with_uuid(row.id)
                        return `<a href="${link}" class="link-primary underline_hover">${row.code}</a>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<p>${row.title}</p>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<p>${row.customer.title}</p>`
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<span class="badge badge badge-soft-success  ml-2 mt-2">${row?.['sale_person'].name}</span>`
                    }
                },
                {
                    targets: 5,
                    render: (data, type, row) => {
                        let open_date = null;
                        if (row?.['open_date'] !== null) {
                            open_date = row?.['open_date'].split(" ")[0]
                        }
                        return `<p>${open_date}</p>`
                    }
                },
                {
                    targets: 6,
                    render: (data, type, row) => {
                        let close_date = null;
                        if (row?.['close_date'] !== null) {
                            close_date = row?.['close_date'].split(" ")[0]
                        }
                        return `<p>${close_date}</p>`
                    }
                },
                {
                    targets: 7,
                    render: (data, type, row) => {
                        let stage_current;
                        stage_current = row.stage.find(function (obj) {
                            return obj.is_current === true;
                        });
                        return `<p>${stage_current.indicator}</p>`
                    }
                },
                {
                    targets: 8,
                    className: 'action-center',
                    render: (data, type, row) => {
                        let urlUpdate = $('#opportunity-link').attr('data-link-update').format_url_with_uuid(row.id)
                        return `<div><a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" `
                            + `data-bs-original-title="Delete" href="javascript:void(0)" data-url="${urlUpdate}" `
                            + `data-method="DELETE"><span class="btn-icon-wrap"><span class="feather-icon">`
                            + `<i data-feather="trash-2"></i></span></span></a></div>`;
                    },
                }
            ],
        });
    }
}

function callData(url, method) {
    return $.fn.callAjax2({
        url: url,
        method: method,
    }).then((resp) => {
        return $.fn.switcherResp(resp);
    });
}

async function loadConfig() {
    let url = OpportunityLoadPage.urlEle.data('url-config');
    let method = 'GET';
    let result = await callData(url, method);
    return result?.['opportunity_config'].is_account_manager_create;
}

// page detail

function loadMemberSaleTeam(employee_list) {
    if (!$.fn.DataTable.isDataTable('#dtbMember')) {
        let dtb = $('#dtbMember');
        dtb.DataTableDefault({
            paging: false,
            scrollY: '200px',
            autoWidth: false,
            columnDefs: [
                {
                    "width": "10%",
                    "targets": 0
                }, {
                    "width": "30%",
                    "targets": 1
                }, {
                    "width": "50%",
                    "targets": 2
                },
                {
                    "width": "0%",
                    "targers": 3
                },
                {
                    "width": "10%",
                    "targets": 4
                }
            ],
            data: employee_list,
            columns: [
                {
                    render: (data, type, row, meta) => {
                        return '';
                    }
                },
                {
                    data: 'code',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="span-emp-code">{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'full_name',
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="span-emp-name">{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'email',
                    className: 'wrap-text hidden',
                    render: (data, type, row, meta) => {
                        return `<span class="span-emp-email">{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    className: 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span class="form-check"><input data-id="{0}" type="checkbox" class="form-check-input input-select-member" /></span>`.format_by_idx(row.id)
                    }
                },
            ],
        });
    }
}

function loadDtbProductDetailPageDetail(data) {
    if (!$.fn.DataTable.isDataTable('#table-products')) {
        let dtb = $('#table-products');
        dtb.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            data: data,
            columns: [
                {
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'product_name',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'product_category',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.title
                        )
                    }
                },
                {
                    data: 'uom',
                    className: 'wrap-text hidden',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.title
                        )
                    }
                },
                {
                    data: 'product_quantity',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'product_unit_price',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="mask-money" data-init-money="{0}"></span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'tax',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.title
                        )
                    }
                },
                {
                    data: 'product_subtotal_price',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="mask-money" data-init-money="{0}"></span>`.format_by_idx(
                            data
                        )
                    }
                },
            ],
        });
    }
}

function loadDtbCompetitorPageDetail(data) {
    if (!$.fn.DataTable.isDataTable('#table-competitors')) {
        let dtb = $('#table-competitors');
        dtb.DataTableDefault({
            data: data,
            columns: [

                {
                    data: 'competitor',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.name
                        )
                    }
                },
                {
                    data: 'strength',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'weakness',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'win_deal',
                    className: 'wrap-text text-center',
                    render: (data) => {
                        if (data) {
                            return `<div class="form-check"><input checked type="checkbox" class="form-check-input" disabled></div>`
                        } else {
                            return `<div class="form-check"><input type="checkbox" class="form-check-input" disabled></div>`
                        }
                    }
                },
            ],
        });
    }
}

function loadDtbContactRolePageDetail(data) {
    if (!$.fn.DataTable.isDataTable('#table-contact-role')) {
        let dtb = $('#table-contact-role');
        dtb.DataTableDefault({
            data: data,
            columns: [
                {
                    className: 'wrap-text',
                    render: () => {
                        return `<span class="text-type-customer"></span>`
                    }
                },
                {
                    data: 'contact',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<input type="text" class="form-control" value="${data.fullname}" disabled>`
                    }
                },
                {
                    data: 'job_title',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    className: 'wrap-text text-center',
                    render: () => {
                        return `<span class="text-contact-role"></span>`
                    }
                },
            ],
        });
    }
}

function loadDetailContactRole(data, table, transEle) {
    let row_current = table.find('tbody tr').last();
    let text_type_customer;
    if (data.type_customer === 0) {
        text_type_customer = transEle.data('trans-customer');
    } else {
        text_type_customer = transEle.data('end-customer');
    }

    let text_role;
    if (data.role === 0) {
        text_role = transEle.data('trans-decision-maker');
    } else if (data.role === 1) {
        text_role = transEle.data('trans-influence');
    } else {
        text_role = transEle.data('trans-contact-involved');
    }

    row_current.find('.text-type-customer').text(text_type_customer)
    row_current.find('.text-contact-role').text(text_role)
}

// page update

function loadDtbProduct(data) {
    if (!$.fn.DataTable.isDataTable('#table-products')) {
        let dtb = $('#table-products');
        dtb.DataTableDefault({
            rowIdx: true,
            reloadCurrency: true,
            data: data,
            columns: [
                {
                    render: () => {
                        return '';
                    }
                },
                {
                    data: 'is_select_product',
                    className: 'wrap-text',
                    render: (data) => {
                        if (data) {
                            return `<select class="form-select" data-method="GET" data-url="${OpportunityLoadPage.urlEle}" data-keyResp="opportunity_list"></select>`
                        }

                    }
                },
                {
                    data: 'product_category',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.title
                        )
                    }
                },
                {
                    data: 'uom',
                    className: 'wrap-text hidden',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.title
                        )
                    }
                },
                {
                    data: 'product_quantity',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'product_unit_price',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="mask-money" data-init-money="{0}"></span>`.format_by_idx(
                            data
                        )
                    }
                },
                {
                    data: 'tax',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span>{0}</span>`.format_by_idx(
                            data.title
                        )
                    }
                },
                {
                    data: 'product_subtotal_price',
                    className: 'wrap-text',
                    render: (data) => {
                        return `<span class="mask-money" data-init-money="{0}"></span>`.format_by_idx(
                            data
                        )
                    }
                },
            ],
        });
    }
}

//common
function loadSaleTeam(data) {
    let card_member = $('#card-member');
    data.map(function (item) {
        card_member.append($('.card-member-hidden').html());
        let card = card_member.find('.card').last();
        card.find('.btn-detail-member').attr('href', OpportunityLoadPage.urlEle.data('url-emp-detail').format_url_with_uuid(item.member.id));
        card.find('.card-title').text(item.member.name);
        card.find('.card-text').text(item.member.email);
        card.attr('data-id', item.member.id);
    })
}

function sortStage(list_stage) {
    let object_lost = null;
    let delivery = null;
    let object_close = null;
    let list_result = []

    for (let i = 0; i < list_stage.length; i++) {
        if (list_stage[i]?.['is_closed_lost']) {
            object_lost = list_stage[i];
        } else if (list_stage[i]?.['is_delivery']) {
            delivery = list_stage[i];
        } else if (list_stage[i]?.['is_deal_closed']) {
            object_close = list_stage[i];
        } else {
            list_result.push(list_stage[i]);
        }
    }

    list_result.sort(function (a, b) {
        return a.win_rate - b.win_rate;
    });
    list_result.push(object_lost);
    if (delivery !== null)
        list_result.push(delivery);
    list_result.push(object_close);

    return list_result
}

