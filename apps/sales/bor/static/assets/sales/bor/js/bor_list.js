$(document).ready(function () {
    function loadBORList() {
        if (!$.fn.DataTable.isDataTable('#bor-list-table')) {
            let dtb = $('#bor-list-table');
            let frm = new SetupFormSubmit(dtb);
            dtb.DataTableDefault({
                // useDataServer: true,
                rowIdx: true,
                reloadCurrency: true,
                // ajax: {
                //     url: frm.dataUrl,
                //     type: frm.dataMethod,
                //     dataSrc: function (resp) {
                //         let data = $.fn.switcherResp(resp);
                //         if (data) {
                //             return resp.data['distribution_plan_list'] ? resp.data['distribution_plan_list'] : [];
                //         }
                //         return [];
                //     },
                // },
                data: [],
                columns: [
                    {
                        'render': () => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-10',
                        'render': (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-40',
                        'render': (data, type, row) => {
                            const link = dtb.attr('data-url-detail').replace('0', row.id);
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-20 text-center',
                        'render': (data, type, row) => {
                            return ``;
                        }
                    },
                    {
                        className: 'wrap-text w-20 text-center',
                        'render': (data, type, row) => {
                            return ``;
                        }
                    },
                ],
            });
        }
    }

    loadBORList();
})