class AttributeHandle {
    static $form = $('#frm_attribute');
    static $table = $('#table_category');
    static $offCanvas = $('#mainCanvas');

    static $navAttributeCategory = $('#nav_attribute_category');
    static $tabBlock1 = $('#tab_block_1');
    static $tableList = $('#table_list');
    static $tableWarranty = $('#table_warranty');

    static $boxParent = $('#box_parent');

    static $transEle = $('#app-trans-factory');
    static $urlEle = $('#app-url-factory');


    static init() {
        AttributeHandle.loadDtb();
        AttributeHandle.loadDtbList();
        AttributeHandle.loadDtbWarranty();
        FormElementControl.loadInitS2(AttributeHandle.$boxParent);
        // init date picker
        $('.flat-picker').each(function () {
            DateTimeControl.initFlatPickrDate(this);
        });

    };

    static setupDataSubmit() {
        let isCategory = false;
        for (let navEle of AttributeHandle.$tabBlock1[0].querySelectorAll('.nav-link')) {
            if ($(navEle).hasClass('active') && $(navEle).attr('#tab_block_2')) {
                isCategory = true;
            }
        }
        return {
            "title": AttributeHandle.$form.dataForm?.['title'],
            "parent_n": AttributeHandle.$form.dataForm?.['parent_n'],
            "is_category": isCategory,
            "price_config": AttributeHandle.setupDataPriceConfig(),
        }
    };

    static setupDataPriceConfig() {
        for (let navEle of AttributeHandle.$tabBlock1[0].querySelectorAll('.nav-link')) {
            if ($(navEle).hasClass('active')) {
                let type = $(navEle).attr('href');
                if (type === "#tab_numeric") {
                    return {
                        "attribute_type": 0,
                        "is_inventory": AttributeHandle.$form.dataForm?.['is_inventory_numeric'],
                        "attribute_unit": AttributeHandle.$form.dataForm?.['numeric_attribute_unit'],
                        "duration_unit": AttributeHandle.$form.dataForm?.['numeric_duration_unit'],
                        "min_value": AttributeHandle.$form.dataForm?.['numeric_min'],
                        "max_value": AttributeHandle.$form.dataForm?.['numeric_max'],
                        "increment": AttributeHandle.$form.dataForm?.['numeric_increment'],
                        "price_per_unit": AttributeHandle.$form.dataForm?.['numeric_price_per_unit'],
                    };
                }
                if (type === "#tab_list") {
                    return {
                        "attribute_type": 1,
                        "is_inventory": AttributeHandle.$form.dataForm?.['is_inventory_list'],
                        "duration_unit": AttributeHandle.$form.dataForm?.['list_duration_unit'],
                        "list_item": AttributeHandle.setupDataListItem(),
                    };
                }
                if (type === "#tab_warranty") {
                    return {
                        "attribute_type": 2,
                        "is_inventory": AttributeHandle.$form.dataForm?.['is_inventory_warranty'],
                        "warranty_item": AttributeHandle.setupDataWarrantyItem(),
                    };
                }
            }
        }
        return {};
    };

    static setupDataListItem() {
        let result = [];
        AttributeHandle.$tableList.DataTable().rows().every(function () {
            let row = this.node();
            let titleEle = row.querySelector('.table-row-title');
            let additionalCostEle = row.querySelector('.table-row-additional-cost');
            if (titleEle && additionalCostEle) {
                result.push({
                    "title": $(titleEle).val(),
                    "additional_cost": $(additionalCostEle).valCurrency(),
                })
            }
        });
        return result;
    };

    static setupDataWarrantyItem() {
        let result = [];
        AttributeHandle.$tableWarranty.DataTable().rows().every(function () {
            let row = this.node();
            let titleEle = row.querySelector('.table-row-title');
            let quantityEle = row.querySelector('.table-row-quantity');
            let durationUnitEle = row.querySelector('.table-row-duration-unit');
            let additionalCostEle = row.querySelector('.table-row-additional-cost');
            if (titleEle && quantityEle && durationUnitEle && additionalCostEle) {
                result.push({
                    "title": $(titleEle).val(),
                    "quantity": $(quantityEle).val(),
                    "duration_unit": $(durationUnitEle).val(),
                    "additional_cost": $(additionalCostEle).valCurrency(),
                })
            }
        });
        return result;
    };

    // DataTable
    static loadPushDtbChild(trEle, parentID) {
        let idTbl = UtilControl.generateRandomString(12);
        if (!trEle.next().hasClass('child-list')) {
            let dtlSub = `<table id="${idTbl}" class="table table-child nowrap w-100"><thead></thead><tbody></tbody></table>`
            trEle.after(
                `<tr class="child-list"><td colspan="4"><div class="child-workflow-group hidden-simple">${dtlSub}</div></td></tr>`
            );
        }
        if (trEle.next().hasClass('child-list')) {
            let $tableChildEle = trEle.next().find('.table-child');
            if ($tableChildEle.length > 0) {
                idTbl = $tableChildEle[0].id;
            }
        }
        AttributeHandle.loadDtbChild(idTbl, parentID);
        return true;
    };

    static loadDtb() {
        if ($.fn.dataTable.isDataTable(AttributeHandle.$table)) {
            AttributeHandle.$table.DataTable().destroy();
        }
        AttributeHandle.$table.DataTableDefault({
            data: [
                {'id': 1, 'title': 'CPU (Category)',},
                {'id': 3, 'title': 'Storage (Category)',},
            ],
        // ajax: {
        //     url: AttributeHandle.$form.attr('data-url'),
        //     type: "GET",
        //     dataSrc: function (resp){
        //       let data = $.fn.switcherResp(resp);
        //       if (data && data.hasOwnProperty('attribute_list')) return data['attribute_list'];
        //       return [];
        //     },
        // },
        pageLength:10,
        scrollY: '70vh',
        info: false,
        columns: [
            {
                targets: 0,
                width: "90%",
                render: (data, type, row) => {
                    return `<div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <button class="btn-collapse-parent btn btn-icon btn-rounded mr-1" data-parent-id="${row?.['id']}"><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${row?.['title']}</b>
                                </div>
                            </div>`;
                }
            },
            {
                targets: 1,
                width: '10%',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-icon btn-rounded btn-rounded btn-flush-light flush-soft-hover btn-lg btn-edit" data-bs-toggle="offcanvas" data-bs-target="#mainCanvas"><span class="icon"><i class="fa-solid fa-pen-to-square"></i></span></button>`;
                }
            },
        ],
        drawCallback: function () {
            // add css to Dtb
            AttributeHandle.dtbHDCustom();
        },
    }, false);
    };

    static dtbHDCustom() {
        let $table = AttributeHandle.$table;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-new').length) {
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-add-new" data-bs-toggle="offcanvas" data-bs-target="#mainCanvas">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${AttributeHandle.$transEle.attr('data-add-new')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
            }
        }
    };

    static loadDtbChild(idTbl, parentID) {
        let $tableChild = $('#' + idTbl);
        if ($.fn.dataTable.isDataTable($tableChild)) {
            $tableChild.DataTable().destroy();
        }
        $tableChild.not('.dataTable').DataTableDefault({
            // useDataServer: true,
            data: [
                {'id': 2, 'title': 'Intel (List)', 'parent_n': 1},
                {'id': 4, 'title': 'SSD (Numeric)', 'parent_n': 3},
            ],
            // ajax: {
            //     url: AttributeHandle.$form.attr('data-url'),
            //     type: 'GET',
            //     data: {'parent_n_id': parentID},
            //     dataSrc: function (resp) {
            //         let data = $.fn.switcherResp(resp);
            //         if (data) return resp.data['attribute_list'] ? resp.data['attribute_list'] : [];
            //         return [];
            //     },
            // },
            pageLength: 5,
            info: false,
            columns: [
                {
                    title: AttributeHandle.$transEle.attr('data-attribute'),
                    width: '70%',
                    render: (data, type, row) => {
                        return `<div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <button class="btn-collapse-parent btn btn-icon btn-rounded mr-1" data-parent-id="${row?.['id']}" hidden><span class="icon"><i class="icon-collapse-app-wf fas fa-caret-right text-secondary"></i></span></button> <b>${row?.['title']}</b>
                                </div>
                            </div>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
            },
            drawCallback: function () {
                // add css to Dtb
                // ShiftAssignHandle.loadDtbHideHeader(idTbl);
            },
        });
    };

    static loadDtbList(data) {
        AttributeHandle.$tableList.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-title">`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control mask-money valid-num table-row-additional-cost">`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let delEle = row.querySelector('.del-row');
                if (delEle) {
                    $(delEle).on('click', function () {
                        AttributeHandle.deleteDtbRow(row, AttributeHandle.$tableList);
                    });
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                AttributeHandle.dtbListHDCustom();
            },
        });
    };

    static dtbListHDCustom() {
        let $table = AttributeHandle.$tableList;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('bg-light');
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-new-list').length) {
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-add-new-list">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${AttributeHandle.$transEle.attr('data-add-new')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-new-list').on('click', function () {
                    $table.DataTable().row.add({}).draw().node();
                });
            }
        }
    };

    static loadDtbWarranty(data) {
        AttributeHandle.$tableWarranty.DataTableDefault({
            styleDom: 'hide-foot',
            data: data ? data : [],
            ordering: false,
            paging: false,
            info: false,
            searching: false,
            autoWidth: true,
            scrollX: true,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-title">`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-quantity valid-num" value="${row?.['quantity'] ? row?.['quantity'] : 0}">`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control table-row-duration-unit">`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        return `<input type="text" class="form-control mask-money valid-num table-row-additional-cost">`;
                    }
                },
                {
                    targets: 4,
                    render: (data, type, row) => {
                        return `<button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row"><span class="icon"><i class="far fa-trash-alt"></i></span></button>`;
                    }
                },
            ],
            rowCallback: function (row, data, index) {
                let delEle = row.querySelector('.del-row');
                if (delEle) {
                    $(delEle).on('click', function () {
                        AttributeHandle.deleteDtbRow(row, AttributeHandle.$tableWarranty);
                    });
                }
            },
            drawCallback: function () {
                $.fn.initMaskMoney2();
                AttributeHandle.dtbWarrantyHDCustom();
            },
        });
    };

    static dtbWarrantyHDCustom() {
        let $table = AttributeHandle.$tableWarranty;
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let $theadEle = wrapper$.find('thead');
        if ($theadEle.length > 0) {
            for (let thEle of $theadEle[0].querySelectorAll('th')) {
                if (!$(thEle).hasClass('border-right')) {
                    $(thEle).addClass('bg-light');
                    $(thEle).addClass('border-right');
                }
            }
        }
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-new-warranty').length) {
                let $group = $(`<button type="button" class="btn btn-primary" id="btn-add-new-warranty">
                                    <span><span class="icon"><i class="fa-solid fa-plus"></i></span><span>${AttributeHandle.$transEle.attr('data-add-new')}</span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-new-warranty').on('click', function () {
                    $table.DataTable().row.add({}).draw().node();
                });
            }
        }
    };

    static deleteDtbRow(currentRow, $table) {
        let rowIndex = $table.DataTable().row(currentRow).index();
        if (rowIndex || rowIndex === 0) {
            let row = $table.DataTable().row(rowIndex);
            row.remove().draw();
        }
        return true;
    };

}

$(document).ready(function () {
    AttributeHandle.init();
    // tạo DateListCallable tháng hiện tại
    const newDate = moment().format('YYYY-MM')
    window.DateListCallable = []
    window.DateListCallable.push(newDate)

    // click show/hide content của filter
    $('.wrap-btn').on('click', function () {
        $(this).toggleClass('is_active')
        $(this).parent().next().next('.content-wrap').slideToggle()
    })

    // EVENT CLICK TO COLLAPSE IN LINE
    //      ACTION: INSERT TABLE CHILD TO ROW
    $(document).on('click', '.btn-collapse-parent', function (event) {
        event.preventDefault();

        let trEle = $(this).closest('tr');
        let iconEle = $(this).find('.icon-collapse-app-wf');

        iconEle.toggleClass('fa-caret-right').toggleClass('fa-caret-down');

        if (iconEle.hasClass('fa-caret-right')) {
            trEle.removeClass('bg-grey-light-5');
            iconEle.removeClass('text-dark').addClass('text-secondary');
            trEle.next().find('.child-workflow-group').slideToggle({
                complete: function () {
                    trEle.next().addClass('hidden');
                }
            });
        }

        if (iconEle.hasClass('fa-caret-down')) {
            trEle.addClass('bg-grey-light-5');
            iconEle.removeClass('text-secondary').addClass('text-dark');

            AttributeHandle.loadPushDtbChild(trEle, $(this).attr('data-parent-id'));
            trEle.next().removeClass('hidden').find('.child-workflow-group').slideToggle();
        }
    });

    AttributeHandle.$table.on('click', '.btn-edit', function () {
        let row = this.closest('tr');
        if (row) {
            let rowIndex = AttributeHandle.$table.DataTable().row(row).index();
            let $row = AttributeHandle.$table.DataTable().row(rowIndex);
            let dataRow = $row.data();
            let cusTitle = AttributeHandle.$offCanvas[0].querySelector('.canvas-title-custom');
            if (cusTitle) {
                $(cusTitle).html(`${AttributeHandle.$transEle.attr('data-canvas-title-update')}`);
            }
            AttributeHandle.$form.attr('data-id', dataRow?.['id']);
            AttributeHandle.$form.attr('data-method', "put");
            $('#title').val(dataRow?.['title']);
        }
        return true;
    });

    SetupFormSubmit.validate(AttributeHandle.$form, {
            rules: {
                title: {
                    required: true,
                    maxlength: 100,
                },
            },
            errorClass: 'is-invalid cl-red',
            submitHandler: submitHandlerFunc
        });

    function submitHandlerFunc() {
        let url = AttributeHandle.$form.attr('data-url-post');
        let method = AttributeHandle.$form.attr('data-method').toLowerCase();
        let id = AttributeHandle.$form.attr('data-id');
        let type = 'CREATE';
        if (method === "put" && id) {
            url = AttributeHandle.$form.attr('data-url-put').format_url_with_uuid(id);
            type = 'UPDATE';
        }

        WindowControl.showLoading({'loadingTitleAction': type});
        $.fn.callAjax2(
            {
                'url': url,
                'method': method,
                'data': AttendanceDeviceHandle.setupDataSubmit(),
            }
        ).then(
            (resp) => {
                let data = $.fn.switcherResp(resp);
                if (data && (data['status'] === 201 || data['status'] === 200)) {
                    $.fn.notifyB({description: data.message}, 'success');
                    setTimeout(() => {
                        AttendanceDeviceHandle.loadDtbTable();
                        WindowControl.hideLoading();
                    }, 2000);
                }
            }, (err) => {
                setTimeout(() => {
                    WindowControl.hideLoading();
                }, 1000)
                $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
            }
        )
    }

});