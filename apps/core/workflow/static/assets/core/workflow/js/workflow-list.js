$(function () {
    $(document).ready(function () {
        let $table = $('#table_workflow_list')
        let LISTURL = $table.attr('data-url')
        let _dataTable = $table.DataTable({
            searching: false,
            language: {
                // search: "_INPUT_",
                // searchPlaceholder: "Search...",
                paginate: {
                    "previous": '<i data-feather="chevron-left"></i>',
                    "next": '<i data-feather="chevron-right"></i>'
                },
                info: 'Showing _START_ to _END_ of _TOTAL_ rows',
                lengthMenu: '_MENU_ rows per page',
            },
            dom: '<"top"f>rt<"bottom"ilp><"clear">',
            ordering: false,
            ajax: {
                url: LISTURL,
                type: "GET",
                dataSrc: 'data.workflow_list',
                data:function(params){
                    let txtSearch = $('#search_input').val();
                    if (txtSearch.length > 0)
                        params['search'] = txtSearch
                    params['is_ajax'] = true;
                    return params
                },
                error: function(jqXHR) {
                    $table.find('.dataTables_empty').text(jqXHR.responseJSON.data.errors)
                }
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
                        return `<div><a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover del-button" `
                            +`data-bs-original-title="Delete" href="javascript:void(0)" data-url="${urlUpdate}" `
                            +`data-method="DELETE"><span class="btn-icon-wrap"><span class="feather-icon">`
                            +`<i data-feather="trash-2"></i></span></span></a></div>`;
                    },
                }
            ],
        });

        $('#search_input').on('keyup', function(evt){
            const keycode = evt.which;
            if (keycode === 13) //enter to search
                _dataTable.ajax.reload()
        })
    });
});