/*Blog Init*/
$(function () {
    let company_current_id = $('#company-current-id').attr('data-id')
    let dtb = $('#datable_company_list');
    let frm = new SetupFormSubmit(dtb);
    dtb.DataTableDefault({
        rowIdx: true,
        useDataServer: true,
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
                className: 'w-10',
                data: 'logo',
                render: (data, type, row, meta) => {
                    if (data){
                        return `<img src="${data}" style="width: 100px;"/>`
                    }
                    return ``;
                }
            },{
                data: 'code',
                className: 'wrap-text w-10',
                render: (data, type, row, meta) => {
                    return `<span class="w-80 badge badge-primary" href="/company/detail/` + row.id + `">${data}</span>`
                }
            }, {
                data: 'title',
                className: 'wrap-text w-35',
                'render': (data, type, row, meta) => {
                    if (data) {
                        return `<div class="media align-items-center">
                                    <div class="media-body">
                                        <a href="/company/detail/` + row.id + `">
                                            <span class="d-block"><b>` + row.title + `</b></span>
                                        </a>
                                    </div>
                                </div>`;
                    } else {
                        return ''
                    }
                }

            }, {
                className: 'w-15',
                data: 'date_created',
                render: (data, type, row, meta) => {
                    return $x.fn.displayRelativeTime(data);
                }
            }, {
                className: 'w-15',
                data: 'representative_fullname',
                render: (data, type, row, meta) => {
                    if (data) {
                        return `<div class="representative_fullname"><span class="fw-bold text-blue">` + data + `</span></div>`;
                    } else {
                        return `<div class="representative_fullname"><span class="fw-bold text-blue">` + $('input[name=default_representative_name]').val() + `</span></div>`;
                    }
                }
            }, {
                className: 'action-center w-10',
                render: (data, type, row, meta) => {
                    let btnOpenWebsite = `
                        <a href="${generate_ui_url(row?.['sub_domain'] || '')}" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btnRedirectToWebsite">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon"><i data-feather="external-link"></i></span>
                            </span>
                        </a>
                    `;
                    return `<div>${btnOpenWebsite}</div>`;
                }
            },
        ]
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
