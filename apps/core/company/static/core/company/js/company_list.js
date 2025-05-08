/*Blog Init*/
$(function () {
    let company_current_id = $('#company-current-id').attr('data-id')
    let dtb = $('#datable_company_list');
    let frm = new SetupFormSubmit(dtb);
    dtb.DataTableDefault({
        rowIdx: true,
        useDataServer: true,
        scrollX: true,
        scrollY: '70vh',
        scrollCollapse: true,
        reloadCurrency: true,
        fixedColumns: {
            leftColumns: 3
        },
        ajax: {
            url: frm.dataUrl,
            type: frm.dataMethod,
            data: function (d) {
                d.is_done = false;
            },
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && data.hasOwnProperty('company_list')) {
                    return resp.data['company_list'] ? resp.data['company_list'] : [];
                }
                throw Error('Call data raise errors.')
            },
        },
        columns: [
            {
                className: 'w-5',
                render: () => {
                    return '';
                },
            }, {
                className: 'ellipsis-cell-md w-15',
                render: (data, type, row) => {
                    const link = `/company/detail/${row?.['id']}`
                    return `<div class="avatar avatar-rounded"><img class="avatar-img mr-2" alt="" src="${row?.['logo']}"/><a title="${row?.['code'] || '--'}" href="${link}" class="link-primary underline_hover fw-bold">${row?.['code'] || '--'}</a></div>`;
                }
            }, {
                className: 'ellipsis-cell-lg w-45',
                'render': (data, type, row) => {
                    const link = `/company/detail/${row?.['id']}`
                    return `<a href="${link}" class="link-primary underline_hover" title="${row?.['title']}">${row?.['title']}</a>`
                }

            }, {
                className: 'ellipsis-cell-sm w-15',
                render: (data, type, row) => {
                    return `<div class="representative_fullname"><span>${row?.['representative_fullname'] || $('input[name=default_representative_name]').val()}</span></div>`;
                }
            }, {
                className: 'ellipsis-cell-sm w-15',
                render: (data, type, row) => {
                    return $x.fn.displayRelativeTime(row?.['date_created'], {'outputFormat': 'DD/MM/YYYY'});
                }
            },
            // {
            //     className: 'text-center w-10',
            //     visible: false,
            //     render: (data, type, row) => {
            //         let btnOpenWebsite = `
            //             <a href="${generate_ui_url(row?.['sub_domain'] || '')}" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btnRedirectToWebsite">
            //                 <span class="btn-icon-wrap">
            //                     <span class="feather-icon"><i data-feather="external-link"></i></span>
            //                 </span>
            //             </a>
            //         `;
            //         return `<div>${btnOpenWebsite}</div>`;
            //     }
            // },
        ],
    });

    function generate_ui_url(sub_domain) {
        function getPortOfHost() {
            if (window.location.host.indexOf(":") !== -1) {
                let arr = window.location.host.split(":");
                return ":" + arr[arr.length - 1];
            }
            return "";
        }

        return window.location.protocol + '//' + sub_domain + '.' + dtb.attr('data-ui-domain') + getPortOfHost() + '/site/';
    }
});
