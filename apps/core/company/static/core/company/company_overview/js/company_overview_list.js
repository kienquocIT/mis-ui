"use strict";
$(function () {
    $(document).ready(function () {
        let dtb = $('#datable_company_overview_list');
        let frm = new SetupFormSubmit(dtb);
        let config = {
            searching: false, ordering: false, paginate: false, language: {
                search: "", searchPlaceholder: "Search", info: "", sLengthMenu: "View  MENU",
            }, drawCallback: function () {
                $('.dataTables_paginate > .pagination').addClass('custom-pagination pagination-simple');
                feather.replace();
            }, data: [], columns: [{
                data: 'code', className: 'wrap-text', render: (data, type, row, meta) => {
                    return String.format(`<a href="{1}" class="btn btn-flush-primary">{0}</a>`, data, frm.getUrlDetail(row.id))
                }
            }, {
                data: 'title', className: 'wrap-text',
            }, {
                data: 'license_used', class: 'wrap-text', width: '20%', render: (data, type, row, meta) => {
                    if (typeof data === 'object') {
                        let arr_html = [];
                        Object.keys(data).map((key) => {
                            let cls_name = '';
                            switch (key.toLowerCase()) {
                                case 'sale':
                                    cls_name = 'badge-success';
                                    break;
                                case 'e-office':
                                    cls_name = 'badge-primary';
                                    break;
                                case 'personal':
                                    cls_name = 'badge-secondary';
                                    break;
                                case 'hrm':
                                    cls_name = 'badge-indigo';
                                    break;
                                default:
                                    cls_name = 'badge-info';
                                    break;
                            }
                            arr_html.push(String.format_by_key(`<span href="#" class="badge {cls_name} my-1">{key} ({data})</span>`, {
                                'cls_name': cls_name, 'key': key.toUpperCase(), 'data': data[key],
                            }));
                        });
                        return arr_html.join(" ")
                    }
                    return '';
                }
            }, {
                data: 'total_user', width: '10%', render: (data, type, row, meta) => {
                    return String.format(`<span class="badge badge-soft-success">{0}</span>`, data)
                }
            }, {
                data: 'power_user', width: '10%', render: (data, type, row, meta) => {
                    return String.format(`<span class="badge badge-soft-warning">{0}</span>`, data)
                }
            }, {
                data: 'employee', width: '15%', render: (data, type, row, meta) => {
                    return String.format(`<span class="badge badge-soft-indigo">{0} / {1}</span>`, row['employee_linked_user'], row['employee'],)
                }
            },]
        }
        $.fn.callAjax(frm.dataUrl, frm.dataMethod).then((resp) => {
            let data = $.fn.switcherResp(resp);
            if (data && resp.hasOwnProperty('data') && resp.data.hasOwnProperty('company_list')) {
                config['data'] = resp.data['company_list'] ? resp.data['company_list'] : [];
            }
        }).then(() => dtb.DataTable(config));
    })
});
