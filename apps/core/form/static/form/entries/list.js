$(document).ready(function () {
    function displayCellDataWithType(_fieldConfig, _cellData) {
        if (_fieldConfig['type'] === 'date') {
            const obj = moment(_cellData, 'YYYY-MM-DD');
            return obj.isValid() ? obj.format("ll") : '-';
        }
        if (_fieldConfig['type'] === 'datetime') {
            const obj = moment(_cellData, 'YYYY-MM-DD HH:mm:ss');
            return obj.isValid() ? obj.format("lll") : '-';
        }
        switch (typeof _cellData) {
            case "boolean":
                if (_cellData === true) return `<i class="fa-solid fa-check entries-cell-check"></i>`;
                return `<i class="fa-solid fa-xmark entries-cell-x"></i>`;
            default:
                return _cellData ? _cellData.toString() : '-';
        }
    }

    const tbl$ = $('#form-entries-list');
    const fieldTypeSkip = new Set([
        'card-text',
        'card-heading',
    ]);

    function responseWidthTable(childLength) {
        tbl$.alterClass('min-w-*');
        switch (childLength) {
            case 0:
                tbl$.addClass('min-w-300p');
                break
            case 1:
            case 2:
            case 3:
                tbl$.addClass('min-w-1000p');
                break
            case 4:
            case 5:
                tbl$.addClass('min-w-1500p');
                break
            case 6:
            case 7:
                tbl$.addClass('min-w-1920p');
                break
            case 8:
            case 9:
            case 10:
                tbl$.addClass('min-w-2000p');
                break
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
                tbl$.addClass('min-w-2560p');
                break
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
                tbl$.addClass('min-w-4000p')
                break
            default:
                tbl$.addClass('min-w-8000p');
                break
        }
    }

    function getDynamicHeadAndColumns(configsOrder, configs) {
        let keyNameOrder = [];
        let headTmp$ = [];
        let headTmpSub$ = [];
        let columnsTmp = [];

        configsOrder.map(idx => {
            let configOfItem = configs[idx] || {};
            if (
                configOfItem
                && typeof configOfItem === 'object'
                && configOfItem.hasOwnProperty('type')
                && typeof configOfItem['type'] === "string"
                && fieldTypeSkip.has(configOfItem['type']) === false
                && configOfItem.hasOwnProperty('config')
                && typeof configOfItem['config'] === 'object'
                && configOfItem.hasOwnProperty('inputs_data')
                && Array.isArray(configOfItem['inputs_data'])
            ) {
                const config = configOfItem['config'];
                const inputs_data = configOfItem['inputs_data'];
                const label = config.label ?? '';
                const inputReadyLength = inputs_data.filter(item => item.display === true).length;

                if (inputReadyLength > 0){
                    headTmp$.push([
                        label, inputReadyLength > 1 ? {
                            'r': 1,
                            'c': inputReadyLength
                        } : {
                            'r': 2,
                            'c': 1,
                        }
                    ]);

                    inputs_data.map(inputConfig => {
                        if (inputConfig.display === true) {
                            const nameOfInput = inputConfig.name ?? '';
                            keyNameOrder.push(nameOfInput);
                            if (inputReadyLength > 1) headTmpSub$.push(inputConfig?.['label'] || '');
                            columnsTmp.push({
                                'className': 'wrap-text min-w-150p',
                                'render': function (data, type, row) {
                                    const bodyData = row?.['body_data'];
                                    if (bodyData) return displayCellDataWithType(configOfItem, bodyData?.[nameOfInput] ?? '');
                                    return '-';
                                }
                            })
                        }
                    })

                }
            }
        })
        return {
            keyNameOrder: keyNameOrder,
            headTmp$: headTmp$,
            headTmpSub$: headTmpSub$,
            columnsTmp: columnsTmp,
        }
    }

    function generateHTMLHead(headTmp$, headTmpSub$) {
        let head$ = [
            [
                "#", {
                'r': 2,
                'c': 1
            }
            ], ...headTmp$, [
                $.fn.gettext('Created time'), {
                    'r': 2,
                    'c': 1
                }
            ], [
                $.fn.gettext('Referrer Name'), {
                    'r': 2,
                    'c': 1
                }
            ], [
                $.fn.gettext('User created'), {
                    'r': 2,
                    'c': 1
                }
            ]
        ];
        const headHTML = head$.map(labelConfig => {
            let clsName = labelConfig[1].c > 1 ? "text-align-center" : "";
            return `
                    <th 
                        class="no-transform ${clsName}" 
                        rowspan="${labelConfig[1].r}" 
                        colspan="${labelConfig[1].c}"
                    >${labelConfig[0]}</th>`;
        }).join("");
        const headSubHTML = headTmpSub$.map(item => `<th colspan="1" rowspan="1">${item}</th>`);
        const tblHead$ = tbl$.find('thead').empty();
        tblHead$.append(`<tr>${headHTML}</tr>`);
        if (headTmpSub$.length > 0) tblHead$.append(`<tr>${headSubHTML}</tr>`); // add when has data
        else tblHead$.find('th').attr('rowspan', 1); // rollback rowspan to 1 when the second heading is empty
    }

    function generateHTMLColumns(columnsTmp, hasShowReferrerName, hasOwnerRecord) {
        return [
            {
                width: '100px',
                className: 'wrap-text min-w-50p',
                render: () => '',
            },
            ...columnsTmp,
            {
                data: 'date_created',
                width: '150px',
                orderable: true,
                className: 'min-w-150p wrap-text',
                render: (data, type, row) => $x.fn.displayRelativeTime(row?.['date_created'] ?? ''),
            },
            {
                data: 'ref_name',
                width: '150px',
                orderable: true,
                className: 'min-w-150p wrap-text',
                visible: !!hasShowReferrerName,
                render: (data, type, row) => row?.['ref_name'] ?? '',
            },
            {
                width: '150px',
                className: 'min-w-150p wrap-text',
                visible: !!hasOwnerRecord,
                render: (data, type, row) => {
                    let userCreated = row?.['user_created'] || {};
                    if (userCreated && typeof userCreated === 'object' && userCreated.hasOwnProperty('full_name')) {
                        return userCreated['full_name'];
                    }
                    return '';
                },
            },
        ]
    }

    function exportExcelActivate(configsOrder, configs, keyNameOrder) {
        let data = [];

        let dataHeading = ['No.',];
        let dataHeadingSub = ['',];
        let merges = [
            {
                's': {
                    'r': 0,
                    'c': 0
                },
                'e': {
                    'r': 1,
                    'c': 0
                }
            }, // No.
        ];
        let currentCol = 0;
        configsOrder.map(
            (idx) => {
                const configOfField = configs[idx];
                if (
                    configOfField
                    && typeof configOfField === 'object'
                    && configOfField.hasOwnProperty('type')
                    && typeof configOfField['type'] === "string"
                    && fieldTypeSkip.has(configOfField['type']) === false
                    && configOfField.hasOwnProperty('config')
                    && typeof configOfField['config'] === 'object'
                    && configOfField.hasOwnProperty('inputs_data')
                    && Array.isArray(configOfField['inputs_data'])
                ) {
                    const currentColNum = currentCol;
                    let mergesOfField;

                    const inputsOfField = configOfField['inputs_data'] || [];

                    const inputReadyLength = inputsOfField.filter(item => item.display === true).length;
                    if (inputReadyLength > 0){
                        dataHeading.push(configOfField?.['config']?.['label'] || '')
                        if (inputReadyLength === 1) {
                            mergesOfField = {
                                's': {
                                    'r': 0,
                                    'c': currentColNum + 1
                                },
                                'e': {
                                    'r': 1,
                                    'c': currentColNum + 1
                                },
                            }
                        } else {
                            mergesOfField = {
                                's': {
                                    'r': 0,
                                    'c': currentColNum + 1
                                },
                                'e': {
                                    'r': 0,
                                    'c': currentColNum + 1 + inputReadyLength - 1
                                },
                            }
                        }

                        inputsOfField.map((itemOfField, idx) => {
                            if (itemOfField.display === true) {
                                if (idx !== 0) dataHeading.push('');
                                dataHeadingSub.push(itemOfField?.['label'] || '');
                                currentCol += 1;
                            }
                        })
                        if (mergesOfField) merges.push(mergesOfField);

                    }
                }
            }
        )
        // push system cols
        dataHeading.push($.fn.gettext('Created time'));
        merges.push({
            's': {
                'r': 0,
                'c': currentCol + 1
            },
            'e': {
                'r': 1,
                'c': currentCol + 1
            }
        });
        dataHeading.push($.fn.gettext('Referrer Name'));
        merges.push({
            's': {
                'r': 0,
                'c': currentCol + 2
            },
            'e': {
                'r': 1,
                'c': currentCol + 2
            }
        });
        dataHeading.push($.fn.gettext('User created'));
        merges.push({
            's': {
                'r': 0,
                'c': currentCol + 3
            },
            'e': {
                'r': 1,
                'c': currentCol + 3
            }
        });
        // -- push system cols
        data.push(dataHeading);
        data.push(dataHeadingSub);

        function displayDataInExcel(_cellData) {
            if (Array.isArray(_cellData)) {
                return _cellData.join(", ");
            } else {
                switch (typeof _cellData) {
                    case "boolean":
                    default:
                        return _cellData
                }
            }
        }

        tbl$.DataTable().rows().data().map((item, idx) => {
            let itemDataReverted = [
                idx + 1,
            ];
            const bodyData = item?.['body_data'] || {};
            keyNameOrder.map(inputName => {
                itemDataReverted.push(displayDataInExcel(bodyData?.[inputName] || ''));
            })
            // push system cols data
            itemDataReverted.push(item?.['date_created'] || '');
            itemDataReverted.push(item?.['ref_name'] || '');
            itemDataReverted.push(item?.['user_created']?.['full_name'] || '');
            // -- push system cols data
            data.push(itemDataReverted);
        });

        // use ExcelJS
        const workbook = $x.cls.excelJS.createWorkbook({
            'sheetName': 'Data',
            'data': data,
            'cols': $x.cls.excelJS.convertWidthColsArray(data),
            'merges': merges.map(item => $x.cls.excelJS.indexToCoordRange(item.s, item.e)),
            'styles': [
                [
                    "A1", {
                    "alignment": {
                        vertical: 'bottom',
                        horizontal: 'left'
                    }
                },
                ],
            ],
            'callback': (workbook, worksheet) => $x.cls.excelJS.styleCell(worksheet, {
                fullBorder: true,
                cellCallback: function (cell, colNumber) {
                    if (colNumber === 1) {
                        cell.alignment = {
                            vertical: 'bottom',
                            horizontal: 'left'
                        };
                    }
                }
            }),
        });

        function getDateNow() {
            let now = new Date();
            return `${now.getFullYear()}_${now.getMonth() + 1}_${now.getDate()}_${now.getHours()}_${now.getMinutes()}`
        }

        $x.cls.excelJS.download({
            workbook: workbook,
            fileName: `Form_Data_${getDateNow()}.xlsx`,
            wbProps: {},
            'callback': () => $x.fn.hideLoadingPage(),
        })
    }

    $.fn.callAjax2({
        url: tbl$.attr('data-url-config'),
        method: 'GET'
    }).then(resp => {
        let data = $.fn.switcherResp(resp);
        if (data && data.hasOwnProperty('form_config_for_entries')) {
            let configForEntries = data['form_config_for_entries'];
            if (configForEntries) {
                const configs = configForEntries['configs'];
                const configsOrder = configForEntries['configs_order'];

                responseWidthTable(configsOrder.length);

                let {
                    keyNameOrder,
                    headTmp$,
                    headTmpSub$,
                    columnsTmp,
                } = getDynamicHeadAndColumns(configsOrder, configs);

                generateHTMLHead(headTmp$, headTmpSub$);

                const columns = generateHTMLColumns(columnsTmp, !!(configForEntries?.['display_referrer_name'] || false), !!(configForEntries?.['display_creator'] || false));

                tbl$.DataTableDefault({
                    visibleSearchField: false,
                    rowIdx: true,
                    useDataServer: true,
                    scrollX: true,
                    autoWidth: false,
                    ajax: {
                        url: tbl$.attr('data-url'),
                        type: tbl$.attr('data-method') || 'GET',
                        dataSrc: function (resp) {
                            let data = $.fn.switcherResp(resp);
                            if (data) {
                                return data['form_entries_list'] ? data['form_entries_list'] : [];
                            }
                            return [];
                        },
                    },
                    columns: columns,
                    advancePushFilter: function (customFilterData) {
                        let ctx = {}
                        let wrapper$ = tbl$.closest('.dataTables_wrapper');
                        let textFilter$ = wrapper$.find('.textFilter');
                        if (textFilter$.length > 0) {
                            let eleRefNameVal = $('#form-entries-filter-ref-name').val();
                            if (eleRefNameVal !== 'all') ctx['ref_name'] = eleRefNameVal;
                        }
                        return {
                            ...customFilterData, ...ctx
                        }
                    },
                    initComplete: function (settings, json) {
                        let wrapper$ = tbl$.closest('.dataTables_wrapper');
                        let textFilter$ = wrapper$.find('.textFilter');
                        if (textFilter$.length > 0) {
                            textFilter$.css('display', 'flex');

                            // filter ref_name
                            let rdIdx = `form-entries-filter-ref-name`;

                            let formGroup$ = $(`<div class="input-group"></div>`);

                            let sel$ = $(`<select class="form-select form-select-sm" style="min-width: 100px;" id="${rdIdx}"></select>`);
                            sel$.append(`<option value="" selected>${$.fn.gettext('All')}</option>`);
                            formGroup$.append(`<span class="input-group-text" style="padding: 0 0.5267rem;">${$.fn.gettext('Referrer Name')}</span>`);
                            formGroup$.append(sel$);

                            textFilter$.append(formGroup$);

                            sel$.on('click', function () {
                                let loaded = $(this).attr('data-loaded');
                                if (loaded !== 'true') {
                                    $(this).attr('data-loaded', 'true');
                                    $.fn.callAjax2({
                                        url: tbl$.attr('data-url-ref-name-list'),
                                        method: 'GET',
                                        isLoading: true,
                                    }).then(resp => {
                                        let data = $.fn.switcherResp(resp);
                                        if (data) {
                                            let refNameList = data?.['ref_name_list'];
                                            if (refNameList) {
                                                refNameList.map(refName => {
                                                    sel$.append(`<option value="${refName}">${refName}</option>`);
                                                })
                                                sel$.on('change', function () {
                                                    tbl$.DataTable().ajax.reload();
                                                });
                                                sel$.trigger('click change');
                                            }
                                        }
                                    }, errs => $.fn.switcherResp(errs),)
                                }
                            });

                            // button export
                            let btnExport$ = $(`
                                <button class="btn btn-xs btn-primary ml-1">
                                    <span>
                                         <span class="icon"><i class="fa-regular fa-file-excel"></i></span>
                                        <span>${$.fn.gettext('Export to Excel')}</span>
                                    </span>
                                </button>
                            `);
                            textFilter$.append(btnExport$);
                            btnExport$.on('click', function () {
                                $x.fn.showLoadingPage({
                                    didOpenEnd: () => {
                                        exportExcelActivate(configsOrder, configs, keyNameOrder);
                                    }
                                });
                            })
                        }
                    },
                })
            }
        }
    }, errs => $.fn.switcherResp(errs),);
})