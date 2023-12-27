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
                width: '5%',
                render: () => {
                    return '';
                },
            }, {
                width: "10%",
                data: 'logo',
                render: (data, type, row, meta) => {
                    if (data){
                        return `<img src="${data}" style="width: 100px;"/>`
                    }
                    return ``;
                }
            },{
                width: '10%',
                data: 'code',
                className: 'wrap-text',
                render: (data, type, row, meta) => {
                    return `<a href="/company/detail/` + row.id + `">${data}</a>`
                }
            }, {
                width: '20%',
                data: 'title',
                className: 'wrap-text',
                'render': (data, type, row, meta) => {
                    if (data) {
                        if (row.id === company_current_id) {
                            return `<div class="media align-items-center">
                                        <div class="media-head me-2">
                                            <div class="avatar avatar-xs avatar-primary avatar-rounded">
                                                <span class="initial-wrap"><b>` + row.title.charAt(0).toUpperCase() + `</b></span>
                                            </div>
                                        </div>
                                        <div class="media-body">
                                            <a href="/company/detail/` + row.id + `">
                                                <span class="d-block"><b>` + row.title + `</b></span>
                                            </a>
                                        </div>
                                    </div>`;
                        }
                        else {
                            return `<div class="media align-items-center">
                                        <div class="media-body">
                                            <a href="/company/detail/` + row.id + `">
                                                <span class="d-block"><b>` + row.title + `</b></span>
                                            </a>
                                        </div>
                                    </div>`;
                        }
                    } else {
                        return ''
                    }
                }

            }, {
                width: '20%',
                data: 'date_created',
                render: (data, type, row, meta) => {
                    return $x.fn.displayRelativeTime(data);
                }
            }, {
                width: '20%',
                data: 'representative_fullname',
                render: (data, type, row, meta) => {
                    if (data) {
                        return `<div class="representative_fullname"><span class="badge badge-primary">` + data + `</span></div>`;
                    } else {
                        return `<div class="representative_fullname"><span class="badge badge-primary">` + $('input[name=default_representative_name]').val() + `</span></div>`;
                    }
                }
            }, {
                width: '15%',
                className: 'action-center',
                render: (data, type, row, meta) => {
                    let btnOpenWebsite = `
                        <a href="${generate_ui_url(row?.['sub_domain'] || '')}" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btnRedirectToWebsite">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon"><i data-feather="external-link"></i></span>
                            </span>
                        </a>
                    `;

                    let bt1 = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover" id="del-company-button" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="Delete" href="" data-id="` + row.id + `"><span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span></a>`;
                    return `<div>${bt1}${btnOpenWebsite}</div>`;
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
