class customerHandle {
    customerList = [];
    customerCond = [];
    set setCustomerList (data){
        this.customerList = data
    }
    get getCustomerList(){
        return this.customerList
    }
    set setCustomerCond (data){
        this.customerCond = data
    }
    get getCustomerCond(){
        return this.customerCond
    }
    onOpenModal() {
        $('#customer_modal').on('show.bs.modal', function () {
            let type = $('[name="customer_type"]').val();
            if (!type || type === 0) $('.customer_list, .customer_condition').addClass('hidden');
            else if (_thisValue === 1) {
                $('.customer_list').removeClass('hidden');
                $('.customer_condition').addClass('hidden');
            }
            else {
                $('.customer_list').addClass('hidden');
                $('.customer_condition').removeClass('hidden');
            }
            $(`[name="select_customer_type"] option[value="${type}"]`).trigger('change');
        });
    }

    runCustomerListTable(){
        let $table = $('#table_customer_list')
        let url = $table.attr('data-url');
        $table.DataTableDefault({
            ajax: {
                url: url,
                type: "GET",
                dataSrc: 'data.employee_list',
            },
            columns: [
                {
                    targets: 0,
                    class: 'w-10',
                    render: (row, type, data) => {
                        let checked = '';
                        if (data.checked) checked = 'checked'
                        return `<div class="form-check"><input type="checkbox" class="form-check-input" ${checked}></div>`
                    }
                },
                {
                    targets: 1,
                    class: 'w-65',
                    render: (row, type, data) => {
                        return `<p>${data.full_name}</p>`;
                    }
                },
                {
                    targets: 2,
                    class: 'w-25 text-center',
                    render: (row, type, data) => {
                        return `<p>${data.code}</p>`;
                    }
                },
            ],
            rowCallback(row, data){
                $('input[type="checkbox"]', row).on('change', function(){
                    data.checked = this.checked
                })
            }
        }, false);
    }
    onSave(){
        let tempVal = parseInt($('[name="select_customer_type"]').val());
        $('[name="customer_type"]').val(tempVal);
        if (tempVal === 1){
            this.setCustomerList = $('table_customer_list').DataTable().column(0, {selected: true}).data().toArray();
        }
        else if (tempVal === 2){

        }
    }

    initEventNewRowCondition(){
        return ''
    }

    init() {
        // handle when modal is open
        this.onOpenModal();
        // load list of customer into table
        this.runCustomerListTable();
    }
}

let Customer = new customerHandle();

$(function () {
    // modal select type show/hide content

    $('[name="select_customer_type"]').on('change', function () {
        let _thisValue = parseInt(this.value);
        if (_thisValue === 0) $('.customer_list, .customer_condition').addClass('hidden');
        else if (_thisValue === 1) {
            $('.customer_list').removeClass('hidden');
            $('.customer_condition').addClass('hidden');
        } else {
            $('.customer_list').addClass('hidden');
            $('.customer_condition').removeClass('hidden');
            if(Customer.getCustomerCond.length){
                // call func html render condition data
            }
            else{
                let html = $('.t-conditions').html();
                $('.customer_condition').html(html);
                Customer.initEventNewRowCondition();
            }
        }
    });

    // run customer modal feature
    Customer.init();
});
