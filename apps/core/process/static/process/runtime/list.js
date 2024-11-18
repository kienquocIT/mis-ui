$(document).ready(function () {
    const tbl$ = $('#tbl-process-runtime-list');
    const filterConfig$ = $(`<select class="form-select form-select-sm"></select>`);
    let configSelected = $x.fn.getUrlParameter('config');
    const configTitleSelected = $x.fn.getUrlParameter('config_name');

    const filterCreator$ = $(`<select class="form-select form-select-sm"></select>`);
    let creatorSelected = $x.fn.getUrlParameter('creator');
    let creatorExtData = $x.fn.getUrlParameter('creator_title')

    const filterMembers$ = $(`<select class="form-select form-select-sm"></select>`);
    let memberSelected = $x.fn.getUrlParameter('member_id');
    let memberExtData = $x.fn.getUrlParameter('member_id_title')

    const filterWasDone$ = $(`<select class="form-select form-select-sm"></select>`);
    let wasDoneSelected = $x.fn.getUrlParameter('done');

    const dtb_initial = tbl$.DataTableDefault({
        rowIdx: true,
        useDataServer: true,
        ajax: {
            url: tbl$.data('url'),
            method: 'GET',
            data: function (d) {
                if (configSelected) {
                    d['config_id'] = configSelected;
                }
                if (creatorSelected) {
                    d['employee_created_id'] = creatorSelected;
                }
                if (memberSelected){
                    d['members__contains'] = memberSelected;
                }
                if (typeof wasDoneSelected === 'boolean') {
                    d['was_done'] = wasDoneSelected;
                }
                return d;
            },
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data && resp.data.hasOwnProperty('process_runtime_list')) {
                    return resp.data['process_runtime_list'] ? resp.data['process_runtime_list'] : [];
                }
                throw Error('Call data raise errors.')
            },
        },
        authWidth: false,
        scrollX: true,
        columns: [
            {
                width: '5%',
                className: 'min-w-50p',
                render: () => '',
            },
            {
                width: '20%',
                className: 'min-w-200p',
                data: 'title',
                orderable: true,
                render: (data, type, row) => {
                    return `
                        <a href="${tbl$.data('url-detail').replace('__pk__', row.id)}">${data}</a>
                        <small class="d-inline-block text-ellipsis-multiple-2">${row?.remark || ''}</small>
                    `;
                }
            },
            {
                width: '15%',
                className: 'min-w-150p',
                data: 'config',
                render: (data) => {
                    let forOppHTML = '';
                    if (data.for_opp === true){
                        forOppHTML = `
                            <span 
                                class="icon text-primary pr-3 mr-2" 
                                style="border-right: 1px solid #6bb4ba;"
                                data-bs-toggle="tooltip"
                                title="${$.fn.gettext('For Opportunity')}"
                            ><i class="fa-regular fa-lightbulb"></i></span>
                        `;
                    }
                    return data ? `
                        ${forOppHTML}
                        <a href="${tbl$.data('url-process-detail').replaceAll('__pk__', data.id)}">${data.title}</a>
                        <small class="d-inline-block text-ellipsis-multiple-2">${data?.remark || ''}</small>
                    ` : '-';
                }
            },
            {
                data: 'employee_created',
                className: 'min-w-150p',
                width: '15%',
                render: (data, type, row) => {
                    if (data) {
                        let avatar_html = '';
                        if (data.avatar_img) {
                            avatar_html = `
                                <div class="avatar avatar-xs avatar-primary avatar-rounded" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${data?.full_name || ''}">
                                    <img src="${data.avatar_img}" alt="" class="avatar-img">
                                </div>
                            `;
                        }
                        const url = tbl$.data('url-employee-detail').replaceAll('__pk__', data.id);
                        return avatar_html + `<a href="${url}"><span>${data?.['full_name'] || ''}</span></a>`;
                    }
                    return '';
                }
            },
            {
                data: 'stage_current',
                className: 'min-w-150p',
                width: '15%',
                render: (data, type, row) => {
                    return Object.keys(data).length > 0 ? `
                        <span>${data.title}</span>
                        <br/>
                        <small class="d-inline-block text-ellipsis-multiple-2">${data?.remark || ''}</small>
                    ` : '-';
                }
            },
            {
                data: 'date_done',
                className: 'min-w-200p',
                width: '20%',
                orderable: true,
                render: (data, type, row) => {
                    if (row.was_done === true && row.date_done) {
                        const rlT = row?.['date_done'] ? $x.fn.displayRelativeTime(row['date_done'], {
                            'callback': function (data) {
                                return `<span>${data.relate}</span><br/><small>${data.output}</small>`;
                            }
                        }) : '';
                        return `
                            <span class="badge badge-success badge-indicator badge-indicator-xl"></span>
                            <span>${rlT}</span>
                        `;
                    }
                    return `
                        <span class="badge badge-light badge-indicator badge-indicator-xl"></span>
                        <span class="cus-badge ml-3">
                            ${row?.['stage_current']?.['order_number'] || '-'}/${row?.['amount_stages'] || '-'}
                        </span>
                    `;
                }
            },
            {
                width: '10%',
                className: 'min-w-100p',
                data: 'date_created',
                orderable: true,
                render: (data) => $x.fn.displayRelativeTime(data),
            },
        ],
        rowCallback: function (row, data) {
            $(row).find('[data-bs-toggle=tooltip]').tooltip();
            if (data?.['was_done'] === true && data?.['date_done']) {
                $(row).addClass('table-success').css('color', 'inherit');
            }
        },
        initComplete: function (settings, json) {
            let wrapper$ = tbl$.closest('.dataTables_wrapper');
            const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
            const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
            headerToolbar$.prepend(textFilter$);
            if (textFilter$.length > 0) {
                textFilter$.css('display', 'flex');

                textFilter$.append($(`<div class="d-inline-block min-w-150p mr-1"></div>`).append(filterConfig$));
                filterConfig$.initSelect2({
                    placeholder: $.fn.gettext('Process'),
                    ajax: {
                        url: tbl$.data('url-config-list'),
                        method: 'GET',
                    },
                    allowClear: true,
                    keyResp: 'process_list',
                    data: configSelected ? [
                        {
                            'id': configSelected,
                            'title': configTitleSelected,
                            'selected': true,
                        }
                    ] : [],
                    templateSelection: function (state) {
                        if (state.id) {
                            const showTxt = $x.fn.cutMaxlength(state.text, 20);
                            const valSelected = state.id ? `${$.fn.gettext('Process')}: ${showTxt}` : showTxt;
                            return $(`<span class="text-primary">${valSelected}</span>`);
                        }
                        return state.text;
                    },
                }).on('change', function () {
                    configSelected = $(this).val();
                    dtb_initial.ajax.reload();
                });

                textFilter$.append($(`<div class="d-inline-block min-w-200p mr-1"></div>`).append(filterCreator$));
                filterCreator$.initSelect2({
                    placeholder: $.fn.gettext("Creator"),
                    allowClear: true,
                    ajax: {
                        url: tbl$.data('url-employee-list'),
                        method: 'GET',
                        data: function (params) {
                            params['is_minimal'] = true;
                            return params;
                        },
                    },
                    keyResp: 'employee_list',
                    keyText: 'full_name',
                    data: creatorSelected ? [
                        {
                            'full_name': creatorExtData,
                            'id': creatorSelected,
                            'data': {
                                'id': creatorSelected,
                                'full_name': creatorExtData,
                            },
                            'selected': true,
                        }
                    ] : [],
                    templateResult: function (state) {
                        if (state.id) {
                            let activeHTML = '';
                            if (typeof state.data.is_active === 'boolean') {
                                activeHTML = state.data.is_active === true ? `<span class="badge badge-success badge-indicator ml-2"></span>` : '<span class="badge badge-secondary badge-indicator"></span>';
                            }
                            let groupHTML = ``;
                            if (state.data?.group) {
                                groupHTML = `<br/><span class="badge badge-primary">${state.data.group.title}</span>`
                            }
                            return $(`
                                <span>${state.data.full_name}</span>
                                ${activeHTML}
                                ${groupHTML}
                            `);
                        }
                        return state.text;
                    },
                    templateSelection: function (state) {
                        if (state.id) {
                            const valSelected = state.id ? `${$.fn.gettext("Creator")}: ${state.text}` : state.text;
                            return $(`<span class="text-primary">${valSelected}</span>`);
                        }
                        return state.text;
                    },
                }).on('change', function () {
                    creatorSelected = $(this).val();
                    dtb_initial.ajax.reload();
                });

                textFilter$.append($(`<div class="d-inline-block min-w-200p mr-1"></div>`).append(filterMembers$));
                filterMembers$.initSelect2({
                    placeholder: $.fn.gettext("Member"),
                    allowClear: true,
                    ajax: {
                        url: tbl$.data('url-employee-list'),
                        method: 'GET',
                        data: function (params) {
                            params['is_minimal'] = true;
                            return params;
                        },
                    },
                    keyResp: 'employee_list',
                    keyText: 'full_name',
                    data: memberSelected ? [
                        {
                            'full_name': memberExtData,
                            'id': memberSelected,
                            'data': {
                                'id': memberSelected,
                                'full_name': memberExtData,
                            },
                            'selected': true,
                        }
                    ] : [],
                    templateResult: function (state) {
                        if (state.id) {
                            let activeHTML = '';
                            if (typeof state.data.is_active === 'boolean') {
                                activeHTML = state.data.is_active === true ? `<span class="badge badge-success badge-indicator ml-2"></span>` : '<span class="badge badge-secondary badge-indicator"></span>';
                            }
                            let groupHTML = ``;
                            if (state.data?.group) {
                                groupHTML = `<br/><span class="badge badge-primary">${state.data.group.title}</span>`
                            }
                            return $(`
                                <span>${state.data.full_name}</span>
                                ${activeHTML}
                                ${groupHTML}
                            `);
                        }
                        return state.text;
                    },
                    templateSelection: function (state) {
                        if (state.id) {
                            const valSelected = state.id ? `${$.fn.gettext("Member")}: ${state.text}` : state.text;
                            return $(`<span class="text-primary">${valSelected}</span>`);
                        }
                        return state.text;
                    },
                }).on('change', function () {
                    memberSelected = $(this).val();
                    dtb_initial.ajax.reload();
                });

                textFilter$.append($(`<div class="d-inline-block min-w-200p mr-1"></div>`).append(filterWasDone$));
                filterWasDone$.initSelect2({
                    minimumResultsForSearch: -1,
                    placeholder: $.fn.gettext('Status'),
                    data: [
                        {
                            id: '',
                            title: '',
                            selected: true,
                        },
                        {
                            id: 'true',
                            title: $.fn.gettext('Finish'),
                        },
                        {
                            id: 'false',
                            title: $.fn.gettext('In progress'),
                        },
                    ],
                    allowClear: true,
                }).val('').on('change', function () {
                    wasDoneSelected = $(this).val() ? $(this).val() === 'true' : null;
                    dtb_initial.ajax.reload();
                });
            }
        },
    })
})