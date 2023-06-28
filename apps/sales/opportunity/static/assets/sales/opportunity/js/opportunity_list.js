"use strict";
$(function () {
    $(document).ready(function () {
        let boxCustomer = $('#select-box-opportunity-create-customer');
        let boxProductCategory = $('#select-box-product-category');

        let $table = $('#table_opportunity_list');
        let listURL = $table.attr('data-url');

        let employee_current_id = $('#employee_current_id').val();
        let config = JSON.parse($('#id-config-data').text());

        let config_is_AM_create = config.is_account_manager_create;

        let _dataTable = $table.DataTable({
            searching: false,
            language: {
                // search: "_INPUT_",
                // searchPlaceholder: "Search...",
                paginate: {
                    "previous": '<i data-feather="chevron-left"></i>',
                    "next": '<i data-feather="chevron-right"></i>'
                },
                info: 'Showing _START_ to _END_ of _TOTAL_ rows',
                lengthMenu: '_MENU_ rows per page',
            },
            dom: '<"top"f>rt<"bottom"ilp><"clear">',
            ordering: false,
            ajax: {
                url: listURL,
                type: "GET",
                dataSrc: 'data.opportunity_list',
                data: function (params) {
                    let txtSearch = $('#search_input').val();
                    if (txtSearch.length > 0)
                        params['search'] = txtSearch
                    params['is_ajax'] = true;
                    return params
                },
                error: function (jqXHR) {
                    $table.find('.dataTables_empty').text(jqXHR.responseJSON.data.errors)
                }
            },
            drawCallback: function () {
                // render icon after table callback
                feather.replace();
            },
            rowCallback: function (row, data) {
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

        $('#search_input').on('keyup', function (evt) {
            const keycode = evt.which;
            if (keycode === 13) //enter to search
                _dataTable.ajax.reload()
        });

        // Action on click dropdown customer
        boxCustomer.on('click', function (e) {
            if (!$(this)[0].innerHTML) {
                let url = $(this).attr('data-url');
                let method = $(this).attr('data-method');
                $.fn.callAjax(url, method).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            if (data.hasOwnProperty('account_list') && Array.isArray(data.account_list)) {
                                boxCustomer.append(`<option value=""></option>`);
                                $('#data-customer').attr('value', JSON.stringify(data.account_list));
                                data.account_list.map(function (item) {
                                    if (config_is_AM_create) {
                                        let list_manager = item.manager.map(obj => obj.id)
                                        if (list_manager.includes(employee_current_id)) {
                                            boxCustomer.append(`<option value="${item.id}">
                                                            <span class="account-title">${item.name}</span>
                                                        </option>`)
                                        }
                                    } else {
                                        boxCustomer.append(`<option value="${item.id}">
                                                            <span class="account-title">${item.name}</span>
                                                        </option>`)
                                    }
                                })
                            }
                        }
                    }
                )
            }
        });

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
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect').format_url_with_uuid(data.id), 1000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                        $.fn.notifyPopup({description: "Opportunity create fail"}, 'failure')
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

        loadProductCategory();

        function loadSalePerson() {
            let ele = $('#select-box-sale-person');
            $.fn.callAjax(ele.data('url'), ele.data('method')).then((resp) => {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    if (resp.hasOwnProperty('data') && resp.data.hasOwnProperty('employee_list')) {
                        $('#data-sale-person').val(JSON.stringify(data.employee_list));
                        if (config_is_AM_create) {
                            data.employee_list.map(function (employee) {
                                if (employee.id === employee_current_id) {
                                    ele.append(`<option value="${employee.id}" selected">${employee.full_name}</option>`);
                                    $('#group_id_emp_login').val(employee.group.id);
                                }
                            })
                        } else {
                            let emp_current = data.employee_list.find(obj => obj.id === employee_current_id);
                            let group_id = emp_current.group.id
                            $('#group_id_emp_login').val(group_id);
                            data.employee_list.map(function (employee) {
                                if (employee.group.id === group_id) {
                                    if (employee.id === employee_current_id)
                                        ele.append(`<option value="${employee.id}" selected>${employee.full_name}</option>`);
                                    else {
                                        ele.append(`<option value="${employee.id}">${employee.full_name}</option>`);
                                    }
                                }
                            })
                        }
                    }
                }
            }, (errs) => {
            },)
        }

        loadSalePerson();

        let dict_customer = {}
        let dict_sale_person = {}

        boxCustomer.on('change', function () {
            if (config_is_AM_create) {
                if (Object.keys(dict_customer).length === 0) {
                    dict_customer = JSON.parse($('#data-customer').val()).reduce((obj, item) => {
                        obj[item.id] = item;
                        return obj;
                    }, {});
                }

                if (Object.keys(dict_sale_person).length === 0) {
                    dict_sale_person = JSON.parse($('#data-sale-person').val()).reduce((obj, item) => {
                        obj[item.id] = item;
                        return obj;
                    }, {});
                }

                let customer = dict_customer[$(this).val()];
                let group_id = $('#group_id_emp_login').val();
                let select_box_sale_person = $("#select-box-sale-person");
                select_box_sale_person.html('');
                if (group_id === '') {
                    let emp_current = dict_sale_person[employee_current_id];
                    select_box_sale_person.append(`<option value="${emp_current.id}" selected">${emp_current.full_name}</option>`)
                }
                customer.manager.map(function (item) {
                    if (dict_sale_person[item.id].group.id === group_id) {
                        select_box_sale_person.append(`<option value="${item.id}" selected">${item.fullname}</option>`)
                    }
                })
                select_box_sale_person.val(employee_current_id).trigger('change');
            }
        })
    });
});