$(function () {
    $(document).ready(function () {

        let transEle = $('#app-trans-factory');

        function loadDbl() {
            let $table = $('#table_zones_list')
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: $table.attr('data-url'),
                    type: $table.attr('data-method'),
                    data: {
                        'is_print': false, 'is_mail': false, 'is_sale_indicator': false, 'is_workflow': true,
                    },
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('tenant_application_list')) {
                            return resp.data['tenant_application_list'] ? resp.data['tenant_application_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                pageLength:50,
                columns: [
                    {
                        targets: 0,
                        render: (data, type, row, meta) => {
                            return `<p class="table-row-order">${(meta.row + 1)}</p>`;
                        }
                    },
                    {
                        targets: 1,
                        render: (data, type, row) => {
                            return `<p class="table-row-application">${row?.['title']}</p>`;
                        }
                    },
                    {
                        targets: 2,
                        render: (data, type, row) => {
                            return `<button type="button" class="btn btn-icon btn-rounded btn-flush-primary flush-soft-hover" data-bs-toggle="offcanvas" data-bs-target="#offcanvasZones" aria-controls="offcanvasExample"><span class="icon"><i class="fas fa-eye"></i></span></button>`
                        }
                    },
                    {
                        targets: 3,
                        render: (data, type, row) => {
                            return `<div class="dropdown">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                    <div role="menu" class="dropdown-menu">
                                        <a class="dropdown-item" href=""><i class="dropdown-icon far fa-edit text-primary"></i><span>${transEle.attr('data-edit')}</span></a>
                                    </div>
                                </div>`;
                        }
                    },
                ],
                drawCallback: function () {
                    // mask money
                    $.fn.initMaskMoney2();
                },
            });
        }

        loadDbl();

    });
});