$(document).ready(function () {
    class RenderData {
        constructor(props) {
            this.templateConfig = {
                url: '#',
                template_link: null,
                validate: {},
                columns: [], ...props?.['templateConfig'] || {}
            };
            this.sheetName = this.templateConfig?.['sheet_name'] || null;
            this.tbl$ = props?.['table'] || $('#tbl-display-data');
            if (!$(this.tbl$).attr('id')) this.tbl$.attr('id', $x.fn.randomStr(32));

            this.bodyData = [];

            this.keyMap = {};
            this.columnData = {};
            (this.templateConfig.columns || []).map((item, index) => {
                if (index !== 0) {
                    let input_title = item?.['name'] || null;
                    let input_name = item?.['input_name'] || null;
                    if (input_name && input_title) this.keyMap[input_name] = input_title;

                    this.columnData[index.toString()] = item;
                }
            })
        }

        getHeightAvailableForTable() {
            let pgWrapper = Number.parseFloat($('.hk-pg-wrapper').css('padding-top').replaceAll('px', ''));
            let simpleBar = Number.parseFloat($('.hk-pg-wrapper .simplebar-content').css('padding-top').replaceAll('px', ''));
            let blogHeader = Number.parseFloat($('.blog-header').css('height').replaceAll('px', ''));
            let btnUtilApp = Number.parseFloat($('#idx-box-data-btn-util-application').css('height').replaceAll('px', ''));
            let headTableHeight = 30 * this.get_class_col(this.columnData, true);
            let total = window.height - (pgWrapper + simpleBar + blogHeader + btnUtilApp + headTableHeight + 160);
            if (total < 380) return 380;
            return total;
        }

        get_class_col(listColConfig, isGetLineAmount=false) {
            let colNumber = 0;
            if (typeof listColConfig === 'object') {
                colNumber = Object.keys(listColConfig).length;
            } else if (Array.isArray(listColConfig)) {
                colNumber = listColConfig.length;
            }

            let colClass = '';
            let lineAmount = 1;
            switch (colNumber) {
                case 0:
                case 1:
                    colClass = 'col';
                    break
                case 2:
                    colClass = 'col-6';
                    break
                case 3:
                    colClass = 'col-4';
                    break
                case 5:
                case 6:
                    colClass = 'col-2';
                    break
                case 7:
                case 8:
                    lineAmount = 2;
                    colClass = 'col-3';
                    break
                case 9:
                case 10:
                case 11:
                case 12:
                    lineAmount = 2;
                    colClass = 'col-2';
                    break
                case 13:
                case 14:
                case 15:
                case 16:
                case 17:
                case 18:
                    lineAmount = 3;
                    colClass = 'col-2';
                    break
                case 19:
                case 20:
                case 21:
                case 22:
                case 23:
                case 24:
                    lineAmount = 4;
                    colClass = 'col-2';
                    break
                case 25:
                case 26:
                case 27:
                case 28:
                case 29:
                case 30:
                    lineAmount = 5;
                    colClass = 'col-2';
                    break
                case 31:
                case 32:
                case 33:
                case 34:
                case 35:
                case 36:
                    lineAmount = 6;
                    colClass = 'col-2';
                    break
                default:
                    colClass = 'col';
                    break
            }

            return isGetLineAmount === true ? lineAmount : colClass;
        }

        generate_col(config, colCls) {
            let colAttrs = {
                'style': 'min-width: 100px;',
                ...config?.['col_attrs'],
                'class': colCls + ' fimport-col-data mb-1 ' + (config?.['col_attrs']?.['class'] || ''),
            };
            let col$ = $(`<div></div>`);
            Object.keys(colAttrs).map((key) => {
                col$.attr(key, colAttrs[key]);
            })
            return col$;
        }

        generate_head() {
            let columnsConfig = this.templateConfig.columns || [];
            if (!columnsConfig) return false;

            // init row
            let row$ = $(`<div class="row"></div>`);
            let colCls = this.get_class_col(this.columnData);
            Object.keys(this.columnData).map(
                (index) => {
                    let item = this.columnData[index];
                    let col$ = this.generate_col({}, colCls).append(`<span class="badge badge-primary wrap-text">${item.name}</span>`);
                    let colRemark$ = $(`<div class="col fimport-remark-col"></div>`);
                    let colConfig = item?.['col_attrs'] || null;
                    if (colConfig) {
                        Object.keys(colConfig).map((key) => {
                            col$.attr(key, colConfig[key]);
                            colRemark$.attr(key, colConfig[key]);
                        })
                    }
                    if (item?.['is_primary_key'] === true) {
                        let iconPrimary = $(`<i class="fa-solid fa-key ml-1" style="color: blue;transform: rotate(-45deg);" data-bs-toggle="tooltip" title="${$.fn.gettext('Ident')} - ${$.fn.gettext('Unique')}"></i>`);
                        col$.append(iconPrimary);
                    }
                    if (item?.['is_foreign_key']) {
                        let iconPrimary = $(`<i class="fa-solid fa-key ml-1" style="color: green;transform: rotate(-45deg);" data-bs-toggle="tooltip" title="${$.fn.gettext("Foreign key")} - ${item?.['is_foreign_key']}"></i>`);
                        col$.append(iconPrimary);
                    }
                    if (item?.['is_unique'] === true){
                        let iconUnique = $(`<i class="fa-regular fa-star ml-1" style="color: #ffc400;" data-bs-toggle="tooltip" title="${$.fn.gettext("Unique")}"></i>`);
                        col$.append(iconUnique);
                    }
                    if ((item?.['is_unique_together'] || []).length > 0){
                        let iconUnique = $(`<i class="fa-solid fa-star ml-1" style="color: #ff9100;" data-bs-toggle="tooltip" title="${$.fn.gettext("Unique together")}: ${(item?.['is_unique_together'] || []).join(' - ')}"></i>`);
                        col$.append(iconUnique);
                    }

                    // attribute
                    let txtAttribute = [];
                    let hadType = false;
                    if (item?.['type']){
                        hadType = true;
                        switch (item?.['type']) {
                            case 'number':
                                txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('type')}: ${$.fn.gettext('Number')}</small></li>`);
                                break
                            case 'string':
                                txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('type')}: ${$.fn.gettext('String')}</small></li>`);
                                break
                            case 'array split by commas':
                                txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('type')}: ${$.fn.gettext('Array split by commas')}</small></li>`);
                                break
                            case 'json':
                                txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('type')}: ${$.fn.gettext('json')}</small></li>`);
                                break
                            case 'phone number vietnam':
                                txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('type')}: ${$.fn.gettext('Phone number Vietnam')}</small></li>`);
                                break
                            case 'email':
                                txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('type')}: ${$.fn.gettext('Email address')}</small></li>`);
                                break
                            default:
                                hadType = false;
                                break;
                        }

                    }
                    if (item?.['input_attrs']) {
                        (item?.['input_attrs']?.['args'] || []).map(
                            (item2) => {
                                switch (item2) {
                                    case "required":
                                        col$.append(`<i class="fa-solid fa-asterisk fa-2xs ml-1" style="color:red;" data-bs-toggle="tooltip" title="${$.fn.gettext('required')}"></i>`)
                                        // txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('required')}</small></li>`)
                                        break
                                    case "data-unique":
                                        txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('unique')}</small></li>`)
                                        break
                                }
                            }
                        )
                        let kwargs = item?.['input_attrs']?.['kwargs'] || {};
                        for (let item2 in kwargs) {
                            switch (item2) {
                                case "type":
                                    if (hadType === false)
                                        txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('type')}: ${kwargs[item2]}</small></li>`)
                                    break
                                case "minlength":
                                    txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('minlength')}: ${kwargs[item2]}</small></li>`)
                                    break
                                case "maxlength":
                                    txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('maxlength')}: ${kwargs[item2]}</small></li>`)
                                    break
                                case "data-valid-phone-vn":
                                    let state = kwargs[item2] === true ? $.fn.gettext('True') : $.fn.gettext('False');
                                    txtAttribute.push(`<li><small class="no-transform">${$.fn.gettext('Phone Number Vietnam')}: ${state}</small></li>`)
                                    break
                            }
                        }
                        if (txtAttribute.length > 0) {
                            txtAttribute = `<ul class="fimport-remark-col" style="display: none;">${txtAttribute.join("")}</ul>`;
                        } else {
                            txtAttribute = '';
                        }
                    }

                    // remarks
                    let txtRemarks = '';
                    if (Array.isArray(item.remarks)) {
                        txtRemarks = item.remarks.map(
                            (item2) => {
                                return `<li><small class="no-transform">${item2}</small></li>`
                            }
                        ).join("")
                    } else if (item.remarks) {
                        txtRemarks = `<li><small class="no-transform">${item.remarks.toString()}</small></li>`;
                    }
                    if (txtRemarks) txtRemarks = `<ul class="fimport-remark-col" style="display: none;">${txtRemarks}</ul>`

                    //
                    col$.append(`${txtAttribute}${txtRemarks}`);
                    row$.append(col$);
                }
            )

            // setup thead
            let headStart$ = `
                <button 
                    id="inp-checkall" 
                    class="btn btn-icon btn-success btn-xs btn-square mr-1 mb-1" type="button"
                    data-bs-toggle="tooltip"
                    title="${$.fn.gettext('Check all in current page')}"
                >
                    <span class="icon"><i class="fa-solid fa-check"></i></span>
                </button>
                <button 
                    id="inp-un-checkall" 
                    class="btn btn-icon btn-danger btn-xs btn-square mr-1 mb-1" type="button"
                    data-bs-toggle="tooltip"
                    title="${$.fn.gettext('Un-check all in current page')}"
                >
                    <span class="icon"><i class="fa-solid fa-xmark"></i></span>
                </button>
            `
            let headEnd$ = `
                <button 
                    id="inp-save-checkall-selected" 
                    class="btn btn-icon btn-primary btn-xs btn-square" type="button"
                    data-bs-toggle="tooltip"
                    title="Save all in current page"
                >
                    <span class="icon"><i class="fa-solid fa-save"></i></span>
                </button>
            `;
            let thead$ = $(`
                <thead>
                    <tr class="dataShowInfo">
                        <th class="no-transform">${headStart$}</th>
                        <th class="no-transform">
                            <button 
                                id="inp-show-info" 
                                class="btn btn-icon btn-light btn-xs btn-square mr-1 mb-1" type="button"
                                data-bs-toggle="tooltip"
                                title="${$.fn.gettext('Show / hide remarks of columns')}"
                            >
                                <span class="icon"><i class="fa-solid fa-info"></i></span>
                            </button>
                        </th>
                        <th class="no-transform">${row$.prop('outerHTML')}</th>
                        <th class="no-transform">${headEnd$}</th>
                    </tr>
                </thread>
            `);

            // add thead to table
            this.tbl$.append(thead$);

            // on collapse
            $(this.tbl$).find('#inp-show-info').off('click').on('click', function () {
                $(this).closest('table').find('.dataShowInfo .fimport-remark-col').toggle('fast');
            })
        }

        get_columns() {
            let columnData = this.columnData || {};

            function generate_form_group(data, config, dataIndex) {
                let group$ = $(`<div class="form-group position-relative fimport-main-group-input"></div>`);

                let inp$ = null;
                let dataList$ = null;
                let select2Config$ = null;

                const inputType = config?.['type'] || null;
                const dataList = config?.['data_list'] || [];
                const selectConfig = config?.['select2_config'] || {};
                switch (inputType) {
                    case 'select':
                        inp$ = $(`<select class="form-select"></select>`);
                        dataList.map(
                            (item) => {
                                let selectedTxt = item[0].toString() === data.toString() ? "selected" : "";
                                inp$.append(`<option value="${$x.fn.escapeHTML(item[0])}" ${selectedTxt}>${$x.fn.escapeHTML(item[1])}</option>`);
                            }
                        )
                        Object.keys(selectConfig).map(
                            key => {
                                switch (key) {
                                    case 'multiple':
                                        inp$.prop('multiple', selectConfig[key] === true);
                                        break
                                    default:
                                        inp$.attr(`data-${key}`, selectConfig[key]);
                                        break
                                }
                            }
                        )
                        select2Config$ = $(`<script type="application/json" class="fimport-select2-config">${JSON.stringify(selectConfig)}</script>`);
                        break
                    default:
                        // inp$ = $(`<input class="form-control" value="${data ? $x.fn.escapeHTML(data) : ''}"/>`);
                        inp$ = $(`<input class="form-control" />`);
                        if (dataList.length > 0){
                            let idGen = $x.fn.randomStr(32, true);
                            dataList$ = $(`<datalist id="${idGen}"></datalist>`);
                            dataList.map(
                                (item) => {
                                    dataList$.append(`<option value="${item[0]}">${item[1]}</option>`);
                                }
                            )
                            inp$.attr('list', idGen);
                        }
                        break
                }

                if (inp$ instanceof jQuery && inp$.length > 0){
                    let inpName = config?.['input_name'] || null;
                    if (inpName) inp$.attr('name', inpName);

                    let inpAttrs = {
                        'args': !!(config?.['input_attrs'] || null) ? [] : ['disabled', 'readonly'],
                        'kwargs': {
                            class: 'form-control-plaintext',
                        }, ...config?.['input_attrs'] || {},
                    };
                    inp$
                        .attr('data-index', dataIndex);
                    group$
                        .attr('data-bs-toggle', 'tooltip')
                        .attr('title', `${$.fn.gettext('Data field')}: ${config.name || ''}`);

                    // fill args kwargs to input
                    inpAttrs.args.map((attData) => inp$.prop(attData, true))
                    Object.keys(inpAttrs.kwargs).map((key) => {
                        inp$.attr(key, inpAttrs.kwargs[key]);
                    })
                    group$.append(inp$);
                    if (dataList) group$.append(dataList$);
                    if (select2Config$) group$.append(select2Config$);

                    //
                    let groupBigEdit$ = $(``);
                    if (config?.['allow_edit_big_field'] === true) {
                        group$.append(
                            `<button 
                            type="button" 
                            class="btn btn-icon btn-rounded btn-warning btn-xs btnBigInputEdit"
                            data-bs-toggle="tooltip"
                            title="${$.fn.gettext('Edit with big field')}"
                        ><span class="icon"><i class="fa-solid fa-pen"></i></span></button>`
                        );

                        groupBigEdit$ = $(`
                        <div 
                            class="form-group position-relative fimport-sub-group-input" style="display: none;"
                            data-bs-toggle="tooltip"
                            title="${$.fn.gettext('Update value to main field and close')}"
                        ></div>
                    `)
                        groupBigEdit$.append(
                            `<textarea 
                            rows="4"
                            class="form-control textareaUpdateInputCell"
                            data-bs-toggle="tooltip" title="${$.fn.gettext('You can resize the input box by clicking and dragging the button at the bottom right corner.')}"
                        ></textarea>`
                        ).append(
                            `<button 
                            type="button" 
                            class="btn btn-icon btn-rounded btn-success btn-xs btnBigInputSave"><span class="icon"><i class="fa-solid fa-check"></i></span>
                        </button>`
                        );
                    }
                    return [group$, groupBigEdit$];
                } else {
                    console.log('Create input fail with config:', dataIndex, data, config);
                }
                return [null, null];
            }

            return [
                {
                    width: "70px",
                    data: 'selected',
                    className: 'my-custom-align',
                    render: (data, type, row) => {
                        let idxInpCheckAll = `id-${$x.fn.randomStr(32)}`;
                        let checkedTxt = data === true ? 'checked' : '';
                        return `
                            <div class="form-check form-check-lg">
                                <input type="checkbox" class="form-check-input inp-checkall" id="${idxInpCheckAll}" ${checkedTxt}>
                                <label class="form-check-label d-none" for="${idxInpCheckAll}"></label>
                            </div>
                        `;
                    }
                },
                {
                    width: "30px",
                    data: "data",
                    className: 'my-custom-align',
                    render: (data, type, row) => {
                        return data?.[0] || '';
                    }
                },
                {
                    // width: "80%",
                    data: 'data',
                    className: 'my-custom-align',
                    render: (data, type, row) => {
                        let cell$ = $(`<div class="row"></div>`);
                        let colCls = this.get_class_col(columnData);

                        for (let key_index in columnData) {
                            let config = columnData[key_index.toString()];

                            let col$ = this.generate_col(config, colCls);
                            col$.attr('data-index', key_index);

                            let [group$, groupBigEdit$] = generate_form_group(data?.[key_index] || '', config, key_index);
                            let groupOfCol$ = $(`<div class="fimport-cell-data"></div>`);
                            groupOfCol$.append(group$).append(groupBigEdit$);
                            col$.append(groupOfCol$);
                            cell$.append(col$);
                        }
                        return `<form data-url="${this.templateConfig.url}" data-method="POST" id="${$x.fn.randomStr(32)}">${cell$.prop('outerHTML')}</form>`;
                    }
                }, {
                    width: '30px',
                    className: 'my-custom-align',
                    render: (data, type, row) => {
                        return `<button class="btn btn-icon btn-outline-primary btn-xs btn-square btnSubmit" type="button" disabled><span class="icon"><i class="fa-solid fa-save"></i></span></button>`
                    }
                }
            ]
        }

        render_data(data) {
            // not process when data type is not correct
            if (!(data && Array.isArray(data) && data.length > 0)) return false;

            $x.fn.showLoadingPage();
            setTimeout(() => {
                this.bodyDatas = data.map(item => {
                    let dataTmp = {};
                    (Array.isArray(item) ? item : []).map((child, index) => {
                        dataTmp[index.toString()] = child;
                    })
                    return {
                        'id': `id-${$x.fn.randomStr(32)}`,
                        'data': dataTmp,
                        'selected': false,
                    }
                });
                // console.log('this.bodyDatas:', this.bodyDatas);
                this.tbl$.DataTable().clear().rows.add(this.bodyDatas).draw();

                // hide selected on table when reload data
                let wrapper$ = this.tbl$.closest('.dataTables_wrapper');
                wrapper$.find('.btnAddFilter').hide();
                wrapper$.find('.textFilter').empty().removeClass('hidden').hide();

                setTimeout(() => $x.fn.hideLoadingPage(), 300)
            }, 300)
        }

        render_frame() {
            let clsThis = this;

            // destroy datatable if exist
            if ($.fn.DataTable.isDataTable('#' + this.tbl$.attr('id'))) this.tbl$.DataTable().destroy();

            this.tbl$.empty();

            this.generate_head();

            function addToSelected(data, idCheck) {
                let idx = idCheck ? RenderData.getIdSelectedGroup(idCheck) : RenderData.getIdSelectedGroup(data['id']);
                if (clsThis.textBtn$.find(`#${idx}`).length === 0) {
                    clsThis.textBtn$.append(`<span class="badge badge-primary mr-1 mb-1 dtb-selected-item" id="${idx}">${data.data ? data.data['0'] : ''}</span>`);
                }
                if (clsThis.textBtn$.children().length === 0) {
                    clsThis.textBtn$.hide();
                } else {
                    clsThis.textBtn$.show();
                }
            }

            function removeToSelected(data, idCheck) {
                let idx = idCheck ? RenderData.getIdSelectedGroup(idCheck) : RenderData.getIdSelectedGroup(data['id']);
                clsThis.textBtn$.find(`#${idx}`).remove();
                if (clsThis.textBtn$.children().length === 0) {
                    clsThis.textBtn$.hide();
                } else {
                    clsThis.textBtn$.show();
                }
            }

            function emptyToSelected(isHide = false) {
                clsThis.textBtn$.children().remove();
                isHide === true ? clsThis.textBtn$.hide() : null;
            }

            let dataTbl = this.tbl$.DataTableDefault({
                searching: true,
                autoWidth: false,
                columns: this.get_columns(),
                data: [],
                scrollCollapse: true,
                scrollY: `${this.getHeightAvailableForTable()}px`,
                scrollX: true,
                initComplete: function () {
                    $x.fn.hideLoadingPage();
                    clsThis.btnCheckAll = $('#inp-checkall');
                    clsThis.btnCheckAll
                        .off('click')
                        .on('click', function () {
                            let eleTmp = clsThis.tbl$.find('input[type=checkbox].inp-checkall:not([disabled])');
                            if (eleTmp.length === 0) $x.fn.hideLoadingPage(); else {
                                $x.fn.showLoadingPage({
                                    didOpenStart: function () {
                                        clsThis.btnCheckAll.prop('disabled', true);
                                        clsThis.btnUnCheckAll.prop('disabled', true);
                                    },
                                    didOpenEnd: function () {
                                        setTimeout(() => {
                                            $.each(eleTmp, function (index, value) {
                                                if (index === eleTmp.length - 1) {
                                                    $(value).attr('data-disabled-button-all', 'false');
                                                    setTimeout(() => {
                                                        $x.fn.hideLoadingPage();
                                                    }, 100);
                                                }
                                                $(value)
                                                    .prop('checked', true)
                                                    .trigger('change');
                                            });
                                        }, 200);
                                    }
                                })
                            }
                        });

                    clsThis.btnUnCheckAll = $('#inp-un-checkall');
                    clsThis.btnUnCheckAll
                        .off('click')
                        .on('click', function () {
                            let eleTmp = clsThis.tbl$.find('input[type=checkbox].inp-checkall:not([disabled])');
                            if (eleTmp.length === 0) $x.fn.hideLoadingPage(); else {
                                $x.fn.showLoadingPage({
                                    didOpenStart: function () {
                                        clsThis.btnCheckAll.prop('disabled', true);
                                        clsThis.btnUnCheckAll.prop('disabled', true);
                                    },
                                    didOpenEnd: function () {
                                        setTimeout(() => {
                                            $.each(eleTmp, function (index, value) {
                                                if (index === eleTmp.length - 1) {
                                                    $(value).attr('data-disabled-button-all', 'false');
                                                    setTimeout(() => {
                                                        $x.fn.hideLoadingPage();
                                                    }, 100);
                                                }
                                                $(value)
                                                    .prop('checked', false)
                                                    .trigger('change');
                                            });
                                        }, 200);
                                    },
                                })
                            }
                        });

                    clsThis.wrapper$ = clsThis.tbl$.closest('.dataTables_wrapper');

                    clsThis.groupBtn$ = clsThis.wrapper$.find('.btnAddFilter');
                    clsThis.groupBtn$
                        .addClass('border border-1 p-2')
                        // .append(`<button id="btnSelectedClean" class="btn btn-xs btn-danger btn-icon btn-square mr-1 mb-1"><span class="icon"><i class="fa-solid fa-xmark"></i></span></button>`)
                        // .append(`<button id="btnSelectedSave" class="btn btn-xs btn-success btn-icon btn-square mr-1 mb-1"><span class="icon"><i class="fa-solid fa-save"></i></span></button>`)
                        .hide();

                    clsThis.textBtn$ = clsThis.wrapper$.find('.textFilter');
                    clsThis.textBtn$
                        .removeClass('hidden')
                        .addClass('mr-1')
                        .hide()

                    // clsThis.tex?tBtn$ = $('#groupDataSelected');
                    // clsThis.textBtn$.hide();

                    clsThis.dtbBodyScroll$ = clsThis.wrapper$.find('.dataTables_scrollBody');

                    clsThis.bodyScrollToRow = function bodyScrollToRow(row$) {
                        let dataScroll = row$[0].offsetTop - clsThis.dtbBodyScroll$[0].offsetTop;
                        clsThis.dtbBodyScroll$.animate({
                            scrollTop: dataScroll
                        })
                    }

                    clsThis.btnSaveSelected$ = $('#inp-save-checkall-selected');
                    clsThis.btnSaveSelected$.off('click').on('click', async function () {
                        let arrItem$ = [];
                        clsThis.textBtn$.find('.dtb-selected-item').each(function () {
                            let eleSelected = $(this);
                            arrItem$.push(eleSelected);
                        });

                        for (let eleSelected of arrItem$) {
                            let idx = $(eleSelected).attr('id').replaceAll('row-data-selected-', '');
                            let tr$ = clsThis.tbl$.find('input#' + idx).closest('tr')
                            let frm$ = tr$.find('form');
                            if (frm$.length > 0) {
                                clsThis.bodyScrollToRow(tr$);
                                tr$.removeClass('selected').addClass('fimport-in-progress');
                                eleSelected.removeClass('badge-primary').addClass('badge-warning');

                                // solution 1: call trigger
                                // frm$.trigger( "submit" );

                                // solution 2: call function with await
                                let state = await clsThis.formSubmit(frm$);
                                if (state !== true){
                                    $.fn.notifyB({
                                        'description': $.fn.gettext('The saving loop was broken due to an error.')
                                    }, 'failure')
                                    break;
                                }
                            }
                            await $x.fn.sleep(1000)
                        }
                    })
                },
                enableVisibleColumns: false,
                lengthMenu: [
                    [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 75, 100, 150, 200, -1], [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 75, 100, 150, 200, $.fn.transEle.attr('data-all')],
                ],
                pageLength: 10,
                rowCallback: function (row, data, displayNum, displayIndex, dataIndex) {
                    $(row).find('.btnBigInputEdit').off('click').on('click', function () {
                        let btnThis = $(this);

                        // handle event big editor of field
                        let mainGroup = $(this).closest('.fimport-main-group-input');
                        let subGroup = mainGroup.parent().find('.fimport-sub-group-input');
                        if (mainGroup.length > 0 && subGroup.length > 0) {
                            let mainInput = mainGroup.find('input');
                            let subTextarea = subGroup.find('textarea');
                            let subBtn = subGroup.find('.btnBigInputSave');
                            if (mainInput.length > 0 && subTextarea.length > 0 && subBtn.length > 0) {
                                subTextarea.val(mainInput.val());

                                subTextarea.off('input').on('input', function () {
                                    mainInput.val(subTextarea.val()).trigger('change');
                                })

                                subGroup.slideToggle('fast', function () {
                                    mainInput.prop('readonly', subGroup.is(':visible'));
                                    if (subGroup.is(':visible') === true) {
                                        btnThis.closest('.fimport-col-data').find('.fimport-cell-data').addClass('edit-big-field-open');
                                    } else {
                                        btnThis.closest('.fimport-col-data').find('.fimport-cell-data').removeClass('edit-big-field-open');
                                    }
                                });
                                subBtn.off('click').on('click', function () {
                                    mainInput.prop('readonly', false);
                                    mainInput.val(subTextarea.val()).trigger('change');
                                    subGroup.slideUp('fast');
                                    btnThis.closest('.fimport-col-data').find('.fimport-cell-data').removeClass('edit-big-field-open');
                                })
                            }
                        }
                    })

                    // get data support listen, push data, valid
                    if (!$(row).attr('id')) $(row).attr('id', `id-${$x.fn.randomStr(32)}`);
                    $(row).attr('data-url', '#');
                    $(row).attr('data-method', "POST");
                    let frm$ = $(row).find('form');
                    let btn$ = $(row).find('button.btnSubmit');
                    let inpCheckAll$ = $(row).find('input[type=checkbox].inp-checkall');

                    // set value for ':input' by data-index
                    let dataOfRow = data.data || {};
                    Object.keys(dataOfRow).map(key => frm$.find(`:input[data-index=${key}]`).val(dataOfRow[key]))

                    // button click call on-submit
                    btn$
                        .off('click')
                        .on('click', function () {
                            $(this).prop('disabled', true);
                            frm$.trigger('submit');
                            setTimeout(() => $(this).prop('disabled', false), 1000)
                        });

                    // define trigger 'valid' for row (tr element)
                    $(row).on('valid', function () {
                        if (frm$.valid()) {
                            inpCheckAll$.prop('checked') === true ? addToSelected(data, inpCheckAll$.attr('id')) : removeToSelected(data, inpCheckAll$.attr('id'));
                            inpCheckAll$.prop('disabled', false);
                            btn$.prop('disabled', false);
                        } else {
                            removeToSelected(data);
                            inpCheckAll$.prop('checked', false).prop('disabled', true);
                            btn$.prop('disabled', true);
                        }

                        // state disabled button all
                        if ($(inpCheckAll$).attr('data-disabled-button-all') === 'false') {
                            $(inpCheckAll$).removeAttr('data-disabled-button-all')
                            setTimeout(() => {
                                clsThis.groupBtn$.find('button').prop('disabled', false);
                                clsThis.btnCheckAll.prop('disabled', false);
                                clsThis.btnUnCheckAll.prop('disabled', false);
                            },);
                        }
                    });

                    // setup validate for form
                    new SetupFormSubmit(frm$).validate({
                        rules: clsThis.templateConfig?.['validate'] || {},
                        submitHandler: async function (form, event) {
                            return await clsThis.formSubmit(form);
                        },
                    });

                    // on change handle valid this form (all field in form)
                    inpCheckAll$
                        .off('change')
                        .on('change', function () {
                            if (!$(this).attr('id')) $(this).attr('id', `inp-${$x.fn.randomStr(32)}`);
                            let state = $(this).prop('checked');
                            if (state === true){
                                $(row).addClass('selected');
                                $(row).trigger('valid');
                            } else $(row).removeClass('selected');
                        });

                    let inp$ = $(frm$).find('input:not(:disabled):not(.form-control-plaintext)');

                    // on input handle valid this field (only this field fire 'input' trigger)
                    inp$
                        .off('change')
                        .on('change', function(){
                            // on change call valid in form
                            $(row).trigger('valid')
                        })
                        .off('input')
                        .on('input', function (){
                            // input calling valid in field.
                            $(this).valid();
                        });

                    // init select2 for all select in form (get config from script.fimport-select2-config in form-group
                    let select$ = $(frm$).find('select:not(:disabled):not(.form-control-plaintext)');
                    select$.each(function (){
                        $(this).off('change');

                        let select2Config$ = $(this).closest('.form-group').find('script.fimport-select2-config');
                        let select2Config = select2Config$.length > 0 ? JSON.parse(select2Config$.text()) : {};

                        if ($(this).hasClass("select2-hidden-accessible")) $(this).select2('destroy');
                        $(this).initSelect2(select2Config);

                        $(this).on('change', function (){
                            $(this).valid();
                        });
                    })

                    // valid when callback firing after 0.2s
                    setTimeout(() => $(row).trigger('valid'), 200);
                },
            });

            dataTbl.on('page', function () {
                // let info = dataTbl.page.info();
                emptyToSelected();
                clsThis.tbl$.find('input[type=checkbox].inp-checkall[checked]').trigger('change');
            });
        }

        static getIdSelectedGroup(inpCheckAllID) {
            return `row-data-selected-${inpCheckAllID}`
        }

        resolve_callback(inpCheckAll$) {
            let clsThis = this;
            setTimeout(
                () => {
                    let row$ = inpCheckAll$.closest('tr');
                    row$.removeClass('fimport-in-progress');

                    let selectedState = inpCheckAll$.length > 0 ? inpCheckAll$.prop('checked') : false;
                    if (selectedState === true) row$.addClass('selected');

                    clsThis.textBtn$
                        .find(
                            `#${RenderData.getIdSelectedGroup(inpCheckAll$.attr('id'))}`
                        )
                        .removeClass('badge-warning')
                        .addClass('badge-primary');
                },
                1000,
            )
        }

        async formSubmit(form) {
            let clsThis = this;
            let row = $(form).closest('tr');
            let frm = new SetupFormSubmit(form);
            let inpCheckAll$ = $(form).closest('tr').find('input[type=checkbox].inp-checkall');

            // update convert input data-type=json sang JSON để tránh lỗi
            let bodyData = frm.dataForm;
            $(form).find(':input[data-type="json"]').each(function (){
                const inpName = $(this).attr('name');
                if (inpName && inpName.length > 0 && bodyData.hasOwnProperty(inpName)){
                    let dataTmp = bodyData[inpName];
                    try {
                        bodyData[inpName] = JSON.parse(dataTmp);
                    } catch (e) {
                        let errors = {};
                        errors[inpName] = '';
                        $(form).validate().showErrors(errors)
                        return false;
                    }
                }
            });

            return await $.fn.callAjax2({
                url: frm.dataUrl,
                method: frm.dataMethod,
                data: bodyData,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({
                            'description': $.fn.gettext('Successfully'),
                        }, 'success');
                        $(row).alterClass('bg-*').addClass('bg-success bg-opacity-25 text-dark');
                    }
                    return true;
                },
                (errs) => {
                    $.fn.switcherResp(errs, {
                        'notifyOpts': {
                            'keyNotMatch': '',
                            'replaceKey': clsThis.keyMap,
                            'isShowKey': true
                        },
                        'swalOpts': {'allowOutsideClick': true},
                    });
                    if (errs && typeof errs === 'object' && errs.hasOwnProperty('data')) {
                        let data = errs['data'];
                        if (data && typeof data === 'object' && data.hasOwnProperty('errors')) {
                            let errors = data['errors'] || {};
                            if (errors && typeof errors === 'object') $(form).validate().showErrors(errors);
                        }
                    }
                    $(row).alterClass('bg-*').addClass('bg-danger bg-opacity-25 text-dark');
                    return false;
                }
            ).then(
                (state) => {
                    clsThis.resolve_callback(inpCheckAll$);
                    return state;
                },
            )
        }
    }

    class ImportController {
        constructor(opts = {}) {
            this.opts = opts;
            this.boxData$ = $('#idx-box-data');
            this.boxControl$ = $("#idx-box-control");
            this.linkTemplateList$ = $('#idx-link-template');
            this.inpFile$ = $('#formFile');
            this.inpApp$ = $('#inp-application');
            this.inpSheetName$ = $('#inp-sheet-name');
            this.starting$ = $('#inpStartRecord');
            this.ending$ = $('#inpEndRecord');
            this.btnSetMin$ = $('#btnSetMin');
            this.btnSetMax$ = $('#btnSetMax');
            this.btnPageList$ = $('#btnPageListLink');
            this.btnPageCreate$ = $('#btnPageCreateLink');
            this.btnLoadFileData$ = $('#btnLoadFileData');
            this.spanAppText$ = $('#spanAppNameSelected');

            this.templateData = JSON.parse($('#idx-template-link').text());
            this.templateSelectedData = {};
            this.previousState = '1';  // 0: hide, 1: show

            this.clsRenderData = null;
        }

        update_max_start_end(data_length) {
            this.starting$.val(1).attr('min', 1).attr('max', data_length).prop('disabled', false);
            this.ending$.val(data_length).attr('min', 1).attr('max', data_length).prop('disabled', false);
        }

        readerBufferFile(f) {
            let clsThis = this;
            let reader = new FileReader();
            reader.onload = function (e) {
                // update remarks
                let sizeToMB = f.size / (1024 * 1024);
                $('#file-remarks').text(`${$.fn.gettext("Size")}: ${sizeToMB.toFixed(2)}MB`);

                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, {type: 'array'});
                let worksheetName = null;  // workbook.SheetNames[0];
                let worksheet = null;  // workbook.Sheets[worksheetName];
                let jsonData = [];  // XLSX.utils.sheet_to_json(worksheet, {header: 1});

                function disableNextData() {
                    clsThis.starting$.prop('disabled', true);
                    clsThis.ending$.prop('disabled', true);
                    clsThis.btnLoadFileData$.prop('disabled', true);
                }

                function enableNextData() {
                    clsThis.starting$.prop('disabled', false);
                    clsThis.ending$.prop('disabled', false);
                    clsThis.btnLoadFileData$.prop('disabled', false);
                }

                clsThis.inpSheetName$.empty();
                workbook.SheetNames.map((item, index) => {
                    if (item && item.startsWith('#')) {
                        let html = ``;
                        if (clsThis.clsRenderData.sheetName) {
                            html = `<option value="${item}" ${clsThis.clsRenderData.sheetName === item ? "selected" : ""}>${item}</option>`;
                        } else {
                            html = `<option value="${item}" ${index === 0 ? "selected" : ""}>${item}</option>`;
                        }
                        clsThis.inpSheetName$.append(html)
                    }
                })
                clsThis.inpSheetName$.off('change').on('change', function () {
                    // check if not condition return disabled
                    if (!workbook) return disableNextData();
                    worksheetName = $(this).val();
                    if (!worksheetName) return disableNextData();
                    worksheet = workbook.Sheets[worksheetName];
                    if (!worksheet) return disableNextData();
                    if (!clsThis.clsRenderData.templateConfig?.['url']) return disableNextData();

                    // enable button and handle data
                    enableNextData();
                    jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});
                    $('#sheet-remarks').text(`${$.fn.gettext("Total rows")}: ${jsonData.length - 2}`);
                    if (jsonData.length > 0) {
                        const dataHead = jsonData[0];
                        const configHead = clsThis.clsRenderData.templateConfig.columns;
                        console.log(dataHead)
                        console.log(configHead)
                        if (dataHead.length === configHead.length) {
                            // update starting and ending records
                            clsThis.update_max_start_end(jsonData.length - 2);
                            // button load + start + end
                            clsThis.btnLoadFileData$.prop('disabled', false).off('click').on('click', function () {
                                if ($(this).prop('disabled') === false) {
                                    let startNum = Number.parseInt(clsThis.starting$.val());
                                    let endNum = Number.parseInt(clsThis.ending$.val());
                                    if (startNum <= endNum) clsThis.clsRenderData.render_data(jsonData.slice(startNum + 1, endNum + 1 + 1));
                                    else $.fn.notifyB({
                                        'description': $.fn.gettext('No data found'),
                                    }, 'failure');
                                }
                            })
                        } else {
                            disableNextData();
                            $.fn.notifyB({
                                'description': $.fn.gettext('Column in file not match with config of template'),
                            }, 'failure');
                        }
                    } else {
                        disableNextData();
                        $.fn.notifyB({
                            'description': $.fn.gettext("The resource is empty"),
                        }, 'failure')
                    }
                }).trigger('change');
                $x.fn.hideLoadingPage();
            };
            reader.readAsArrayBuffer(f);
        }

        on_events() {
            let clsThis = this;

            this.inpApp$.initSelect2().on('change', function () {
                let idx = $(this).val();
                clsThis.templateSelectedData = clsThis.templateData[idx];
                if (clsThis.templateSelectedData && clsThis.templateSelectedData?.['template_link']) {
                    clsThis.linkTemplateList$.attr('href', clsThis.linkTemplateList$.attr('data-static-url') + clsThis.templateSelectedData['template_link']).show();
                    clsThis.inpFile$.prop('disabled', false);

                    //
                    clsThis.clsRenderData = new RenderData({
                        'templateConfig': clsThis.templateSelectedData,
                    });
                    clsThis.clsRenderData.render_frame();
                    if (clsThis.clsRenderData.sheetName) {
                        clsThis.inpSheetName$.val(clsThis.clsRenderData.sheetName)
                    }
                    //
                    let urlList = clsThis.templateSelectedData?.['url_list'] || null;
                    urlList ? clsThis.btnPageList$.attr('href', urlList).show() : clsThis.btnPageList$.attr('href', '#').hide();

                    //
                    clsThis.spanAppText$.text(clsThis.inpApp$.find(`option[value=${idx}]`).text() || '');

                    //
                    let urlCreate = clsThis.templateSelectedData?.['url_create'] || null;
                    urlCreate ? clsThis.btnPageCreate$.attr('data-href', urlCreate).show() : clsThis.btnPageCreate$.attr('data-href', '#').hide();

                    clsThis.inpSheetName$.trigger('change');
                } else {
                    clsThis.linkTemplateList$.attr('href', '#').hide();
                    $.fn.notifyB({
                        'description': $.fn.gettext('The feature is not support import file data')
                    }, 'failure');

                    clsThis.btnPageList$.attr('href', '#').hide();
                    clsThis.btnPageCreate$.attr('data-href', '#').hide();
                }
            });

            this.inpFile$.on('change', function (event) {
                $x.fn.showLoadingPage({
                    didOpenEnd: function (){
                        let files = event.target.files;
                        let f = files[0];
                        if (!(files && f)) {
                            $x.fn.hideLoadingPage();
                            return;
                        }

                        let sizeToMB = f.size / (1024 * 1024);

                        if (sizeToMB > 5) {
                            $.fn.notifyB({
                                'description': $.fn.gettext('File size must be less than or equal to __size__').replaceAll('__size__', '5MB')
                            }, 'failure');
                            this.value = "";
                            $x.fn.hideLoadingPage();
                            return;
                        }

                        setTimeout(() => {
                            clsThis.readerBufferFile(f);
                        }, 100);
                    },
                });
            });

            $('#btn-collapse').on('click', function () {
                let i$ = $(this).find('i');
                if (i$.length > 0) {
                    let currentRotate = i$.attr('data-rotate');

                    i$.css('transition-duration', '0.5s');
                    i$.css('transition-property', 'transform');

                    clsThis.boxControl$.animate({
                        width: "toggle",
                        opacity: "toggle"
                    }, {
                        'duration': 400,
                        'start': function () {
                            clsThis.boxControl$.children().fadeOut('fast');
                            if (!clsThis.boxData$.attr('data-old-class')) clsThis.boxData$.attr('data-old-class', clsThis.boxData$.getClass('^col-*').join(" "));
                            if (!clsThis.boxControl$.attr('data-old-class')) clsThis.boxControl$.attr('data-old-class', clsThis.boxControl$.getClass('^col-*').join(" "));

                            // show
                            if (clsThis.previousState === '0') clsThis.boxData$.alterClass('col-*').addClass(clsThis.boxData$.attr('data-old-class'));
                        },
                        'done': function () {
                            clsThis.boxControl$.children().fadeIn('fast');
                            if (!clsThis.boxData$.attr('data-old-class')) clsThis.boxData$.attr('data-old-class', clsThis.boxData$.getClass('^col-*').join(" "));
                            if (!clsThis.boxControl$.attr('data-old-class')) clsThis.boxControl$.attr('data-old-class', clsThis.boxControl$.getClass('^col-*').join(" "));

                            // hide
                            if (clsThis.previousState === '1') clsThis.boxData$.alterClass('col-*').addClass('col-12');

                            if (clsThis.previousState === '0') clsThis.previousState = '1'; else clsThis.previousState = '0';
                        }
                    })

                    if (currentRotate) {
                        i$.removeAttr('data-rotate');
                        i$.css({'transform': 'unset'});
                    } else {
                        i$.attr('data-rotate', '1');
                        i$.css({'transform': 'rotate(' + 180 + 'deg)'});
                    }
                }
            });

            this.starting$.on('change', function () {
                let valueEnd = clsThis.ending$.val();
                let valueStart = clsThis.starting$.val();

                if (Number.parseInt(valueEnd) < Number.parseInt(valueStart)) {
                    $.fn.notifyB({
                        'description': $.fn.gettext("Starting record must be equal or less than ending records")
                    }, 'failure');
                    $(this).val(valueEnd);
                }
            })

            this.ending$.on('change', function () {
                let valueEnd = clsThis.ending$.val();
                let valueStart = clsThis.starting$.val();

                if (Number.parseInt(valueEnd) < Number.parseInt(valueStart)) {
                    $.fn.notifyB({
                        'description': $.fn.gettext("Starting record must be equal or less than ending records")
                    }, 'failure');
                    $(this).val(valueStart);
                }
            })

            this.btnSetMin$.on('click', function () {
                let inp$ = $(this).siblings('input');
                if (inp$.length > 0 && inp$.prop('disabled') === false) {
                    let minData = inp$.attr('min');
                    if (typeof minData === 'string') inp$.val(minData);
                }
            })

            this.btnSetMax$.on('click', function () {
                let inp$ = $(this).siblings('input');
                if (inp$.length > 0 && inp$.prop('disabled') === false) {
                    let maxData = inp$.attr('max');
                    if (typeof maxData === 'string') inp$.val(maxData);
                }
            })

            this.btnPageList$.on('click', function () {
                let dataHref = $(this).attr('data-href');
                if (dataHref) {
                    window.open(dataHref, '_blank');
                }
            })

            this.btnPageCreate$.on('click', function () {
                let dataHref = $(this).attr('data-href');
                if (dataHref) {
                    window.open(dataHref, '_blank');
                }
            })
        }

        init() {
            this.on_events();
        }
    }

    new ImportController().init();
})