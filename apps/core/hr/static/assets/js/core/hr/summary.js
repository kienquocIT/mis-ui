$(document).ready(function () {
    let tbl = $('#dtb-apps-using');
    tbl.DataTableDefault({
        stateFullTableTools: false,
        rowIdx: true,
        data: [
            {
                'role': $x.fn.randomStr(5),
                'apps': [
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                ]
            },
            {
                'role': $x.fn.randomStr(5),
                'apps': [
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                ]
            },
            {
                'role': $x.fn.randomStr(5),
                'apps': [
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                ]
            },
            {
                'role': $x.fn.randomStr(5),
                'apps': [
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                ]
            },
            {
                'role': $x.fn.randomStr(5),
                'apps': [
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                ]
            },
            {
                'role': $x.fn.randomStr(5),
                'apps': [
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                    $x.fn.randomStr(10),
                ]
            },
        ],
        autoWidth: false,
        columns: [
            {
                width: "10%",
                render: (data, type, row) => {return '';}
            },
            {
                width: "30%",
                data: 'role',
                render: (data, type, row) => {
                    return data ? `<span class="badge badge-primary">${data}</span>` : '';
                },
            },
            {
                width: "60%",
                data: 'apps',
                render: (data, type, row) => {
                    return data ? data.map((item)=>{return `<span class="badge badge-light">${item}</span>`}).join(" ") : '';
                }
            }
        ]
    });
});