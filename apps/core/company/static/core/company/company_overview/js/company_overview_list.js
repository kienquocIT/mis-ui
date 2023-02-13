"use strict";
$(function () {
    $(document).ready(function () {
        let total_user_summary = 0;
        let power_user_summary = 0;
        let dtb = $('#datable_company_overview_list');
        let frm = new SetupFormSubmit(dtb);
        let config = {
            searching: false,
            ordering: false,
            paginate: false,
            // paginate: true,
            // pageLength: 2,
            language: {
                search: "",
                searchPlaceholder: "Search",
                info: "",
                sLengthMenu: "View  MENU",
            },
            drawCallback: function () {
                $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
                feather.replace();
            },
            data: [],
            columns: [{
                data: 'code', width: '10%', className: 'wrap-text', render: (data, type, row, meta) => {
                    return String.format(`<a href="{1}" class="btn btn-flush-primary">{0}</a>`, data, frm.getUrlDetail(row.id))
                }
            }, {
                data: 'title', width: '25%', className: 'wrap-text',
            }, {
                data: 'license_used', class: 'wrap-text', width: '35%', render: (data, type, row, meta) => {
                    let arr_html = [];
                    for (let i = 0; i < data.length; i++) {
                        if (typeof data[i] === 'object') {
                            arr_html += `<span class="badge badge-primary my-1">` + data[i].key + ` (` + data[i].quantity + `)` + `</span> `
                        }
                    }
                    return arr_html
                }
            }, {
                data: 'total_user', width: '10%', render: (data, type, row, meta) => {
                    return String.format(`<span class="badge badge-soft-success w-50">{0}</span>`, data)
                }
            }, {
                data: 'power_user', width: '10%', render: (data, type, row, meta) => {
                    return String.format(`<span class="badge badge-soft-warning w-50">{0}</span>`, data)
                }
            }, {
                data: 'employee_linked_user', width: '10%', render: (data, type, row, meta) => {
                    return String.format(`<span class="badge badge-soft-indigo w-100">{0} / {1}</span>`, row['employee_linked_user'], row['employee'],)
                }
            },{
                data: 'employee_linked_user', visible: false,  width: '10%', render: (data, type, row, meta) => {
                    return String.format(`<span class="badge badge-soft-indigo w-50">{0}</span>`, row['employee_linked_user'],)
                }
            },{
                data: 'employee', visible: false, width: '10%', render: (data, type, row, meta) => {
                    return String.format(`<span class="badge badge-soft-indigo w-50">{0}</span>`, row['employee'],)
                }
            },],

            footerCallback: function (row, data, start, end, display) {
				let api = this.api();

                let total6 = api
					.column(6)
					.data()
					.reduce(function(a, b)
					{
						return a + b;
					});

                let total7 = api
					.column(7)
					.data()
					.reduce(function(a, b)
					{
						return a + b;
					});

				$(api.column(3).footer()).html('<span class="badge badge-success w-50">' + total_user_summary + '</span>');
                $(api.column(4).footer()).html('<span class="badge badge-warning w-50">' + power_user_summary + '</span>');
                $(api.column(5).footer()).html('<span class="badge badge-indigo w-100">' + total6 + ' / ' + total7 + '</span>');
			},
        }
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data.company_list.length < 2) {
                $("tfoot").prop('hidden', true);
            };
            if (data && resp.hasOwnProperty('data') && resp.data.hasOwnProperty('company_list')) {
                config['data'] = resp.data['company_list'] ? resp.data['company_list'] : [];
                total_user_summary = resp.data['total_user_summary'] ? resp.data['total_user_summary'] : [];
                power_user_summary = resp.data['power_user_summary'] ? resp.data['power_user_summary'] : [];
            }
        }).then(() => dtb.DataTable(config));
    })
});
