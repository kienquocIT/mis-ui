class OpportunityLoadPage {
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

function loadDtb() {
    if (!$.fn.DataTable.isDataTable('#table_opportunity_list-purchase-request')) {
        let $table = $('#table_opportunity_list')
        let frm = new SetupFormSubmit($table);
        $table.DataTableDefault({
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
                        return `<div class="form-check"><input type="checkbox" class="form-check-input"></div>`
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
                        if (row.open_date !== null) {
                            open_date = row.open_date.split(" ")[0]
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
    let url = $('#url-factory').data('url-config');
    let method = 'GET';
    let result = await callData(url, method);
    return result?.['opportunity_config'].is_account_manager_create;
}

