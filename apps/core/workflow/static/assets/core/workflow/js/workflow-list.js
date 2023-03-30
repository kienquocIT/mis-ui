"use strict";
$(function () {
    $(document).ready(function () {
        let $table = $('#table_workflow_list')
        let LISTURL = $table.attr('data-url')
        $table.DataTable({
            language: {
                "paginate": {
                    "previous": '<i data-feather="chevron-left"></i>',
                    "next": '<i data-feather="chevron-right"></i>'
                }
            },
            // dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">><"col-5 mb-3"<"blog-toolbar-right"f>>><"row"<"col-sm-12"t>><"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
            ordering: false,
            searching: true,
            // paginate: false,
            // info:false,
            ajax: {
                url: LISTURL,
                type: "GET",
                dataSrc: 'data.workflow_list',
                data:function(params){
                    params['is_ajax'] = true;
                    return params
                },
                error: function(jqXHR, ajaxOptions, thrownError) {
                    $table.find('.dataTables_empty').text(jqXHR.responseJSON.data.errors)
                }
            },
            onFieldError: function (editor, error) {
                errorbox(error.name + ': ' + error.status);
                // Now how do I prevent the error shown inside the table row?
            },
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
                    render: (data, type, row) => {
                        const link = $('#workflow-link').data('link-update').format_url_with_uuid(row.id)
                        return `<a href="${link}" target="_blank" class="link-primary underline_hover">${row.title}</a>`
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<p>${row.application.title}</p>`
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let html = `<button type="button" class="btn btn-soft-danger">Deactive</button>`
                        if (row.is_active) html = `<button type="button" class="btn btn-soft-success">Active</button>`
                        return html
                    }
                },
                {
                    targets: 4,
                    className: 'action-center',
                    render: (data, type, row) => {
                        let urlUpdate = $('#workflow-link').attr('data-link-update').format_url_with_uuid(row.id)
                        let str_html = `<div>
                                                <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" 
                                                data-bs-original-title="Delete" 
                                                href="javascript:void(0)" 
                                                data-url="${urlUpdate}" 
                                                data-method="DELETE">
                                                <span class="btn-icon-wrap"><span class="feather-icon"><i data-feather="trash-2"></i></span></span>
                                                </a>
                                            </div>`;
                        return str_html
                    },
                }
            ],
        });
    });
});