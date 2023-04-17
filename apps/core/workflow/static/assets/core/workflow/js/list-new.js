$(function () {
    // declare main variable
    let $table = $('#table_workflow_list');
    let LISTURL = $table.attr('data-url');
    let _dataTable = $table.DataTableDefault({
        ajax: {
            url: LISTURL,
            type: "GET",
            dataSrc: 'data.workflow_list',
            data:function(params){

                params['is_ajax'] = true;
                return params
            },
            error: function(jqXHR) {
                $table.find('.dataTables_empty').text(jqXHR.responseJSON.data.errors)
            }
        },
    });
});
