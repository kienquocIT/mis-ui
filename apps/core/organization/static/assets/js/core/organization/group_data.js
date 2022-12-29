/*Blog Init*/
"use strict";
$('#datable_group_list').DataTable({
    dom: '<"row"<"col-7 mb-3"<"blog-toolbar-left">>' +
        '<"col-5 mb-3"<"blog-toolbar-right"flip>>>' +
        '<"row"<"col-sm-12"t>>' +
        '<"row"<"col-sm-12 col-md-5"i><"col-sm-12 col-md-7"p>>',
    ordering: false,
    paginate: false,
    language: {
        search: "",
        searchPlaceholder: "Search",
        info: "",
    },
});