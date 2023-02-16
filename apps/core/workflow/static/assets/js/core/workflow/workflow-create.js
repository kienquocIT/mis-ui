"use strict";
var ZONEINDEX = 0;
$(function () {

    $(document).ready(function () {
        // init dataTable
        let $tables = $('.table');
        $tables.each(function(){
            let $elm = $(this);
            $elm.DataTable({
                searching: false,
                ordering: false,
                paginate: false,
                info:false,
                drawCallback: function () {
                    // render icon after table callback
                    feather.replace();
                },
                rowCallback: function (row, data) {
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
                        render:(data, type, row)=>{
                            return `<p>${row.title}</p>`
                        }
                    },
                    {
                        targets: 2,
                        render:(data, type, row)=>{
                            return `<p>${row.remark}</p>`
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) =>{
                            let str_html = `<div>
                                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button"
                                                   data-bs-toggle="tooltip"
                                                   data-bs-placement="top"
                                                   title=""
                                                   data-bs-original-title="Edit"
                                                   href="#"
                                                   data-id="${row.id}">
                                                    <span class="btn-icon-wrap btn-open-power-user-info"
                                                          data-bs-toggle="modal"
                                                          data-bs-target="#power_user_info">
                                                        <span class="feather-icon">
                                                            <i data-feather="edit"></i>
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>`;
                            return str_html
                        },
                    }
                ],
            });
        })


        // handle modal is show
        $('#add_zone').on('shown.bs.modal', function (e) {
            let $form = $(this).find('form')
            $('#btn-zone-submit').off().on('click', function(e){
                let _form = new FormData($form[0])
                let temp = {
                    "order": ZONEINDEX + 1,
                    "title": _form.get("title"),
                    "remark": _form.get("remark"),
                    "property_list": _form.getAll("property_list")
                }
                $('#table_workflow_zone').DataTable().row.add(temp).draw()
                $form[0].reset();
                ZONEINDEX = ZONEINDEX + 1
                $(this).closest('.modal').modal('hide')
            })
        });

        // form submit
        $('#btn-create_workflow').on('click', function (e) {
            let $form = document.getElementById('form-create_workflow')
            let _form = new SetupFormSubmit($('#form-create_workflow'))
            let zoneTableData = $('#table_workflow_zone').DataTable().data().toArray()
            _form.dataForm['zone'] = zoneTableData

            let csr = $("[name=csrfmiddlewaretoken]").val()

            $.fn.callAjax(_form.dataUrl, _form.dataMethod, _form.dataForm, csr)
                .then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data) {
                            // $.fn.notifyPopup({description: "Group is being created"}, 'success')
                            $.fn.redirectUrl($($form).attr('data-url-redirect'), 3000);
                        }
                    },
                    (errs) => {
                        $.fn.notifyPopup({description: "Group create fail"}, 'failure')
                    }
                )
        });
    });
});