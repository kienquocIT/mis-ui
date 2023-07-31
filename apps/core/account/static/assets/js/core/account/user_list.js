/*Blog Init*/
$(function () {
    let tb = $('#datatable_user_list');
    tb.DataTableDefault({
        rowIdx: true,
        ajax: {
            url: tb.attr('data-url'),
            type: tb.attr('data-method'),
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    return resp.data['user_list'] ? resp.data['user_list'] : [];
                }
                return [];
            },
        },
        columns: [
            {
                'render': (data, type, row, meta) => {
                    // let currentId = "chk_sel_" + String(meta.row + 1)
                    // return `<span class="form-check mb-0"><input type="checkbox" class="form-check-input check-select" id="${currentId}" data-id=` + row.id + `><label class="form-check-label" for="${currentId}"></label></span>`;
                    return ''
                }
            }, {
                'data': 'full_name',
                'render': (data, type, row, meta) => {
                    if (row.hasOwnProperty('full_name') && row.hasOwnProperty('first_name') && typeof row.full_name === 'string') {
                        return `<div class="media align-items-center">
                                <div class="media-head me-2">
                                    <div class="avatar avatar-xs avatar-success avatar-rounded">
                                        <span class="initial-wrap">` + row.first_name.charAt(0).toUpperCase() + `</span>
                                    </div>
                                </div>
                                <div class="media-body">
                                    <a href="/account/user/detail/` + row.id + `">
                                        <span class="d-block">` + row.full_name + `</span>
                                    </a>    
                                        
                                </div>
                            </div>`;
                    }
                    return '';
                }
            }, {
                'data': 'username',
                render: (data, type, row, meta) => {
                    return `<span class="badge badge-soft-primary">` + row.username + `</span>`;
                }
            }, {
                'className': 'action-center',
                'render': (data, type, row, meta) => {
                    let btn1 = `<button class="btn btn-icon btn-rounded bg-dark-hover btn-modal-change-passwd" data-bs-toggle="modal" data-bs-target="#modalChangePassword"><span class="icon" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Change password" ><i class="fas fa-key"></i></span></button>`;
                    let btn2 = `<a class="btn btn-icon btn-rounded bg-dark-hover edit-button" href="user/edit/${row.id}" data-id="${row.id}"><span class="icon" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Edit" ><i class="fas fa-edit"></i></span></a>`;
                    let btn3 = `<button class="btn btn-icon btn-rounded bg-dark-hover del-button" href="user/edit/${row.id}" data-id="${row.id}"><span class="icon" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Delete" ><i class="fas fa-user-times"></i></span></button>`;
                    return btn1 + btn2 + btn3;
                }
            },
        ]
    });

    $(document).on('click', '.btn-modal-change-passwd', function (event){
        let rowData = DTBControl.getRowData($(this));
        $('#modalChangePasswordUserText').text(rowData?.['full_name']);
        $('#btnSaveNewPassword').attr('data-id', rowData?.['id']);
    });

    $(document).on('click', '.check-select', function () {
        if ($(this).is(":checked")) {
            $(this).closest('tr').addClass('selected');
        } else {
            $(this).closest('tr').removeClass('selected');
            $('.check-select-all').prop('checked', false);
        }
    });

    $(document).on('click', '.check-select-all', function () {
        $('.check-select').attr('checked', true);
        let table = $('#datatable_user_list').DataTable();
        let indexList = table.rows().indexes();
        if ($(this).is(":checked")) {
            for (let idx = 0; idx < indexList.length; idx++) {
                let rowNode = table.rows(indexList[idx]).nodes()[0];
                rowNode.classList.add('selected');
                rowNode.firstElementChild.children[0].firstElementChild.checked = true;
            }
            $('.check-select').prop('checked', true);
        } else {
            for (let idx = 0; idx < indexList.length; idx++) {
                let rowNode = table.rows(indexList[idx]).nodes()[0];
                rowNode.classList.remove("selected");
                rowNode.firstElementChild.children[0].firstElementChild.checked = false;
            }
            $('.check-select').prop('checked', false);
        }
    });

    $(document).on('click', '.btnShowHidePassword', function (event){
       $(this).toggleClass('fa-eye-slash').toggleClass('fa-eye');
       let inputTag = $(this).closest('.form-text').prev('input');
       if (inputTag.attr('type') === 'password'){
           inputTag.attr('type', 'text');
       } else {
           inputTag.attr('type', 'password');
       }
    });

    $('#retype-new-password').on('input', function (event){
        if ($('#new-password').val() === $(this).val()){
            $(this).removeClass('text-danger').addClass('text-success');
            $('#btnSaveNewPassword').removeAttr('disabled');
        } else {
            $('#btnSaveNewPassword').attr('disabled', 'disabled');
            $(this).removeClass('text-success').addClass('text-danger');
        }
    });

    $('#btnSaveNewPassword').click(function (event){
        let newPassword = $('#new-password').val();
        let re_password = $('#retype-new-password').val();
        if (newPassword === re_password){
            let urlData = $(this).attr('data-url');
            let dataID = $(this).attr('data-id');
            WindowControl.showLoading();
            $.fn.callAjax(
                SetupFormSubmit.getUrlDetailWithID(urlData, dataID),
                'PUT',
                {'password': newPassword, 're_password': re_password},
                $("input[name=csrfmiddlewaretoken]").val()
            ).then(
                (resp)=>{
                    let data = $.fn.switcherResp(resp);
                    if (data.status === 200){
                        $.fn.notifyB({
                            'description': $('#base-trans-factory').attr('data-success')
                        }, 'success');
                        setTimeout(
                            ()=>{
                                window.location.reload();
                            },
                            1000
                        )
                    }
                    setTimeout(
                        ()=>{WindowControl.hideLoading()},
                        1500
                    )
                },
                (errs)=>{
                    WindowControl.hideLoading();
                }
            )
        } else {
            $.fn.notifyB({
                'description': 'New password does not match'
            })
        }
    });
});