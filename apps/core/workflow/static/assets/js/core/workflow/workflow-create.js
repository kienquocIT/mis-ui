"use strict";
var ZONEINDEX = 0;
$(function () {

    $(document).ready(function () {
        // declare global scope variable
        let $prev_btn = $('#nav-next-prev-step .prev-btn');
        let $next_btn = $('#nav-next-prev-step .next-btn');

        // init select function applied
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
        let $tables = $('.table');
        $tables.each(function () {
            let $elm = $(this);
            $elm.DataTable({
                searching: false,
                ordering: false,
                paginate: false,
                info: false,
                drawCallback: function () {
                    // render icon after table callback
                    feather.replace();
                },
                rowCallback: function (row, data) {
                    // handle onclick btn
                    $('.actions-btn a', row).on('click', function (e) {
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
                            let str_html = `<div class="actions-btn">
                                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button"
                                                   title="Edit"
                                                   href="#"
                                                   data-id="${row.id}"
                                                   data-action="edit">
                                                    <span class="feather-icon">
                                                        <i data-feather="edit"></i>
                                                    </span>
                                                </a>
                                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                                                   title="Delete"
                                                   href="#"
                                                   data-id="${row.id}"
                                                   data-action="delete">
                                                    <span class="btn-icon-wrap">
                                                        <span class="feather-icon">
                                                            <i data-feather="trash-2"></i>
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

        // handle btn in form submit
        function modalFormSubmit($form) {
            $('#btn-zone-submit').off().on('click', function (e) {
                let _form = new FormData($form[0])
                let temp = {
                    "order": _form.get("order") ? _form.get("order") : ZONEINDEX + 1,
                    "title": _form.get("title"),
                    "remark": _form.get("remark"),
                    "property_list": _form.getAll("property_list")
                }
                if (_form.get("order") && _form.get("order") !== '' && _form.get("order") !== undefined) {
                    let rowIdx = parseInt(_form.get("order")) - 1
                    $('#table_workflow_zone').DataTable().row(rowIdx).data(temp).draw()
                } else $('#table_workflow_zone').DataTable().row.add(temp).draw()
                $form[0].reset();
                $form.find('.dropdown-select_two').val(null).trigger('change');
                ZONEINDEX = ZONEINDEX + 1
                // $(this).closest('.modal').modal('hide')
            });
        }

        // handle modal is show
        $('[data-bs-target="#add_zone"]').on('click', function (e) {
            let getApp = $select_box.select2('data')
            if (getApp.length === 0) {
                $.fn.notifyPopup({description: $(this).attr('data-required-text')}, 'failure');
                return true
            } else
                $($(this).attr('data-bs-target')).modal('show')
            let $form = $($(this).attr('data-bs-target')).find('form')
            modalFormSubmit($form)
        });

        // handle event on click prev next btn
        $("#nav-next-prev-step button").off().on('click', function (e) {
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
            } else {
                elmIsActive.parents('li').next().find('a').addClass('active')
                // handle if button next is last of list nav
                if (btn_href === '#tab_next_node') $next_btn.prop('disabled', true)
                else $next_btn.prop('disabled', false)
            }
            $(`${btn_href}`).addClass('show active')


        })

        //handle event on change function applied
        $select_box.on("select2:select", function (e) {
            $next_btn.prop('disabled', false);
            $next_btn.on('click', (e) => $prev_btn.prop('disabled', false))
            $('#property_list_choices').attr('data-params', JSON.stringify({application: e.params.data.id}))
        });

        // handle event table actions on click
        function actionsClick(elm, data, iEvent) {
            let isACtion = $(iEvent.currentTarget).attr('data-action');
            if (isACtion === 'edit') {
                let $form = $('#add_zone').find('form')
                $form.find('[name="title"]').val(data.title)
                $form.find('[name="remark"]').val(data.remark)
                $form.find('#property_list_choices').val(data.property_list).trigger('change')
                $form.find('[name="order"]').val(data.order)
                modalFormSubmit($form)
                $('#add_zone').modal('show')
            } else if (isACtion === 'delete') {
                let isDataTableList = elm.parents('table.table').DataTable().data().toArray()
                console.dir(isDataTableList)
            }
            // console.log(elm, '\n')
            // console.dir(data)
        }

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