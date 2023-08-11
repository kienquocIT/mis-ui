$(function () {
    const numLimitShowMember = 10;
    let tb = $('#datatable_role_list');
    let detailUrl = tb.attr('data-detail');
    let updateUrl = tb.attr('data-detail-update');
    let employeeDetailUrl = tb.attr('data-employee-detail');

    $(document).ready(function () {
        tb.DataTableDefault({
            autoWidth: false,
            rowIdx: true,
            ajax: {
                url: tb.attr('data-url'),
                type: tb.attr('data-method'),
                dataSrc: function (resp) {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        return resp.data['role_list'] ? resp.data['role_list'] : [];
                    }
                    return [];
                },
            },
            columns: [
                {
                    'width': '5%',
                    'render': (data, type, row, meta) => {
                        return '';
                    }
                }, {
                    'width': "15%",
                    'data': 'title',
                    'className': 'wrap-text',
                    'render': (data, type, row, meta) => {
                        return `<a href="${detailUrl.replace('-pk-', row.id)}"><b>${row.title}</b></a>`;
                    }
                }, {
                    'width': '15%',
                    'data': 'abbreviation',
                    'className': 'wrap-text',
                    render: (data, type, row, meta) => {
                        return `<span>` + row.abbreviation + `</span>`;
                    }
                }, {
                    'width': '55%',
                    'data': 'holder',
                    'className': 'wrap-text',
                    render: (data, type, row, meta) => {
                        let arrHTML = [];
                        (row.holder && Array.isArray(row.holder) ? row.holder : []).forEach(function (value, i) {
                            let hiddenCls = "";
                            if (i >= numLimitShowMember) {
                                hiddenCls = "hidden";
                            }
                            arrHTML.push(`
                                <a href="${employeeDetailUrl.replace('-pk-', value.id)}"
                                    <span class="child-member badge badge-soft-primary m-1 wrap-text ${hiddenCls}">
                                        ${value?.['full_name']}
                                    </span>
                                </a>
                            `)
                        });
                        if (arrHTML.length > numLimitShowMember) {
                            arrHTML.push(`
                            <button class="btn-show-more-member btn btn-rounded btn-outline-light btn-xs m-1">
                                <span>
                                    <span class="icon"><i class="fa-solid fa-caret-down"></i></span>
                                    <span class="cal-member">+</span>
                                    <span>${arrHTML.length - numLimitShowMember}</span>
                                </span>
                            </button>
                        `);
                        }
                        return arrHTML.join("");

                    }
                }, {
                    'width': '10%',
                    'className': 'wrap-text',
                    'render': (data, type, row, meta) => {
                        let btnUpdate = `
                        <a 
                            href="${updateUrl.replace("-pk-", row.id)}" 
                            class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button" 
                            data-bs-toggle="tooltip" data-bs-placement="top" title="${$.fn.transEle.attr('data-edit')}"
                        >
                            <span class="icon">
                                <i class="fa-regular fa-pen-to-square"></i>
                            </span>
                        </a>
                    `;
                        let btnDelete = `
                        <a 
                            class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" 
                            data-bs-toggle="tooltip" data-bs-placement="top" title="${$.fn.transEle.attr('data-delete')}" 
                            href="#"
                        >
                            <span class="icon">
                                <i class="fa-regular fa-trash-can"></i>
                            </span>
                        </a>
                    `;
                        return `<div class="text-center">` + btnUpdate + btnDelete + `</div>`;
                    }
                },
            ],
            useDataServer: true,
        });
    })

    tb.on("click", ".del-button", function () {
        let rowData = $x.fn.getRowData(this);
        Swal.fire({
            title: $.fn.transEle.attr('data-sure-delete'),
            text: rowData.title,
            showCancelButton: true,
            confirmButtonText: $.fn.transEle.attr('data-confirm'),
            cancelButtonText: $.fn.transEle.attr('data-cancel'),
        }).then((result) => {
            if (result.isConfirmed) {
                let frm = new SetupFormSubmit($('#form-delete'));
                $.fn.callAjax2({
                    url: frm.dataUrl.replace('/pk/', `/${rowData.id}/`),
                    method: frm.dataMethod,
                    csrf_token: frm.dataForm['csrfmiddlewaretoken'],
                }).then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        console.log(resp);
                        $.fn.notifyB({description: $.fn.transEle.attr('data-success')}, 'success');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000)
                        Swal.fire('Saved!', '', 'success');
                    }
                }, (errs) => {
                    $.fn.switcherResp(errs);
                })
            }
        })
    });

    tb.on('click', '.btn-show-more-member', function (event) {
        event.preventDefault();
        let iTag = $(this).find('.icon').find('i');
        if (iTag.hasClass('fa-caret-down')) {
            $(this).find('.cal-member').text('-');
            $(this).parent().find('.child-member').removeClass('hidden');
        } else {
            let counter = 0;
            $(this).parent().find('.child-member').each(function () {
                if (counter >= numLimitShowMember) {
                    $(this).addClass('hidden');
                }
                counter += 1;
            });
            $(this).find('.cal-member').text('+');
        }
        iTag.toggleClass('fa-caret-down').toggleClass('fa-caret-up');
    })
});
