"use strict";
/***
 *
 * @param value Object key of data type
 * @param elm element per row of formset
 */
function changeParameter(value, elm){
    let tempHtml = '';
    elm.find('[name*="-math"]').html('');
    for (let item of WF_DATATYPE[value]){
        tempHtml += `<option value="${item.value}">${item.text}</option>`;
    }
    elm.find('[name*="-math"]').append(tempHtml);
}

$(function () {

    $(document).ready(function () {

        WF_DATATYPE = JSON.parse($('#wf_data_type').text())
        // init select function applied ---> chua vi?t docs cho select2
        let $select_box = $("#select-box-features");
        let selectURL = $select_box.attr('data-url')
        $select_box.select2({
            ajax: {
                url: selectURL,
                processResults: function (res) {
                    let data_original = res.data[$select_box.attr('data-prefix')];
                    let data_convert = []
                    if (data_original.length) {
                        for (let item of data_original) {
                            data_convert.push({...item, 'text': item.title})
                        }
                    }
                    return {
                        results: data_convert
                    };
                }
            },
            tags: true,
            multiple: true,
            tokenSeparators: [',', ' ']
        })

        // init dataTable
        let $tables = $('#table_workflow_zone');
        $tables.DataTable({
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
                        return `<p>${row.title}</p>`
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
                        return `<div class="actions-btn">
                                    <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button"
                                       title="Edit"
                                       href="#"
                                       data-id="${_id}"
                                       data-action="edit">
                                        <span class="feather-icon">
                                            <i data-feather="edit"></i>
                                        </span>
                                    </a>
                                    <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
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

        // handle event table zone actions on click
        function actionsClick(elm, data, iEvent) {
            let isAction = $(iEvent.currentTarget).attr('data-action');
            if (isAction === 'edit') {
                let $add_zone_modal = $('#add_zone');
                let $form = $add_zone_modal.find('form');
                $form.find('[name="title"]').val(data.title)
                $form.find('[name="remark"]').val(data.remark)
                $form.find('#property_list_choices').val(data.property_list).trigger('change')
                $form.find('[name="order"]').val(data.order)
                if (data.hasOwnProperty('id'))
                    $form.find('[name="zone_id"]').val(data.id)
                modalFormSubmit($form)
                $add_zone_modal.modal('show')
            }
            else if (isAction === 'delete') {
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

        // form submit
        $('#btn-create_workflow').on('click', function (e) {
            e.preventDefault()
            let $form = document.getElementById('form-create_workflow')
            let _form = new SetupFormSubmit($('#form-create_workflow'))
            _form.dataForm['zone'] = $('#table_workflow_zone').DataTable().data().toArray()
            let nodeTableData = setupDataNode(true);
            // get exit node condition for node list
            if (COMMIT_NODE_LIST)
                for (let item of nodeTableData) {
                    if (COMMIT_NODE_LIST.hasOwnProperty(item.order))
                        item.condition = COMMIT_NODE_LIST[item.order]
                }
            _form.dataForm['node'] = nodeTableData

            // convert associate to json
            let associate_temp = _form.dataForm['associate'].replaceAll('\\', '');
            if (associate_temp) {
                let associate_data_submit = [];
               let associate_data_json =  JSON.parse(associate_temp);
               for (let key in associate_data_json) {
                   associate_data_submit.push(associate_data_json[key]);
               }
               _form.dataForm['association'] = associate_data_submit;
            }

            let submitFields = [
                'title',
                'application',
                'node',
                'zone',
                'is_multi_company',
                'is_define_zone',
                'actions_rename',
                'association'
            ]
            if (_form.dataForm) {
                for (let key in _form.dataForm) {
                    if (!submitFields.includes(key)) delete _form.dataForm[key]
                }
            }
            let temp = _form.dataForm['actions_rename']
            if (temp) _form.dataForm['actions_rename'] = JSON.parse(temp)
            else _form.dataForm['actions_rename'] = []

            let csr = $("[name=csrfmiddlewaretoken]").val()

            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyPopup({description: data.message}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                        }
                    },
                    (errs) => {
                        console.log(errs)
                        $.fn.notifyPopup({description: "Workflow create fail"}, 'failure')
                    }
                )
        });

    });
});
