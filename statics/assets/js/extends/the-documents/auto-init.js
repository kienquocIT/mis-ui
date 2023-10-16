$(document).ready(function () {
    new $x.cls.bastionField({
        has_opp: true,
        has_inherit: true,
        inherit_data: [{
            "id": "",
            "title": "",
            "selected": true,
        }],
        opp_data: [{
            "id": "",
            "title": "",
            "selected": true,
        }]
    }).init();
})