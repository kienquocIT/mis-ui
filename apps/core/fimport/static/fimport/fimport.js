$(document).ready(function () {
    class RenderData {
        constructor(props) {
            this.templateConfig = {
                url: '#',
                template_link: null,
                validate: {},
                columns: [], ...props?.['templateConfig'] || {}
            };
            this.tbl$ = props?.['table'] || $('#tbl-display-data');
            if (!$(this.tbl$).attr('id')) this.tbl$.attr('id', $x.fn.randomStr(32));

            this.bodyData = [];

            this.keyMap = {};
            this.columnData = {};
            (this.templateConfig.columns || []).map((item, index) => {
                let input_title = item?.['name'] || null;
                let input_name = item?.['input_name'] || null;
                if (input_name && input_title) this.keyMap[input_name] = input_title;

                this.columnData[index.toString()] = item;
            })
        }

        static getHeightAvailableForTable() {
            let pgWrapper = Number.parseFloat($('.hk-pg-wrapper').css('padding-top').replaceAll('px', ''));
            let simpleBar = Number.parseFloat($('.hk-pg-wrapper .simplebar-content').css('padding-top').replaceAll('px', ''));
            let blogHeader = Number.parseFloat($('.blog-header').css('height').replaceAll('px', ''));
            let btnUtilApp = Number.parseFloat($('#idx-box-data-btn-util-application').css('height').replaceAll('px', ''));
            let total = window.height - (pgWrapper + simpleBar + blogHeader + btnUtilApp + 190);
            if (total < 380) return 380;
            return total;
        }

        generate_head() {
            let columnsConfig = this.templateConfig.columns || [];
            if (!columnsConfig) return false;

            //
            let row$ = $(`<div class="row"></div>`);
            columnsConfig.map((item) => {
                let col$ = $(`<div class="col">${item.name}</div>`);
                let colConfig = item?.['col_attrs'] || null;
                if (colConfig) {
                    Object.keys(colConfig).map((key) => {
                        col$.attr(key, colConfig[key]);
                    })
                }
                col$.append(`<i class="fa-solid fa-circle-info ml-1" data-bs-toggle="tooltip" title="${item.type} - ${item.remarks}"></i>`);
                row$.append(col$);
            })
            // setup thead
            let headStart$ = `
                <button 
                    id="inp-checkall" 
                    class="btn btn-icon btn-success btn-xs btn-square" type="button"
                    data-bs-toggle="tooltip"
                    title="Check all in current page"
                >
                    <span class="icon"><i class="fa-solid fa-check"></i></span>
                </button>
                <button 
                    id="inp-un-checkall" 
                    class="btn btn-icon btn-danger btn-xs btn-square" type="button"
                    data-bs-toggle="tooltip"
                    title="Un-check all in current page"
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
            let thead$ = $(`<thead><tr><th>${headStart$}</th><th>${row$.prop('outerHTML')}</th><th>${headEnd$}</th></tr></thread>`);
            // thead$.append(`<tr><td colspan="3" id="groupDataSelected"></td></tr>`);
            // add thead to table
            this.tbl$.append(thead$);
        }

        get_columns() {
            let columnData = this.columnData || {};

            function generate_col(config) {
                let colAttrs = config?.['col_attrs'] || {'class': 'col'};
                let col$ = $(`<div></div>`);
                Object.keys(colAttrs).map((key) => {
                    col$.attr(key, colAttrs[key]);
                })
                return col$;
            }

            function generate_form_group(data, config, dataIndex) {
                let group$ = $(`<div class="form-group"></div>`);
                let inp$ = $(`<input class="form-control" value="${data ? data : ''}" />`);

                let inpName = config?.['input_name'] || null;
                if (inpName) inp$.attr('name', inpName);

                let inpAttrs = {
                    'args': !!(config?.['input_attrs'] || null) ? [] : ['disabled', 'readonly'],
                    'kwargs': {
                        class: 'form-control-plaintext',
                    }, ...config?.['input_attrs'] || {},
                };
                inp$.attr('data-index', dataIndex);
                inpAttrs.args.map((attData) => inp$.prop(attData, true))
                Object.keys(inpAttrs.kwargs).map((key) => {
                    inp$.attr(key, inpAttrs.kwargs[key]);
                })

                group$.append(inp$);
                return group$;
            }

            return [
                {
                    width: "10%",
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
                }, {
                    width: "80%",
                    data: 'data',
                    className: 'my-custom-align',
                    render: (data, type, row) => {
                        let cell$ = $(`<div class="row"></div>`);
                        for (let key_index in columnData) {
                            let config = columnData[key_index.toString()];
                            let col$ = generate_col(config);
                            col$.attr('data-index', key_index);

                            let group$ = generate_form_group(data?.[key_index] || '', config, key_index);
                            col$.append(group$);
                            cell$.append(col$);
                        }
                        return `<form data-url="${this.templateConfig.url}" data-method="POST" id="${$x.fn.randomStr(32)}">${cell$.prop('outerHTML')}</form>`;
                    }
                }, {
                    width: '10%',
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

            const idPrefixSelected = 'row-data-selected-';

            function getIdSelectedGroup(inpCheckAllID){
                return `${idPrefixSelected}${inpCheckAllID}`
            }

            function addToSelected(data, idCheck) {
                let idx = idCheck ? getIdSelectedGroup(idCheck) : getIdSelectedGroup(data['id']);
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
                let idx = idCheck ? getIdSelectedGroup(idCheck) : getIdSelectedGroup(data['id']);
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
                scrollY: `${RenderData.getHeightAvailableForTable()}px`,
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
                                frm$.trigger( "submit" );
                                // setTimeout(
                                //     () => {
                                //         tr$.addClass('selected').removeClass('fimport-in-progress');
                                //         eleSelected.removeClass('badge-warning').addClass('badge-primary');
                                //     },
                                //     1000,
                                // )
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
                    if (!$(row).attr('id')) $(row).attr('id', `id-${$x.fn.randomStr(32)}`);
                    $(row).attr('data-url', '#');
                    $(row).attr('data-method', "POST");

                    let frm$ = $(row).find('form');
                    let btn$ = $(row).find('button.btnSubmit');
                    let inpCheckAll$ = $(row).find('input[type=checkbox].inp-checkall');
                    let inp$ = $(row).find('input:not(:disabled):not(:read-only):not(.form-control-plaintext)');

                    btn$
                        .off('click')
                        .on('click', function () {
                            $(this).prop('disabled', true);
                            frm$.trigger('submit');
                            setTimeout(() => $(this).prop('disabled', false), 1000)
                        });

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

                    let validator = new SetupFormSubmit(frm$).validate({
                        rules: clsThis.templateConfig?.['validate'] || {},
                        submitHandler: async function (form, event) {
                            let frm = new SetupFormSubmit(form);

                            function resolve_callback(){
                                setTimeout(
                                    () => {
                                        $(row).addClass('selected').removeClass('fimport-in-progress');
                                        let eleSelected = clsThis.textBtn$.find(
                                            `#${getIdSelectedGroup(inpCheckAll$.attr('id'))}`
                                        );
                                        eleSelected.removeClass('badge-warning').addClass('badge-primary');
                                    },
                                    1000,
                                )
                            }

                            return await $.fn.callAjax2({
                                url: frm.dataUrl,
                                method: frm.dataMethod,
                                data: frm.dataForm,
                            }).then((resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data) {
                                    $.fn.notifyB({
                                        'description': $.fn.gettext('Successfully'),
                                    }, 'success');
                                    $(row).addClass('bg-success bg-opacity-25 text-dark');
                                }
                            }, (errs) => {
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
                                        let errors = data['errors'];
                                        if (errors && typeof errors === 'object') {
                                            validator.showErrors(errors);
                                        }
                                    }
                                }
                                $(row).addClass('bg-danger bg-opacity-25 text-dark');
                            },).then(
                                () => resolve_callback(),
                            )
                        },
                    });

                    inp$
                        .off('change')
                        .on('change', () => $(row).trigger('valid'));

                    inpCheckAll$
                        .off('change')
                        .on('change', function () {
                            if (!$(this).attr('id')) $(this).attr('id', `inp-${$x.fn.randomStr(32)}`);
                            let state = $(this).prop('checked');
                            state === true ? $(row).addClass('selected') : $(row).removeClass('selected');
                            $(row).trigger('valid');
                        });

                    // valid when callback firing
                    setTimeout(() => $(row).trigger('valid'), 200);
                },
            });

            dataTbl.on('page', function () {
                let info = dataTbl.page.info();
                emptyToSelected();
                clsThis.tbl$.find('input[type=checkbox].inp-checkall[checked]').trigger('change');
            });
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
            this.starting$ = $('#inpStartRecord');
            this.ending$ = $('#inpEndRecord');
            this.btnSetMin$ = $('#btnSetMin');
            this.btnSetMax$ = $('#btnSetMax');
            this.btnPageList$ = $('#btnPageListLink');
            this.btnPageCreate$ = $('#btnPageCreateLink')

            this.templateData = JSON.parse($('#idx-template-link').text());
            this.templateSelectedData = {};
            this.previousState = '1';  // 0: hide, 1: show
        }

        update_max_start_end(data_length) {
            this.starting$.val(1).attr('min', 1).attr('max', data_length).prop('disabled', false);
            this.ending$.val(data_length).attr('min', 1).attr('max', data_length).prop('disabled', false);
        }

        readerBufferFile(f) {
            let clsThis = this;
            let reader = new FileReader();
            reader.onload = function (e) {
                let data = new Uint8Array(e.target.result);
                let workbook = XLSX.read(data, {type: 'array'});

                // Get first worksheet
                let worksheetName = workbook.SheetNames[0];
                let worksheet = workbook.Sheets[worksheetName];

                // Convert to JSON
                let jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

                // update remarks
                let sizeToMB = f.size / (1024 * 1024);
                $('#file-remarks').text(`${$.fn.gettext("Size")}: ${sizeToMB.toFixed(2)}MB  ●  ${$.fn.gettext("Total rows")}: ${jsonData.length - 1}`);

                // update starting and ending records
                clsThis.update_max_start_end(jsonData.length - 1);

                $x.fn.hideLoadingPage();
                $('#btnLoadFileData').prop('disabled', false).on('click', function () {
                    let startNum = Number.parseInt(clsThis.starting$.val());
                    let endNum = Number.parseInt(clsThis.ending$.val());
                    if (startNum <= endNum) clsThis.clsRenderData.render_data(jsonData.slice(startNum, endNum + 1)); else $.fn.notifyB({
                        'description': $.fn.gettext('The feature is not support import file data'),
                    })

                })
            };
            reader.readAsArrayBuffer(f);
        }

        on_events() {
            let clsThis = this;
            this.clsRenderData = null;

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

                    //
                    let urlList = clsThis.templateSelectedData?.['url_list'] || null;
                    urlList ? clsThis.btnPageList$.attr('href', urlList).show() : clsThis.btnPageList$.attr('href', '#').hide();

                    //
                    let urlCreate = clsThis.templateSelectedData?.['url_create'] || null;
                    urlCreate ? clsThis.btnPageCreate$.attr('data-href', urlCreate).show() : clsThis.btnPageCreate$.attr('data-href', '#').hide();
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
                $x.fn.showLoadingPage();

                let files = event.target.files;
                let f = files[0];
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