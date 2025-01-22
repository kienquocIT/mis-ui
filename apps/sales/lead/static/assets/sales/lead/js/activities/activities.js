class LeadActivitiesHandler{
    constructor() {
        this.$detailLeadDataScript = $('#detail-data-script')
        this.$urlScript = $('#data-url-script')
        this.$activitiesTable = $('#table-timeline')
        this.$transScript = $('#trans-script')
    }

    loadInitS2($ele, data = [], dataParams = {}, customRes = {}, $modal = null, isClear = true) {
        let opts = {
            'allowClear': isClear,
        };
        $ele.empty();
        if (data.length > 0) {
            opts['data'] = data;
        }
        if (Object.keys(dataParams).length !== 0) {
            opts['dataParams'] = dataParams;
        }
        if ($modal) {
            opts['dropdownParent'] = $modal;
        }

        if (Object.keys(customRes).length !== 0) {
            opts['templateResult'] = function (state) {
                let res1 = `<span class="badge badge-soft-light mr-2">${state.data?.[customRes['res1']] ? state.data?.[customRes['res1']] : "--"}</span>`
                let res2 = `<span>${state.data?.[customRes['res2']] ? state.data?.[customRes['res2']] : "--"}</span>`
                return $(`<span>${res1} ${res2}</span>`);
            }
        }
        $ele.initSelect2(opts);
    }

    init(){
        this.detailLeadData = this.$detailLeadDataScript.data('lead-detail')
        this.openOffCanvasEventBinding()
    }

    initSelectKeyData($element, url, keyResp, keyText){
        $element.attr('data-url', url)
        $element.attr('data-keyResp', keyResp)
        $element.attr('data-keytext', keyText)
    }

    initSelectFields(selectConfigs) {
        selectConfigs.forEach(config => {
            this.loadInitS2(
                config.element,
                config.data || [],
                config.params || {},
                config.responseMapping || {}
            );
        });

    }

    openOffCanvasEventBinding(){
        $(document).on('click', '.open-canvas-btn',  (e) => {
            this.loadLeadData()
        })
    }

    clickReloadEventBiding() {
        $(document).on('click','#btn-refresh-activity', ()=>{
            this.fetchActivityListData()
        })
    }

    openActivityDetailEventBiding(){
        $(document).on('click', '.open-detail-btn', (e)=>{
            e.preventDefault()
            let activityList =JSON.parse(this.$detailLeadDataScript.attr('data-lead-activity-list'))
            let currentActivityId = $(e.currentTarget).attr('data-id')
            let currentActivity = activityList.find(item=>item['doc_data']['id'] === currentActivityId)
            console.log(currentActivity)
            this.loadActivityDetail(currentActivity)
        })
    }

    fetchActivityListData(){
        if($.fn.DataTable.isDataTable(this.$activitiesTable)){
            this.$activitiesTable.DataTable().destroy()
            this.$activitiesTable.find('tbody').empty();
        }
        this.$activitiesTable.DataTableDefault({
            useDataServer: true,
            ajax: {
                url: this.$urlScript.data('activity-list-url'),
                method: 'GET',
                isLoading: true,
                data: {
                    'lead_id': $.fn.getPkDetail()
                },
                dataSrc:  (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('lead_activity_list')) {
                        this.$detailLeadDataScript.attr('data-lead-activity-list', JSON.stringify(resp.data['lead_activity_list']))
                        return resp.data['lead_activity_list'] ? resp.data['lead_activity_list'] : []
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
                    width: '15%',
                    render: (data, type, row) => {
                        const activityType = {
                            2: 'call',
                            3: 'email',
                            4: 'meeting',
                        }
                        return `<p class="table-row-application mt-2">${activityType[row?.['log_type']]}</p>`;
                    }
                },
                {
                    targets: 2,
                    width: '20%',
                    render: (data, type, row) => {
                        // log type for call: 2
                        // log type for email: 3
                        // log type for meeting: 4

                        let dataBsTarget = {
                            2: '#offcanvas-call-log-detail',
                            3: '#offcanvas-detail-send-email',
                            4: '#offcanvas-meeting-detail',
                        }
                        let dataIsCancelled = {
                            2: row?.['call_log']?.['is_cancelled'],
                            4: row?.['meeting']?.['is_cancelled']
                        }
                        let title = row?.['doc_data']?.['subject']
                        let status = ''
                        if (dataIsCancelled[row?.['log_type']]) {
                            status = `<span class="badge badge-sm badge-soft-danger">${this.$transScript.data('trans-activity-cancelled')}</i>`
                        }
                        return `<a href="" class="text-primary fw-bold open-detail-btn" 
                                    data-bs-toggle="offcanvas"
                                    data-bs-target=${dataBsTarget[row?.['log_type']]}
                                    data-id=${row?.['doc_data']?.['id']}>${title}</a> ${status}`
                    }
                },
                {
                    targets: 3,
                    width: '20%',
                    render: (data, type, row) => {
                        return `<p class="table-row-application mt-2">${row?.['doc_data']?.['employee_created']}</p>`;
                    }
                },
                {
                    targets: 4,
                    width: '20%',
                    render: (data, type, row) => {
                        let date = $x.fn.reformatData(row?.['date_created'], $x.cls.datetime.defaultFormatDate, 'DD-MM-YYYY');
                        return `<p class="table-row-application mt-2">${date}</p>`;
                    }
                },
                {
                    targets: 5,
                    width: '20%',
                    render: (data, type, row) => {
                        const dateMapping = {
                            2: 'call_date',
                            4: 'meeting_date'
                        }
                        const activityType = row?.['log_type']
                        let date = row?.['doc_data'][dateMapping[activityType]]
                        date = date ? $x.fn.reformatData(date, $x.cls.datetime.defaultFormatDate, 'DD-MM-YYYY') : '_'
                        return `<p class="table-row-application mt-2">${date}</p>`;
                    }
                },
            ]
        })
    }

    loadActivityDetail(currentActivity){
        console.log(currentActivity)
        this.clearDetailFields()
        const loadActivityDetailFunc = {
            2: () => {
                $('#detail-subject-input').html(currentActivity['doc_data']['subject'])
                const contact_name = currentActivity['doc_data']['contact']['fullname']
                                        ? currentActivity['doc_data']['contact']['fullname']
                                        : 'no contact data'
                $('#call-contact-name').html(contact_name)
                $('#call-lead-name').html(currentActivity['doc_data']['lead']['title'])
                $('#detail-result-text-area').html(currentActivity['doc_data']['input_result'])
                let date = $x.fn.reformatData(currentActivity['doc_data']['call_date'], $x.cls.datetime.defaultFormatDate, 'DD-MM-YYYY');
                $('#detail-date-input').html(date)
                $('#lead-call-cancel-activity').attr('data-id', currentActivity['doc_data']['id'])
                const isCancelled = currentActivity['call_log']?.['is_cancelled']
                $('#lead-call-cancel-activity').prop('disabled', isCancelled)
                $('#offcanvas-call-log-detail #is-cancelled').attr('hidden', !isCancelled)
            },
            3: () => {
                $('#detail-email-subject-input').html(currentActivity['doc_data']['subject'])
                let detail_email_to_list = []
                for (let item of currentActivity['doc_data']['email_to_list']) {
                    detail_email_to_list.push(`<a class="dropdown-item" href="#">${item}</a>`);
                }
                $('#btn-email-to').html('To ('+detail_email_to_list.length+ ')')
                $('#detail-email-to').html(detail_email_to_list);

                let detail_email_cc_list = []
                for (let item of currentActivity['doc_data']['email_cc_list']) {
                    detail_email_cc_list.push(`<a class="dropdown-item" href="#">${item}</a>`);
                }
                $('#btn-email-cc').html('Cc ('+detail_email_cc_list.length+ ')')
                $('#detail-email-cc').html(detail_email_cc_list);

                $('#detail-email-from').html(`<a class="dropdown-item" href="#">${currentActivity['doc_data']?.['from_email']}</a>`);
                $('#btn-email-from').text('From')

                let detail_email_bcc_list = []
                for (let item of currentActivity['doc_data']['email_bcc_list']) {
                    detail_email_bcc_list.push(`<a class="dropdown-item" href="#">${item}</a>`);
                }
                $('#btn-email-bcc').html('Bcc ('+detail_email_bcc_list.length+ ')')
                $('#detail-email-bcc').html(detail_email_bcc_list);

                $('#detail-meeting-text-area').html(currentActivity['doc_data']['content'])
                let date = $x.fn.reformatData(currentActivity['date_created'], $x.cls.datetime.defaultFormatDate, 'DD-MM-YYYY');
                $('#offcanvas-detail-send-email #detail-date-input').html(date)

                $('#email-log-status').html('Successfully')
                console.log(currentActivity['doc_data'])
                let sendStatusElement = ''
                if (currentActivity['doc_data']['just_log']) {
                    sendStatusElement = '<span class="text-danger">Logged only</span>';
                } else {
                    sendStatusElement = currentActivity['doc_data']['send_success']
                        ? '<span class="text-primary">Successful</span>'
                        : '<span class="text-danger">Failed</span>';
                }
                $('#email-send-status').html(sendStatusElement)
            },
            4: () => {
                $('#form-new-meeting #detail-subject-input').html(currentActivity['doc_data']['subject'])
                let date = $x.fn.reformatData(currentActivity['doc_data']['meeting_date'], $x.cls.datetime.defaultFormatDate, 'DD-MM-YYYY');
                $('#form-new-meeting #detail-date-input').html(date)
                let fromTime = $x.fn.reformatData(currentActivity['doc_data']['meeting_from_time'], 'HH:mm', 'HH:mm');
                $('#form-new-meeting #detail-from').html(fromTime)
                let toTime = $x.fn.reformatData(currentActivity['doc_data']['meeting_to_time'], 'HH:mm', 'HH:mm');
                $('#form-new-meeting #detail-to').html(toTime)
                $('#form-new-meeting #detail-meeting-address').html(currentActivity['doc_data']['meeting_address'])
                $('#form-new-meeting #detail-meeting-room').html(currentActivity['doc_data']['room_location'])
                for (let employee of currentActivity['doc_data']['employee_attended_list']){
                    $('#form-new-meeting #detail-emp-attended').append(`
                        <span class="badge badge-outline badge-soft-success mr-1">
                            ${employee?.['fullname']} 
                            ${employee?.['group']?.['title'] ? '- '  + employee?.['group']?.['title'] : ''}
                        </span>`);
                }
                for (let employee of currentActivity['doc_data']['customer_member_list']){
                    $('#form-new-meeting #detail-customer-member').append(`
                        <span class="badge badge-outline badge-soft-success mr-1">
                            ${employee?.['fullname']} 
                        </span>`);
                }
                $('#form-new-meeting #detail-result').html(currentActivity['doc_data']['input_result'])
                $('#lead-meeting-cancel-activity').attr('data-id', currentActivity['doc_data']['id'])
                const isCancelled = currentActivity['meeting']?.['is_cancelled']
                $('#lead-meeting-cancel-activity').prop('disabled', isCancelled)
                $('#offcanvas-meeting-detail #is-cancelled').attr('hidden', !isCancelled)
            },

        }
        loadActivityDetailFunc[currentActivity['log_type']]()
    }

    setUpFormSubmit(formSubmit){
        SetupFormSubmit.call_validate(formSubmit, {
            onsubmit: true,
            submitHandler: (form, event) => {
                this.form = new SetupFormSubmit(formSubmit);
                this.setUpFormData()
                console.log(this.form)
                $.fn.callAjax2({
                    url: this.form.dataUrl,
                    method: this.form.dataMethod,
                    data: this.form.dataForm
                }).then(
                    (resp) => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({
                                'description': 'Success',
                            }, 'success');
                            this.fetchActivityListData()
                            this.clearCreateFormFields()
                        }
                    },
                    (errs) => {
                        if(errs.data.errors){
                            for (const [key, value] of Object.entries(errs.data.errors)) {
                                $.fn.notifyB({title: key, description: value}, 'failure');
                            }
                        } else {
                            $.fn.notifyB('Error', 'failure');
                        }
                    });
            },
        })
    }

    clearDetailFields() {
        $('#detail-subject-input').html('');
        $('#call-contact-name').html('');
        $('#call-lead-name').html('');
        $('#detail-result-text-area').html('');
        $('#detail-date-input').html('');

        $('#form-new-meeting #detail-subject-input').html('');
        $('#form-new-meeting #detail-date-input').html('');
        $('#form-new-meeting #detail-from').html('');
        $('#form-new-meeting #detail-to').html('');
        $('#form-new-meeting #detail-meeting-address').html('');
        $('#form-new-meeting #detail-meeting-room').html('');
        $('#form-new-meeting #detail-emp-attended').html('');
        $('#form-new-meeting #detail-customer-member').html('');
        $('#form-new-meeting #detail-result').html('');

        $('#detail-email-subject-input').html('');
        $('#btn-email-to').html('To (0)');
        $('#detail-email-to').html('');
        $('#btn-email-cc').html('Cc (0)');
        $('#detail-email-cc').html('');
        $('#detail-meeting-text-area').html('');
        $('#offcanvas-detail-send-email #detail-date-input').html('');
    }

    //abstract method
    loadLeadData(){
        //logic based on each class
    }

    setUpFormData(){
        //logic based on each class
    }

    clearCreateFormFields(){

    }
}

class LeadCallActivitiesHandler extends LeadActivitiesHandler{
    constructor() {
        super();
        this.$formSubmit = $('#form-call-log')
        this.$callDate = $('#date-input')
        this.$callLeadSelect = $('#call-lead-select')
        this.$callContactSelect = $('#contact-select-box')
        this.$titleInput = $('#subject-input')
        this.$contentTextArea = $('#result-text-area')
        this.$cancelBtn = $('#lead-call-cancel-activity')
    }

    init() {
        this.initSelectKeyData(this.$callContactSelect, this.$urlScript.data('contact-list-url'), 'contact_list', 'fullname')
        const selectConfigs = [
            { element: this.$callLeadSelect },
            { element: this.$callContactSelect, data: [], params: {}, responseMapping: { res1: 'code', res2: 'fullname' } }
        ];
        this.initSelectFields(selectConfigs)

        super.init();
    }

    setUpFormData(){
        //reformat date
        let call_date = this.$callDate.val()
        call_date = $x.fn.reformatData(call_date, 'DD/MM/YYYY', 'YYYY-MM-DD');
        this.form.dataForm['call_date'] = call_date
        this.form.dataForm['subject'] = this.$titleInput.val()
        this.form.dataForm['input_result'] = this.$contentTextArea.val()
        this.form.dataForm['contact'] = this.$callContactSelect.val() ? this.$callContactSelect.val() : null

        this.form.dataUrl = this.$urlScript.attr('data-call-url')
    }

    setUpFormSubmit(){
        super.setUpFormSubmit(this.$formSubmit)
    }

    loadLeadData() {
        const detailLeadData = this.detailLeadData
        this.loadInitS2(this.$callLeadSelect, [detailLeadData])

        if(detailLeadData['config_data']?.['contact_mapped']){
            const contactData = detailLeadData['config_data']?.['contact_mapped']
            this.loadInitS2(this.$callContactSelect, [contactData])
        }
        this.$callContactSelect.prop('disabled', false)
    }

    clearCreateFormFields() {
        this.$callDate.val('').trigger('change')
        this.$titleInput.val('')
        this.$contentTextArea.val('')
    }

    cancelCallEventBinding(){
        $(document).on('click', '#lead-call-cancel-activity', (e)=>{
            let url = this.$urlScript.data('call-detail-url')
            const id = $(e.currentTarget).data('id')
            url = url.format_url_with_uuid(id)
            console.log(url)
            $.fn.callAjax2({
                    url: url,
                    method: 'PUT',
                    data: {
                        'is_cancelled': true
                    }
                }).then(
                    (resp) => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({
                                'description': 'Success',
                            }, 'success');
                            $('#lead-call-cancel-activity').prop('disabled', true)
                            $('#offcanvas-call-log-detail #is-cancelled').attr('hidden', false)
                            this.fetchActivityListData()
                        }
                    },
                    (errs) => {
                        if(errs.data.errors){
                            for (const [key, value] of Object.entries(errs.data.errors)) {
                                $.fn.notifyB({title: key, description: value}, 'failure');
                            }
                        } else {
                            $.fn.notifyB('Error', 'failure');
                        }
                    });
        })
    }
}

class LeadEmailActivitiesHandler extends LeadActivitiesHandler{
    constructor() {
        super();
        this.$formSubmit = $('#form-new-email')
        this.$emailCCSelect = $('#email-cc-select-box')
        this.$emailToSelect = $('#email-to-select-box')
        this.$emailBCCSelect = $('#email-bcc-select-box')
        this.$titleInput = $('#email-subject-input')
        this.$contentTextArea = $('#email-content-area')
        this.$emailLeadSelect = $('#email-lead-select')
        this.$logOptionCheckbox = $('#just_log')
    }

    init() {
        super.init();
    }

    loadLeadData(){
        let contactList = this.detailLeadData?.['config_data']?.['contact_mapped']?.code
            ? [this.detailLeadData?.['config_data']?.['contact_mapped']]
            : []
        loadEmailToList(contactList)
        loadEmailCcList(contactList)
        loadEmailBccList(contactList)
        this.loadInitS2(this.$emailLeadSelect, [this.detailLeadData])
    }

    setUpFormData(){
        this.form.dataForm['subject'] = this.$titleInput.val()
        this.form.dataForm['content'] = $('.ck-content').html()
        this.form.dataForm['email_to_list'] = this.$emailToSelect.val()
        this.form.dataForm['email_cc_list'] = this.$emailCCSelect.val()
        this.form.dataForm['email_bcc_list'] = this.$emailBCCSelect.val()
        this.form.dataForm['just_log'] = this.$logOptionCheckbox.is(':checked')

        this.form.dataUrl = this.$urlScript.attr('data-email-url')
    }

    setUpFormSubmit(){
        super.setUpFormSubmit(this.$formSubmit)
    }

    clearCreateFormFields() {
        this.$emailToSelect.val('').trigger('change')
        this.$emailCCSelect.val('').trigger('change')
        this.$titleInput.val('')
    }
}

class LeadMeetingActivitiesHandler extends LeadActivitiesHandler{
    constructor() {
        super();
        this.$formSubmit = $('#form-new-meeting')
        this.$titleInput = $('#meeting-subject-input')
        this.$contentTextArea = $('#meeting-result-text-area')
        this.$dateInput = $('#meeting-date-input')
        this.$meetingFromTimeInput = $('#meeting-from-time-input')
        this.$meetingToTimeInput = $('#meeting-to-time-input')
        this.$meetingEmployeeSelect = $('#meeting-employee-attended-select-box')
        this.$meetingCustomerSelect = $('#meeting-customer-member-select-box')
        this.$meetingLeadSelect = $("#meeting-lead-select")
        this.$meetingRoomLocation = $('#meeting-room-location-input')
    }

    initTimeInputField(){
        this.$meetingFromTimeInput.daterangepicker({
            timePicker : true,
            singleDatePicker:true,
            timePicker24Hour : true,
            timePickerIncrement : 1,
            timePickerSeconds : false,
            locale : {
                format : 'HH:mm'
            }
            }).on('show.daterangepicker', function(ev, picker) {
                picker.container.find(".calendar-table").hide();
        });

        this.$meetingToTimeInput.daterangepicker({
            timePicker : true,
            singleDatePicker:true,
            timePicker24Hour : true,
            timePickerIncrement : 1,
            timePickerSeconds : false,
            locale : {
                format : 'HH:mm'
            }
            }).on('show.daterangepicker', function(ev, picker) {
                picker.container.find(".calendar-table").hide();
        });
    }

    init() {
        this.initTimeInputField()
        this.initSelectKeyData(this.$meetingEmployeeSelect, this.$meetingEmployeeSelect.data('url'), 'employee_list', 'full_name')
        this.initSelectKeyData(this.$meetingCustomerSelect, this.$urlScript.data('contact-list-url'), 'contact_list', 'fullname')
        super.init();
    }

    loadLeadData(){
        this.$meetingCustomerSelect.prop('disabled', false)
        this.loadInitS2(this.$meetingLeadSelect, [this.detailLeadData])
        this.loadInitS2(this.$meetingCustomerSelect, [this.detailLeadData?.['config_data']?.['contact_mapped']] )
    }

    setUpFormData(){
        let meeting_date = this.$dateInput.val()
        meeting_date = $x.fn.reformatData(meeting_date, 'DD/MM/YYYY', 'YYYY-MM-DD');
        this.form.dataForm['meeting_date'] = meeting_date
        this.form.dataForm['subject'] = this.$titleInput.val()
        this.form.dataForm['input_result'] = this.$contentTextArea.val()
        this.form.dataForm['room_location'] = this.$meetingRoomLocation.val()
        this.form.dataForm['employee_attended_list'] = []
        const employeeList = this.$meetingEmployeeSelect.val()
        for (const employee of employeeList){
            this.form.dataForm['employee_attended_list'].push({
                'employee_attended_mapped': employee
            })
        }
        this.form.dataForm['customer_member_list'] = []
        const customerList = this.$meetingCustomerSelect.val()
        for (const customer of customerList){
            if (customer){
                 this.form.dataForm['customer_member_list'].push({
                    'customer_member_mapped': customer
                })
            }
        }

        this.form.dataForm['email_notify'] = $('#send_notify_email').is(':checked')

        this.form.dataUrl = this.$urlScript.attr('data-meeting-url')
    }

    setUpFormSubmit(){
        super.setUpFormSubmit(this.$formSubmit)
    }

    cancelMeetingEventBinding(){
        $(document).on('click', '#lead-meeting-cancel-activity', (e)=>{
            let url = this.$urlScript.data('meeting-detail-url')
            const id = $(e.currentTarget).data('id')
            url = url.format_url_with_uuid(id)
            console.log(url)
            $.fn.callAjax2({
                    url: url,
                    method: 'PUT',
                    data: {
                        'is_cancelled': true
                    }
                }).then(
                    (resp) => {
                        const data = $.fn.switcherResp(resp);
                        if (data) {
                            $.fn.notifyB({
                                'description': 'Success',
                            }, 'success');
                            $('#lead-meeting-cancel-activity').prop('disabled', true)
                            $('#offcanvas-meeting-detail #is-cancelled').attr('hidden', false)
                            this.fetchActivityListData()
                        }
                    },
                    (errs) => {
                        if(errs.data.errors){
                            for (const [key, value] of Object.entries(errs.data.errors)) {
                                $.fn.notifyB({title: key, description: value}, 'failure');
                            }
                        } else {
                            $.fn.notifyB('Error', 'failure');
                        }
                    });
        })
    }
}


$(document).ready(function () {
    // make sure data lead detail is loaded to scriptElement
    const scriptElement = document.getElementById('detail-data-script')
    const observer = new MutationObserver((mutations)=>{
        mutations.forEach(function(mutation) {
            if(mutation.attributeName==='data-lead-detail'){
                console.log($(mutation.target).attr('data-lead-detail'))

                const leadActivitiesHandlerObj = new LeadActivitiesHandler()
                leadActivitiesHandlerObj.fetchActivityListData()
                leadActivitiesHandlerObj.clickReloadEventBiding()
                leadActivitiesHandlerObj.openActivityDetailEventBiding()


                const leadCallActivitiesHandlerObj = new LeadCallActivitiesHandler()
                leadCallActivitiesHandlerObj.init()
                leadCallActivitiesHandlerObj.setUpFormSubmit()
                leadCallActivitiesHandlerObj.cancelCallEventBinding()

                const leadEmailActivitiesHandlerObj = new LeadEmailActivitiesHandler()
                leadEmailActivitiesHandlerObj.init()
                leadEmailActivitiesHandlerObj.setUpFormSubmit()

                const leadMeetingActivitiesHandlerObj = new LeadMeetingActivitiesHandler()
                leadMeetingActivitiesHandlerObj.init()
                leadMeetingActivitiesHandlerObj.setUpFormSubmit()
                leadMeetingActivitiesHandlerObj.cancelMeetingEventBinding()

                observer.disconnect();
            }
        });
    })
    observer.observe(scriptElement, {attributes: true})
})