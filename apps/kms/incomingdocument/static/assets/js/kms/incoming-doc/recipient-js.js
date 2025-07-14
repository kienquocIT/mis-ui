class SubmitPopupRecipient {
    static init() {
        $('#recipient_form').on('submit', this.handleSubmit);
    }

    static handleSubmit(e) {
        e.preventDefault();
        recipientModalFunction.loadEmployeeShow();
        $('#modal-recipient').modal('hide');
    }
}

$(document).ready(() => {
    recipientModalFunction.runPopup();
    SubmitPopupRecipient.init();
});
