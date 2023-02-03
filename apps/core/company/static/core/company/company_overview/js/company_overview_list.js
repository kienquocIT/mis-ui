"use strict";
$(function () {
    $(document).ready(function () {
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
                data: 'title', width: '30%', className: 'wrap-text',
            }, {
                data: 'license_used', class: 'wrap-text', width: '30%', render: (data, type, row, meta) => {
                    let arr_html = [];
                    for (let i = 0; i < data.length; i++) {
                        if (typeof data[i] === 'object') {
                            let cls_name = '';
                            if (data[i].key.toLowerCase() === 'sale') {
                                cls_name = 'badge-success w-20';
                            }
                            else if (data[i].key.toLowerCase() === 'e-office') {
                                cls_name = 'badge-primary w-20';
                            }
                            else if (data[i].key.toLowerCase() === 'personal') {
                                cls_name = 'badge-secondary w-20';
                            }
                            else if (data[i].key.toLowerCase() === 'hrm') {
                                cls_name = 'badge-indigo w-20';
                            }
                            else {
                                cls_name = 'badge-info w-20';
                            }
                            arr_html += `<span href="" class="badge ` + cls_name + ` my-1">` + data[i].key + ` (` + data[i].quantity + `)` + `</span> `
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
                    return String.format(`<span class="badge badge-soft-indigo w-50">{0} / {1}</span>`, row['employee_linked_user'], row['employee'],)
                }
            },{
                data: 'employee_linked_user', visible: false,  width: '10%', render: (data, type, row, meta) => {
                    return String.format(`<span class="badge badge-soft-indigo w-50">{0}</span>`, row['employee_linked_user'],)
                }
            },{
                data: 'employee', visible: false, width: '10%', render: (data, type, row, meta) => {
                    return String.format(`<span class="badge badge-soft-indigo w-50">{0}</span>`, row['employee'],)
                }
            },{
                data: 'license_used', visible: false, class: 'wrap-text', width: '10%', render: (data, type, row, meta) => {
                    for (let i = 0; i < data.length; i++) {
                        if (typeof data[i] === 'object') {
                            if (data[i].key.toLowerCase() === 'hrm') {
                                return `<span href="" class="badge badge-indigo my-1">` + data[i].quantity + `</span> `
                            }
                        }
                    }
                }
            },{
                data: 'license_used', visible: false, class: 'wrap-text', width: '10%', render: (data, type, row, meta) => {
                    for (let i = 0; i < data.length; i++) {
                        if (typeof data[i] === 'object') {
                            if (data[i].key.toLowerCase() === 'sale') {
                                return `<span href="" class="badge badge-success my-1">` + data[i].quantity + `</span> `
                            }
                        }
                    }
                }
            },{
                data: 'license_used', visible: false, class: 'wrap-text', width: '10%', render: (data, type, row, meta) => {
                    for (let i = 0; i < data.length; i++) {
                        if (typeof data[i] === 'object') {
                            if (data[i].key.toLowerCase() === 'personal') {
                                return `<span href="" class="badge badge-secondary my-1">` + data[i].quantity + `</span> `
                            }
                        }
                    }
                }
            },{
                data: 'license_used', visible: false, class: 'wrap-text', width: '10%', render: (data, type, row, meta) => {
                    for (let i = 0; i < data.length; i++) {
                        if (typeof data[i] === 'object') {
                            if (data[i].key.toLowerCase() === 'e-office') {
                                return `<span href="" class="badge badge-primary my-1">` + data[i].quantity + `</span> `
                            }
                        }
                    }
                }
            },],

            footerCallback: function (row, data, start, end, display) {
				let api = this.api();

				let total3 = api
					.column(3)
					.data()
					.reduce(function(a, b)
					{
						return a + b;
					});

                let total4 = api
					.column(4)
					.data()
					.reduce(function(a, b)
					{
						return a + b;
					});

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

                let total8 = api
					.column(8)
					.data()
					.reduce(function(a, b)
					{
                        for (let i = 0; i < a.length; i++) {
                            if (typeof a[i] === 'object') {
                                if (a[i].key.toLowerCase() === 'hrm') {
                                    a = a[i].quantity;
                                }
                            }
                        }
                        for (let i = 0; i < b.length; i++) {
                            if (typeof b[i] === 'object') {
                                if (b[i].key.toLowerCase() === 'hrm') {
                                    b = b[i].quantity;
                                }
                            }
                        }
						return a + b;
					});

                let total9 = api
					.column(9)
					.data()
					.reduce(function(a, b)
					{
                        for (let i = 0; i < a.length; i++) {
                            if (typeof a[i] === 'object') {
                                if (a[i].key.toLowerCase() === 'hrm') {
                                    a = a[i].quantity;
                                }
                            }
                        }
                        for (let i = 0; i < b.length; i++) {
                            if (typeof b[i] === 'object') {
                                if (b[i].key.toLowerCase() === 'hrm') {
                                    b = b[i].quantity;
                                }
                            }
                        }
						return a + b;
					});

                let total10 = api
					.column(10)
					.data()
					.reduce(function(a, b)
					{
                        for (let i = 0; i < a.length; i++) {
                            if (typeof a[i] === 'object') {
                                if (a[i].key.toLowerCase() === 'sale') {
                                    a = a[i].quantity;
                                }
                            }
                        }
                        for (let i = 0; i < b.length; i++) {
                            if (typeof b[i] === 'object') {
                                if (b[i].key.toLowerCase() === 'personal') {
                                    b = b[i].quantity;
                                }
                            }
                        }
						return a + b;
					});

                let total11 = api
					.column(11)
					.data()
					.reduce(function(a, b)
					{
                        for (let i = 0; i < a.length; i++) {
                            if (typeof a[i] === 'object') {
                                if (a[i].key.toLowerCase() === 'e-office') {
                                    a = a[i].quantity;
                                }
                            }
                        }
                        for (let i = 0; i < b.length; i++) {
                            if (typeof b[i] === 'object') {
                                if (b[i].key.toLowerCase() === 'hrm') {
                                    b = b[i].quantity;
                                }
                            }
                        }
						return a + b;
					});

				$(api.column(3).footer()).html('<span class="badge badge-soft-success w-50">' + total3 + '</span>');
                $(api.column(4).footer()).html('<span class="badge badge-soft-warning w-50">' + total4 + '</span>');
                $(api.column(5).footer()).html('<span class="badge badge-soft-indigo w-50">' + total6 + ' / ' + total7 + '</span>');
                $(api.column(2).footer()).html('<span href class="badge badge-indigo my-1 w-20">Hrm (' + total8 + ')</span> ' +
                    '<span href="" class="badge badge-success my-1 w-20">Sale (' + total9 + ')</span> ' +
                    '<span href="" class="badge badge-secondary my-1 w-20">Personal (' + total10 + ')</span> ' +
                    '<span href="" class="badge badge-primary my-1 w-20">E-Office (' + total11 + ')</span> ');
			},
        }
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data.company_list.length < 2) {
                $("tfoot").prop('hidden', true);
            };
            if (data && resp.hasOwnProperty('data') && resp.data.hasOwnProperty('company_list')) {
                config['data'] = resp.data['company_list'] ? resp.data['company_list'] : [];
            }
        }).then(() => dtb.DataTable(config));
    })
});
