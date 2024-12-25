$(document).ready(function () {
    $('#btn-add-new-cond-grp').on('click',function () {
        const $filterGroupArea = $('#filter-cond-area');
        // Add "OR" text
        const ORRow = `
            <div class="row my-4">
                <div class="col-12">
                    <div class="fs-2 text-center">OR</div>
                </div>
            </div>
        `;
        $filterGroupArea.append(ORRow);

        // Add new filter row
        const newFilterCard = `
            <div class="card">
                <div class="card-header">
                   Filter group
                </div>
                <div class="card-body filter-group-body" >
                    <div class="filter-row">
                        <div class="row">
                            <div class="col-3">
                                <div class="form-group">
                                    <label class="form-label required" hidden></label>
                                    <select name="customer" class="form-select select2" data-method="GET" data-url="{% url 'ConsultingAccountListAPI' %}" required></select>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="form-group">
                                    <label class="form-label required" hidden></label>
                                    <select name="customer" class="form-select select2" data-method="GET" data-url="{% url 'ConsultingAccountListAPI' %}" required></select>
                                </div>
                            </div>
                            <div class="col-3">
                                <div class="form-group">
                                    <label class="form-label required" hidden></label>
                                    <select name="customer" class="form-select select2" data-method="GET" data-url="{% url 'ConsultingAccountListAPI' %}" required></select>
                                </div>
                            </div>
                            <div class="col-1">
                                <div class="d-flex justify-content-center">
                                    <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title=""><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <button type="button" class="btn btn-outline-primary btn-add-new-cond" >
                        <span>
                            <span class="icon"><i class="fa-solid fa-plus"></i></span>
                            <span>And</span>
                        </span>
                    </button>
                </div>
            </div>
        `;
        $filterGroupArea.append(newFilterCard);
        $('.form-select.select2').select2();
    })

    $(document).on('click', '.btn-add-new-cond', function () {
        const $filterGroupBody = $(this).closest('.card').find('.filter-group-body');

        // Add "AND" text
        // const andRow = `
        //     <div class="row mb-2">
        //         <div class="col-12">
        //             AND
        //         </div>
        //     </div>
        // `;
        // $filterGroupBody.append(andRow);

        // Add new filter row
        const newFilterRow = `
            <div class="filter-row">
                <div class="row mb-2">
                    <div class="col-12">
                        AND
                    </div>
                </div>
                <div class="row">
                <div class="col-3">
                    <div class="form-group">
                        <label class="form-label required" for="consulting-customer-select" hidden></label>
                        <select name="customer" class="form-select select2" data-method="GET" data-url="{% url 'ConsultingAccountListAPI' %}" required></select>
                    </div>
                </div>
                <div class="col-3">
                    <div class="form-group">
                        <label class="form-label required" for="consulting-customer-select" hidden></label>
                        <select name="customer" class="form-select select2" data-method="GET" data-url="{% url 'ConsultingAccountListAPI' %}" required></select>
                    </div>
                </div>
                <div class="col-3">
                    <div class="form-group">
                        <label class="form-label required" for="consulting-customer-select" hidden></label>
                        <select name="customer" class="form-select select2" id="consulting-customer-select" data-method="GET" data-url="{% url 'ConsultingAccountListAPI' %}" required></select>
                    </div>
                </div>
                <div class="col-1">
                    <div class="d-flex justify-content-center">
                        <button type="button" class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover del-row" data-bs-toggle="tooltip" data-bs-placement="bottom" title=""><span class="icon"><i class="far fa-trash-alt"></i></span></button>
                    </div>
                </div>
                </div>
            </div>
        `;
        $filterGroupBody.append(newFilterRow);

        // Reinitialize the Select2 plugin for dynamically added elements
        $('.form-select.select2').select2();
    });


     $(document).on('click', '.del-row', function () {
         const $currentRow = $(this).closest('.filter-row');
         const $currentCardBody = $currentRow.closest('.card-body')
         if ($currentCardBody.children().length === 1){
             $currentCardBody.closest('.card').remove()
         }
         $currentRow.remove()
    });
})