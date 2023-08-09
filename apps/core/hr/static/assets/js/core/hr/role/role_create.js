$(document).ready(function () {
    callAppList().then((result) => {
        renderAppList(result);
    })

    RoleLoadPage.loadMembers();

    $("#form-role").submit(function (event) {
        event.preventDefault();
        return new RoleForm({'form': $(this)}).combinesForm(true);
    });
});
