$(document).ready(function () {
    function loadGoodsRegistrationList() {
        if (!$.fn.DataTable.isDataTable('#goods_registration_list')) {
            let dtb = $('#goods_registration_list');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                rowIdx: true,
                reloadCurrency: true,
                scrollX: true,
                scrollY: '64vh',
                scrollCollapse: true,
                fixedColumns: {
                    leftColumns: 2,
                    rightColumns: window.innerWidth <= 768 ? 0 : 1
                },
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            let res = [{
                                "id": null,
                                "title": $('#script-trans').attr('data-trans-general-registration'),
                                "code": null,
                                "sale_order": null,
                                "date_created": null
                            }]
                            return resp.data['goods_registration_list'] ? res.concat(resp.data['goods_registration_list']) : res;
                        }
                        return [];
                    },
                },
                columns: [
                    {
                        className: 'w-5',
                        render: () => {
                            return ``;
                        }
                    },
                    {
                        className: 'ellipsis-cell-xs w-15',
                        render: (data, type, row) => {
                            if (row?.['id']) {
                                const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                                return `<a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a>`;
                            }
                            return `--`
                        }
                    },
                    {
                        className: 'w-25',
                        render: (data, type, row) => {
                            if (row?.['id']) {
                                const link = dtb.attr('data-url-detail').replace('0', row?.['id']);
                                return `<a href="${link}" class="text-primary">${row?.['title']}</a>`;
                            }
                            else {
                                return `
                                    <a href="#" class="text-primary fw-bold">${row?.['title']}</a>&nbsp;
                                    <i class="fas fa-info-circle icon-info tit_visible_tb-head text-primary"
                                       data-bs-toggle="tooltip"
                                       data-bs-placement="right"
                                       title="${$('#script-trans').attr('data-trans-general-registration-info')}">
                                    </i>
                                `
                            }
                        }
                    },
                    {
                        className: 'w-20',
                        render: (data, type, row) => {
                            if (row?.['sale_order']) {
                                return `<span class="badge badge-secondary">${row?.['sale_order']?.['code']}</span>&nbsp;</span><span>${row?.['sale_order']?.['title']}</span>`
                            }
                            return `--`
                        }
                    },
                    {
                        className: 'w-15',
                        render: (data, type, row) => {
                            if (row?.['sale_order']) {
                                return `<span>${row?.['sale_order']?.['sale_person']?.['fullname']}</span>`
                            }
                            return `--`
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return row?.['employee_created'] ? WFRTControl.displayEmployeeWithGroup(row?.['employee_created']) : '--';
                        }
                    },
                    {
                        className: 'ellipsis-cell-sm w-10',
                        render: (data, type, row) => {
                            return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                        }
                    },
                ],
            });
        }
    }

    loadGoodsRegistrationList();

    function Call(sale_order_id, product_id) {
        let dataParam11 = {}
        dataParam11['product_id'] = product_id
        dataParam11['so_item__sale_order_id'] = sale_order_id
        let ajax1 = $.fn.callAjax2({
            url: $('#call-btn').attr('data-url'),
            data: dataParam11,
            method: 'GET'
        }).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && typeof data === 'object' && data.hasOwnProperty('regis_borrow_list')) {
                    return data?.['regis_borrow_list'];
                }
                return {};
            },
            (errs) => {
                console.log(errs);
            }
        )

        Promise.all([ajax1]).then(
            (results) => {
                console.log(results[0])
            })
    }

    function loadBoxSaleOrder(data) {
        $('#sale_order_id_box').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#sale_order_id_box').attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'sale_order_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    loadBoxSaleOrder()

    function loadBoxProduct(data) {
        $('#product_id_box').initSelect2({
            allowClear: true,
            ajax: {
                url: $('#product_id_box').attr('data-url'),
                method: 'GET',
            },
            data: (data ? data : null),
            keyResp: 'product_list',
            keyId: 'id',
            keyText: 'title',
        })
    }
    loadBoxProduct()

    $(document).on("click", '#call-btn', function () {
        Call($('#sale_order_id_box').val(), $('#product_id_box').val())
    })
})
