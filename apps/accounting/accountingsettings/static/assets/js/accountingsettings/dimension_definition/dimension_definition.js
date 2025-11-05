$(document).ready(function () {
    const $datatableDimension = $('#datatable-dimension')
    function initDimensionTable(data){
        $datatableDimension.DataTableDefault({
            rowIdx: false,
            reloadCurrency: true,
            scrollCollapse: true,
            data: data,
            columns: [
                {
                    targets: 0,
                    render: (data, type, row) => {
                        return `<div>${row?.['display_order']}</div>`;
                    }
                },
                {
                    targets: 1,
                    render: (data, type, row) => {
                        return `<div>${row?.['code']}</div>`;
                    }
                },
                {
                    targets: 2,
                    render: (data, type, row) => {
                        return `<div>${row?.['title']}</div>`;
                    }
                },
                {
                    targets: 3,
                    render: (data, type, row) => {
                        let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-update-product-category"
                           data-id="${row?.['id']}"
                           data-code="${row?.['code']}"
                           data-title="${row?.['title']}"
                           data-description="${row?.['description']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-product-category"
                           data-bs-placement="top" title=""
                           >
                           <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                        </a>`
                        let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                        return `${edit_btn}${delete_btn}`
                    }
                },
            ]
        })
    }

    function handleSaveDimension(){
        $('#btn-save-dimension').on('click', async function (){
            await saveDimension()
        })
    }

    async function saveDimension(){
        return await $.fn.callAjax2()
    }

    function setupFormSubmit(){

    }
    initDimensionTable([{}, {}])
    handleSaveDimension()
})