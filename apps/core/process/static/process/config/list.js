$(document).ready(function () {
    const tbl$ = $('#tbl-process-list');
    let [filterHasOpp, filterHasOpp$] = [null, $(`<select class="form-select form-select-sm"></select>`)];
    let [filterActive, filterActive$] = [null, $(`<select class="form-select form-select-sm"></select>`)];
    let [filterCreator, filterCreator$] = [null, $(`<select class="form-select form-select-sm"></select>`)]
    const dtb_initial = tbl$.DataTableDefault({
        rowIdx: true,
        useDataServer: true,
        ajax: {
            url: tbl$.attr('data-url'),
            type: 'GET',
            data: function (d){
                if (filterHasOpp) d['for_opp'] = filterHasOpp === 'true';
                if (filterActive) d['is_active'] = filterActive === 'true';
                if (filterCreator) d['employee_created'] = filterCreator;
                return d;
            },
            dataSrc: 'data.process_list',
        },
        autoWidth: false,
        columns: [
            {
                width: '5%',
                render: (data) => '',
            },
            {
                width: '15%',
                data: 'title',
                orderable: true,
                render: (data, type, row) => `<a href="${tbl$.data('url-detail').replace('__pk__', row.id)}">${data}</a>`,
            },
            {
                width: '15%',
                data: 'remark',
                render: (data) => data,
            },
            {
                width: '15%',
                data: 'date_created',
                orderable: true,
                render: (data) => $x.fn.displayRelativeTime(data),
            },
            {
                width: '15%',
                data: 'for_opp',
                render: (data) => {
                    const rdIdx = 'id-' + $x.fn.randomStr(32);
                    const ele$ = $(`
                        <div class="form-check form-switch">
                            <input type="checkbox" class="form-check-input" id="${rdIdx}" ${data === true ? "checked" : ""} disabled/>
                        </div>
                    `);
                    return ele$.prop('outerHTML');
                },
            },
            {
                width: '15%',
                data: 'is_active',
                render: (data) => {
                    const rdIdx = 'id-' + $x.fn.randomStr(32);
                    const ele$ = $(`
                        <div class="form-check form-switch">
                            <input type="checkbox" class="form-check-input" id="${rdIdx}" ${data === true ? "checked" : ""} disabled/>
                        </div>
                    `);
                    return ele$.prop('outerHTML');
                },
            },
            {
                width: '15',
                data: 'employee_created',
                render: (data) => {
                    if (data){
                        let avatar_html = '';
                        if (data.avatar_img){
                            avatar_html = `
                                <div class="avatar avatar-xs avatar-primary avatar-rounded" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${data?.full_name || ''}">
                                    <img src="${data.avatar_img}" alt="" class="avatar-img">
                                </div>
                            `;
                        }
                        return avatar_html + `<span>${data?.['full_name'] || ''}</span>`;
                    }
                    return '';
                },
            },
            {
                width: '5%',
                render: (data, type, row) => {
                    const btnRuntimeList = `
                        <a 
                            href="${tbl$.data('url-runtime')}?config=${row.id}&config_name=${row.title}"
                            data-bs-toggle="tooltip" title="${$.fn.gettext('Runtime list')}"
                        >
                            <button class="btn btn-icon btn-rounded btn-rounded btn-flush-primary"><span class="icon"><i class="fa-solid fa-list-ul"></i></span></button>
                        </a>
                    `;
                    const btnEdit = `
                        <a 
                            href="${tbl$.data('url-update').replaceAll('__pk__', row.id)}"
                            data-bs-toggle="tooltip" title="${$.fn.gettext('Edit')}"
                        >
                            <button class="btn btn-icon btn-rounded btn-rounded btn-flush-primary"><span class="icon"><i class="fa fa-edit"></i></span></button>
                        </a>
                    `;
                    return `<div class="d-flex">${btnRuntimeList + btnEdit}</div>`;
                },
            },
        ],
        rowCallback: (row) => $(row).find('[data-bs-toggle]').tooltip(),
        initComplete: function (settings, json) {
            let wrapper$ = tbl$.closest('.dataTables_wrapper');
            const headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
            const textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
            headerToolbar$.prepend(textFilter$);
            if (textFilter$.length > 0) {
                textFilter$.css('display', 'flex');

                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append(filterHasOpp$)
                ).append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append(filterActive$)
                ).append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append(filterCreator$)
                );
                filterHasOpp$.initSelect2({
                    placeholder: $.fn.gettext('For Opportunity'),
                    allowClear: true,
                    minimumResultsForSearch: -1,
                    data: [
                        {'id': '', 'title': ''},
                        {
                            'id': 'true',
                            'title': $.fn.gettext('Yes'),
                        },
                        {
                            'id': 'false',
                            'title': $.fn.gettext('No'),
                        }
                    ],
                    templateSelection: function (state) {
                        if (state.id){
                            const valSelected = state.id ? `${$.fn.gettext('For Opportunity')}: ${state.text}` : state.text;
                            return $(`<span class="text-primary">${valSelected}</span>`);
                        }
                        return state.text;
                    },
                }).on('change', function (){
                    filterHasOpp = $(this).val();
                    dtb_initial.ajax.reload();
                });
                filterActive$.initSelect2({
                    placeholder: $.fn.gettext('Active state'),
                    allowClear: true,
                    minimumResultsForSearch: -1,
                    data: [
                        {'id': '', 'title': ''},
                        {
                            'id': 'true',
                            'title': $.fn.gettext('Yes'),
                        },
                        {
                            'id': 'false',
                            'title': $.fn.gettext('No'),
                        }
                    ],
                    templateSelection: function (state) {
                        if (state.id){
                            const valSelected = state.id ? `${$.fn.gettext('Active state')}: ${state.text}` : state.text;
                            return $(`<span class="text-primary">${valSelected}</span>`);
                        }
                        return state.text;
                    },
                }).on('change', function (){
                    filterActive = $(this).val();
                    dtb_initial.ajax.reload();
                });
                filterCreator$.initSelect2({
                    placeholder: $.fn.gettext('Creator'),
                    allowClear: true,
                    ajax: {
                        url: tbl$.data('url-employee'),
                        method: 'GET',
                    },
                    keyResp: 'employee_list',
                    keyText: 'full_name',
                    templateResult: function (state){
                        let groupHTML = `<span class="badge badge-soft-primary">${state.data?.group?.title ? state.data.group.title : "_"}</span>`
                        let activeHTML = state.data?.is_active === true ? `<span class="badge badge-success badge-indicator"></span>` : `<span class="badge badge-light badge-indicator"></span>`;
                        return $(`<span>${state.text} ${activeHTML} ${groupHTML}</span>`);
                    },
                    templateSelection: function (state) {
                        if (state.id){
                            const valSelected = state.id ? `${$.fn.gettext('Creator')}: ${state.text}` : state.text;
                            return $(`<span class="text-primary">${valSelected}</span>`);
                        }
                        return state.text;
                    },
                }).on('change', function (){
                    filterCreator = $(this).val();
                    dtb_initial.ajax.reload();
                })
            }
        },
    });
})