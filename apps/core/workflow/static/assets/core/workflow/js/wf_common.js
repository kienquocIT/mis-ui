let ZONE_INDEX = 0;
let WF_DATATYPE = [];
let $trans = $('#node-trans-factory');

function loadInitS2($ele, data = [], dataParams = {}, $modal = null, isClear = false, customRes = {}) {
        let opts = {'allowClear': isClear};
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }
        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
        return true;
    };

// handle btn modal zone save
function modalFormSubmit($form, is_edit=false) {
    $('#btn-zone-submit').off().on('click', function (e) {
        e.preventDefault();
        let _form = new FormData($form[0])
        let form_order = parseInt(_form.get("order"))
        let $tableZone = $('#table_workflow_zone');
        // setup order add new
        if (is_edit === false) {
            if (!$tableZone[0].querySelector('.dataTables_empty')) {
                let tableLen = $tableZone[0].tBodies[0].rows.length;
                form_order = (tableLen + 1);
            }
        }
        let title = _form.get("title");
        if (!title) {
            $.fn.notifyB({description: 'Title is required'}, 'failure');
            return false
        }
        let temp = {
            "order": form_order ? form_order : 1,
            "title": title,
            "remark": _form.get("remark"),
            "property_list": _form.getAll("property_list")
        }
        if (_form.get('zone_id'))
            temp['id'] = _form.get('zone_id')
        // if (_form.get("order") && _form.get("order") !== undefined) {
        if (is_edit === true) {  // edit zone
            let rowIdx = form_order - 1
            $tableZone.DataTable().row(rowIdx).data(temp).draw()
        } else $tableZone.DataTable().row.add(temp).draw()  // add new zone
        $form[0].reset();
        $form.find('.dropdown-select_two').val(null).trigger('change');
        ZONE_INDEX = ZONE_INDEX + 1
        // $(this).closest('.modal').modal('hide')
    });
}

// handle event table zone actions on click (edit, delete)
function actionsClick(elm, data, iEvent) {
    let isAction = $(iEvent.currentTarget).attr('data-action');
    if (isAction === 'edit') {
        let $add_zone_modal = $('#add_zone');
        let $form = $add_zone_modal.find('form');
        $form.find('[name="title"]').val(data.title)
        $form.find('[name="remark"]').val(data.remark)
        if (data?.['property_list'].length > 0) {
            if (typeof data?.['property_list'][0] === 'object' && data?.['property_list'][0] !== null) {
                loadInitS2($('#property_list_choices'), data.property_list, {'application': $("#select-box-features").val(), 'is_wf_zone': true});
            } else {
                $form.find('#property_list_choices').val(data.property_list).trigger('change');
            }
        }
        $form.find('[name="order"]').val(data.order)
        if (data.hasOwnProperty('id'))
            $form.find('[name="zone_id"]').val(data.id)
        modalFormSubmit($form, true);
        $add_zone_modal.modal('show')
    } else if (isAction === 'delete') {
        let table_elm = $(elm).parents('table.table');
        $(table_elm).DataTable().rows(elm).remove().draw();
        // .row(elm).index()
        let isDataTableList = $(table_elm).DataTable().data().toArray()
        for (let [idx, item] of isDataTableList.entries()) {
            item['order'] = idx + 1
        }
        $(table_elm).DataTable().data(isDataTableList).draw(false)
    }
}

function initTableZone(data) {
    // init dataTable
    let listData = data ? data : []
    let $tables = $('#table_workflow_zone');
    $tables.DataTableDefault({
        data: listData,
        searching: false,
        ordering: false,
        paginate: false,
        info: false,
        drawCallback: function (row, data) {
            // render icon after table callback
            feather.replace();
            // reorder from index to order
            if (data) {
                let api = this.api()
                let newIndex = api.row(row).index()
                data['order'] = newIndex + 1
            }
            if ($('#form-create_workflow').attr('data-method').toLowerCase() !== 'get') {
                dtbZoneHDCustom();
            }
        },
        rowCallback: function (row, data) {
            // handle onclick btn
            $('.actions-btn a', row).off().on('click', function (e) {
                e.stopPropagation();
                actionsClick(row, data, e)
            })
        },
        columns: [
            {
                targets: 0,
                width: '40%',
                render: (data, type, row) => {
                    let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                    return `<p class="table-row-title" data-row="${dataRow}">${row.title}</p>`
                }
            },
            {
                targets: 1,
                width: '50%',
                render: (data, type, row) => {
                    return `<p>${row.remark}</p>`
                }
            },
            {
                targets: 2,
                width: '10%',
                render: (data, type, row) => {
                    let _id = row.order
                    if (row.hasOwnProperty('id') && row.id)
                        _id = row.id
                    let disabled = '';
                    const isReadonly = $('#form-detail_workflow').attr('readonly')
                    if (isReadonly === 'readonly') disabled = 'disabled'
                    return `<div class="actions-btn">
                                    <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button ${disabled}"
                                       title="Edit"
                                       href="#"
                                       data-id="${_id}"
                                       data-action="edit">
                                        <span class="feather-icon">
                                            <i data-feather="edit"></i>
                                        </span>
                                    </a>
                                    <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn ${disabled}"
                                       title="Delete"
                                       href="#"
                                       data-id="${_id}"
                                       data-action="delete">
                                        <span class="btn-icon-wrap">
                                            <span class="feather-icon">
                                                <i data-feather="trash-2"></i>
                                            </span>
                                        </span>
                                    </a>
                                </div>`;
                },
            }
        ],
    });
}

function dtbZoneHDCustom() {
        let $table = $('#table_workflow_zone');
        let wrapper$ = $table.closest('.dataTables_wrapper');
        let headerToolbar$ = wrapper$.find('.dtb-header-toolbar');
        let textFilter$ = $('<div class="d-flex overflow-x-auto overflow-y-hidden"></div>');
        headerToolbar$.prepend(textFilter$);

        if (textFilter$.length > 0) {
            textFilter$.css('display', 'flex');
            // Check if the button already exists before appending
            if (!$('#btn-add-zone').length) {
                let $group = $(`<button
                                        type="button"
                                        class="btn btn-outline-secondary btn-floating"
                                        id="btn-add-zone"
                                        data-bs-toggle="modal"
                                        data-bs-target="#add_zone"
                                        data-required-text="${$trans.attr('data-required-application')}"
                                >
                                    <span><span>${$trans.attr('data-add-zone')}</span><span class="icon"><i class="fa-solid fa-plus"></i></span></span>
                                </button>`);
                textFilter$.append(
                    $(`<div class="d-inline-block min-w-150p mr-1"></div>`).append($group)
                );
                // Select the appended button from the DOM and attach the event listener
                $('#btn-add-zone').on('click', function () {
                    let getApp = $("#select-box-features").select2('data')
                    if (getApp.length === 0) {
                        $.fn.notifyB({description: $(this).attr('data-required-text')}, 'failure');
                        return true
                    } else
                        $($(this).attr('data-bs-target')).modal('show')
                    let $form = $($(this).attr('data-bs-target')).find('form')
                    modalFormSubmit($form)
                });
            }
        }
    }

function callAjaxApps() {
    let $ele = $("#select-box-features");
    WindowControl.showLoading();
    $.fn.callAjax2({
            'url': $('#app-url-factory').attr('data-application'),
            'method': 'GET',
            'data': {"is_workflow": true},
            'isDropdown': true,
        }
    ).then(
        (resp) => {
            let data = $.fn.switcherResp(resp);
            if (data) {
                if (data.hasOwnProperty('tenant_application_list') && Array.isArray(data.tenant_application_list)) {
                    let fnData = [{'id': '', 'title': 'Select...',}];
                    loadInitS2($ele, fnData.concat(DataProcessorControl.sortArrayByObjectKey(data?.['tenant_application_list'], "title_i18n")));
                    WindowControl.hideLoading();
                }
            }
        }
    )
}

$(document).ready(function () {
    // declare global scope variable
    let $prev_btn = $('#nav-next-prev-step .prev-btn');
    let $next_btn = $('#nav-next-prev-step .next-btn');
    let $select_box = $("#select-box-features");
    WF_DATATYPE = JSON.parse($('#wf_data_type').text());
    callAjaxApps();


    // handle event on click prev next btn
    $("#nav-next-prev-step button").off().on('click', function (e) {

        // display show hide content of tabs
        e.preventDefault()
        let elmIsActive = $('.nav-workflow-form-tabs li a.active')
        $('.tab-pane').removeClass('show active')
        let btn_href = elmIsActive.parents('li').next().find('a').attr('data-href')
        elmIsActive.removeClass('active')
        if ($(this).attr('data-nav-type') === 'prev') {
            elmIsActive.parents('li').prev().find('a').addClass('active')
            btn_href = elmIsActive.parents('li').prev().find('a').attr('data-href')

            // handle if button prev is last of list nav
            if (btn_href === '#tab_function') $prev_btn.prop('disabled', true)
            $next_btn.prop('disabled', false)
        }
        else {
            elmIsActive.parents('li').next().find('a').addClass('active')
            // handle if button next is last of list nav
            if (btn_href === '#tab_next_node') $next_btn.prop('disabled', true)
            else $next_btn.prop('disabled', false)
            $prev_btn.prop('disabled', false)
        }
        $(`${btn_href}`).addClass('show active')

        // catch if next tab is display config condition
        if (btn_href === '#tab_next_node') {
            FlowJsP.init()
        }
    })

    //handle event on change function applied
    $select_box.on("select2:select", function (e) {
        $next_btn.prop('disabled', false);
        $next_btn.on('click', () => $prev_btn.prop('disabled', false))
        loadInitS2($('#property_list_choices'), [], {'application': e.params.data.id, 'is_wf_zone': true});
    });

    // action reset default of modal
    $('#id-restore_default').on('change', function () {
        let isChecked = $(this).prop('checked')
        if (isChecked) $('#table_workflow_rename [name*="btn_"]').val('');
    });

    // modal rename button action
    $('#change_btn').on('shown.bs.modal', function () {
        let $this = $(this)
        $('#btn-rename').on('click', function () {
            let btn_data_list = []
            $('#table_workflow_rename [name*="btn_"]').each(function (idx, elm) {
                if ($(elm).val() !== '') {
                    let temp = {}
                    temp[$(elm).attr('data-key')] = $(elm).val()
                    btn_data_list.push(temp)
                }
            })
            $('[name="actions_rename"]').val(JSON.stringify(btn_data_list))
            $this.modal('hide')
        });
    })
})