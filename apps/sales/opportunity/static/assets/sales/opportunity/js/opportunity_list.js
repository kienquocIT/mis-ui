"use strict";
$(function () {
    $(document).ready(function () {
        let boxCustomer = $('#select-box-opportunity-create-customer');
        let boxProductCategory = $('#select-box-product-category');

        let $table = $('#table_opportunity_list')
        let listURL = $table.attr('data-url')
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
                        return `<a href="${link}" target="_blank" class="link-primary underline_hover">${row.code}</a>`
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
                                data.account_list.map(function (item) {
                                    boxCustomer.append(`<option value="${item.id}">
                                                            <span class="account-title">${item.name}</span>
                                                        </option>`)
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
                'customer'
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            let csr = $("[name=csrfmiddlewaretoken]").val();
            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
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
    });
});