$(document).ready(function () {
        function loadDbl() {
            let $table = $('#table_partnercenter_list_list')
            let urlDetail = $table.attr('data-url-detail');
            let urlResultList =  $table.attr('data-url-result-list');
            let frm = new SetupFormSubmit($table);
            $table.DataTableDefault({
                useDataServer: true,
                ajax: {
                    url: frm.dataUrl,
                    type: frm.dataMethod,
                    dataSrc: function (resp) {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('list_list')) {
                            console.log(resp.data['list_list'])
                            return resp.data['list_list'] ? resp.data['list_list'] : []
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
                        width: '10%',
                        render: (data, type, row) => {
                            const link = urlResultList.replace('0', row.id);
                            return `<a href=${link} class="text-primary fw-bold">${row?.['title']}</a> ${$x.fn.buttonLinkBlank(link)}`
                        }
                    },
                    {
                        targets: 2,
                        width: '20%',
                        render: (data, type, row) => {
                            return `${row.date_created}`
                        }
                    },
                    {
                        targets: 3,
                        width: '20%',
                        render: (data, type, row) => {
                            return `${row.data_object.title}`
                        }
                    },
                    {
                        targets: 4,
                        width: '20%',
                        render: (data, type, row) => {
                            return `${row.num_of_records}`
                        }
                    },
                    {
                        targets: 5,
                        width: '10%',
                        render: (data, type, row) => {
                            const link = urlDetail.replace('0', row.id);
                            return `
                            <div class="d-flex gap-2 align-items-center">
                                    <a href=${link}>
                                        
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-soft-primary attach-file" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom" 
                                    >
                                            <span class="icon"><i class="fas fa-pencil"></i></span>
                                    </button>
                                    </a>
                                    <button 
                                        type="button" 
                                        class="btn btn-icon btn-rounded btn-soft-primary attach-file" 
                                        data-bs-toggle="tooltip" 
                                        data-bs-placement="bottom" 
                                    >
                                            <span class="icon"><i class="fa-regular fa-copy"></i></span>
                                    </button>
                                </div>`
                        }
                    },

                ],
            });
        }

        loadDbl();

    });
