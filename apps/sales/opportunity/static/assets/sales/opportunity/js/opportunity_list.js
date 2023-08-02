$(function () {
    $(document).ready(function () {
        let boxCustomer = $('#select-box-opportunity-create-customer');
        let boxProductCategory = $('#select-box-product-category');

        let $table = $('#table_opportunity_list');
        let listURL = $table.attr('data-url');

        let employee_current_id = $('#employee_current_id').val();
        let config = JSON.parse($('#id-config-data').text());

        let config_is_AM_create = config.is_account_manager_create;

        function getOppList(data) {
            let result = []
            data.map(function (item) {
                let list_sale_team = item.opportunity_sale_team_datas.map(obj => obj.member.id)
                if (item.sale_person.id === employee_current_id || list_sale_team.includes(employee_current_id)) {
                    result.push(item)
                }
            })
            return result
        }

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
                                return `<span class="badge badge badge-soft-success  ml-2 mt-2">${row.sale_person.name}</span>`
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
                                if (row.close_date !== null) {
                                    close_date = row.close_date.split(" ")[0]
                                }
                                return `<p>${close_date}</p>`
                            }
                        },
                        {
                            targets: 7,
                            render: (data, type, row) => {
                                let stage_current = null;
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

        loadDtb();


        let is_load_customer = false;
        let is_load_product_category = false;
        let is_load_sale_person = false;

        function loadCustomer() {
            let url = boxCustomer.attr('data-url');
            let method = boxCustomer.attr('data-method');
            $.fn.callAjax(url, method).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                            is_load_customer = true;
                            boxCustomer.append(`<option value=""></option>`);
                            $('#data-customer').attr('value', JSON.stringify(data.account_list));
                            if (config_is_AM_create) {
                                data.account_list.map(function (item) {
                                    let list_manager = item.manager.map(obj => obj.id)
                                    if (list_manager.includes(employee_current_id)) {
                                        boxCustomer.append(`<option value="${item.id}">
                                                            <span class="account-title">${item.name}</span>
                                                        </option>`)
                                    }
                                })
                            } else {
                                data.account_list.map(function (item) {
                                    boxCustomer.append(`<option value="${item.id}">
                                                            <span class="account-title">${item.name}</span>
                                                        </option>`)
                                })
                            }
                        }
                    }
                })
        }


        $('#btn-create_opportunity').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('form-create_opportunity');
            let _form = new SetupFormSubmit($('#form-create_opportunity'));
            let submitFields = [
                'title',
                'code',
                'customer',
                'sale_person',
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            _form.dataForm['product_category'] = $('#select-box-product-category').val();
            _form.dataForm['open_date'] = new Date();
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({description: data.message}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect').format_url_with_uuid(data.id), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                        $.fn.notifyB({description: "Opportunity create fail"}, 'failure')
                    }
                )
        });

        function loadProductCategory() {
            let ele = boxProductCategory;
            let url = ele.attr('data-url');
            let method = ele.attr('data-method');
            $.fn.callAjax(url, method).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        if (data.hasOwnProperty('product_category_list') && Array.isArray(data.product_category_list)) {
                            is_load_product_category = true;
                            data.product_category_list.map(function (item) {
                                boxProductCategory.append(`<option value="${item.id}">
                                                            <span>${item.title}</span>
                                                        </option>`)
                            })
                        }
                    }
                }
            )
        }


        function loadSalePerson() {
            let ele = $('#select-box-sale-person');
            $.fn.callAjax2({
                'url': ele.data('url'),
                'method': ele.data('method'),
                'isDropdown': true
            }).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                        is_load_sale_person = true;
                        $('#data-sale-person').val(JSON.stringify(data.employee_list));
                        // if (config_is_AM_create) {
                        data.employee_list.map(function (employee) {
                            if (employee.id === employee_current_id) {
                                ele.append(`<option value="${employee.id}" selected">${employee.full_name}</option>`);
                                $('#group_id_emp_login').val(employee.group.id);
                            }
                        })
                        // } else {
                        //     let emp_current = data.employee_list.find(obj => obj.id === employee_current_id);
                        //     let group_id = emp_current.group.id
                        //     $('#group_id_emp_login').val(group_id);
                        //     data.employee_list.map(function (employee) {
                        //         if (employee.group.id === group_id) {
                        //             if (employee.id === employee_current_id)
                        //                 ele.append(`<option value="${employee.id}" selected>${employee.full_name}</option>`);
                        //             else {
                        //                 ele.append(`<option value="${employee.id}">${employee.full_name}</option>`);
                        //             }
                        //         }
                        //     })
                        // }
                    }
                }
            }, (errs) => {
            },)
        }


        let dict_customer = {}
        let dict_sale_person = {}
        boxCustomer.on('change', function () {
            if (!config_is_AM_create) {
                if (Object.keys(dict_customer).length === 0) {
                    dict_customer = JSON.parse($('#data-customer').val()).reduce((obj, item) => {
                        obj[item.id] = item;
                        return obj;
                    }, {});
                }

                let list_sale_person = JSON.parse($('#data-sale-person').val());
                if (Object.keys(dict_sale_person).length === 0) {
                    dict_sale_person = list_sale_person.reduce((obj, item) => {
                        obj[item.id] = item;
                        return obj;
                    }, {});
                }

                let group_id = $('#group_id_emp_login').val();
                let select_box_sale_person = $("#select-box-sale-person");
                select_box_sale_person.html('');
                if (group_id === '') {
                    let emp_current = dict_sale_person[employee_current_id];
                    select_box_sale_person.append(`<option value="${emp_current.id}" selected">${emp_current.full_name}</option>`)
                }
                let list_customer_am = dict_customer[$(this).val()].manager.map(obj => obj.id)
                if (config_is_AM_create) {
                    list_sale_person.map(function (item) {
                        if (item.group.id === group_id && list_customer_am.includes(item.id)) {
                            select_box_sale_person.append(`<option value="${item.id}">${item.full_name}</option>`)
                        }
                    })
                }
                else{
                    list_sale_person.map(function (item) {
                        if (item.group.id === group_id) {
                            select_box_sale_person.append(`<option value="${item.id}">${item.full_name}</option>`)
                        }
                    })
                }

                select_box_sale_person.val(employee_current_id).trigger('change');
            }
        })
        $(document).on('click', '#create_opportunity_button', function () {
            if (!is_load_customer) {
                loadCustomer();
            }
            if (!is_load_product_category) {
                loadProductCategory();
            }
            if (!is_load_sale_person) {
                loadSalePerson();
            }
        })
    })
});