let ZONE_INDEX = 0;
let WF_DATATYPE = [];

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
        let temp = {
            "order": form_order ? form_order : 1,
            "title": _form.get("title"),
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

// handle event add new zone
function addZoneBtn(ElmSelectbox) {
    // show modal add zone
    $('[data-bs-target="#add_zone"]').on('click', function (e) {
        e.preventDefault();
        let getApp = ElmSelectbox.select2('data')
        if (getApp.length === 0) {
            $.fn.notifyB({description: $(this).attr('data-required-text')}, 'failure');
            return true
        } else
            $($(this).attr('data-bs-target')).modal('show')
        let $form = $($(this).attr('data-bs-target')).find('form')
        modalFormSubmit($form)
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
        $form.find('#property_list_choices').val(data.property_list).trigger('change')
        // load data detail to Select2
        for (let prop of data.property_list) {
            if (typeof prop === 'object' && prop !== null) {
                $form.find('#property_list_choices').append(`<option value="${prop?.['id']}" selected>${prop?.['title']}</option>`);
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
    $tables.DataTable({
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
                render: () => {
                    return `<div class="form-check"><input type="checkbox" class="form-check-input"></div>`
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    let dataRow = JSON.stringify(row).replace(/"/g, "&quot;");
                    return `<p class="table-row-title" data-row="${dataRow}">${row.title}</p>`
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<p>${row.remark}</p>`
                }
            },
            {
                targets: 3,
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

$(document).ready(function () {
    // declare global scope variable
    let $prev_btn = $('#nav-next-prev-step .prev-btn');
    let $next_btn = $('#nav-next-prev-step .next-btn');
    let $select_box = $("#select-box-features");
    WF_DATATYPE = JSON.parse($('#wf_data_type').text());

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
        } else if (btn_href === '#tab_node') {
            NodeLoadDataHandle.loadZoneDDAllTable();
        }
    })

    //handle event on change function applied
    $select_box.on("select2:select", function (e) {
        $next_btn.prop('disabled', false);
        $next_btn.on('click', () => $prev_btn.prop('disabled', false))
        $('#property_list_choices').attr('data-params', JSON.stringify({application: e.params.data.id, is_sale_indicator: false}))
    });

    // button create new zone
    addZoneBtn($select_box)

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