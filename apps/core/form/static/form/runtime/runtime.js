$(document).ready(function () {
    let content$ = $('#contents');
    if (content$.length > 0) {
        let frm$ = content$.find('form');
        if (frm$.length > 0) {
            // btn switch
            let btnSwitch$ = content$.find('#btnSwitchAccount');
            if (btnSwitch$.length > 0) {
                btnSwitch$.attr('href', btnSwitch$.attr('href').replaceAll('next=', `next=${window.location.pathname}`));
            }

            // current user data
            let currentUserName$ = content$.find('#form-head--current-user-name');
            currentUserName$.text(frm$.data('user-current-name'));
            frm$.removeAttr('data-user-current-name');
        }
    }
})