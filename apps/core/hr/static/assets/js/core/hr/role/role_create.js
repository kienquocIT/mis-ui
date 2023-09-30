$(document).ready(function () {
    callAppList().then((result) => {
        renderAppList(result);
    })

    RoleLoadPage.loadMembers();

    let frm = $("#form-role");
    SetupFormSubmit.validate(
        frm,
        {
            submitHandler: function (form) {
                return new RoleForm({'form': $(form)}).combinesForm(true);
            }
        });
});
