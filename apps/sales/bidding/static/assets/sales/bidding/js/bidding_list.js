$(document).ready(function () {
        function loadDbl() {
            let $table = $('#table_bidding_list')
            let transScript = $('#trans-script')
            let urlDetail = $table.attr('data-url-detail');
            console.log(urlDetail)
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('bidding_list')) {
                            return resp.data['bidding_list'] ? resp.data['bidding_list'] : []
                        }
                        throw Error('Call data raise errors.')
                    },
                },
                rowIdx: true,
                columns: [
                    {
                        targets: 0,
                        width: '1%',
                        render: (data, type, row, meta) => {
                            return ``
                        }
                    },
                    {
                        targets: 1,
                        width: '20%',
                        render: (data, type, row) => {
                            const link = urlDetail.replace('0', row.id);
                            return `<a href=${link} class="text-primary fw-bold">${row?.['title']}</a> ${$x.fn.buttonLinkBlank(link)}`
                        }
                    },
                    {
                        targets: 2,
                        width: '20%',
                        render: (data, type, row) => {
                            return `${row?.['customer']?.['title']}`
                        }
                    },
                    {
                        targets: 3,
                        width: '20%',
                        render: (data, type, row) => {
                            return `${row?.['employee_inherit']?.['full_name']}`
                        }
                    },
                    {
                        targets: 4,
                        width: '20%',
                        render: (data, type, row) => {
                            const date =  row?.['bid_date'] ? moment(row?.['bid_date'].split(' ')[0], 'YYYY-MM-DD').format('DD/MM/YYYY'): '';
                            return `${date}`
                        }
                    },
                    {
                        targets: 5,
                        width: '20%',
                        render: (data, type, row) => {
                            let sttTxt = [
                                transScript.attr('data-trans-waiting'),
                                transScript.attr('data-trans-won'),
                                transScript.attr('data-trans-lost'),
                            ][parseInt(row?.['bid_status'])]

                            let color = [
                                'badge badge-soft-warning',
                                'badge badge-soft-success',
                                'badge badge-soft-danger',
                            ][parseInt(row?.['bid_status'])]

                            return `<span class="${color}">${sttTxt}</span>`;
                        }
                    },
                ],
            });
        }

        loadDbl();

    });
