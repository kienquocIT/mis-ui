$(document).ready(function () {
    new DistributionPlanHandle().load();

    $('#plan-des').tinymce({
        height: 300,
        menubar: false,
        placeholder: "Thị trường, Thị phần, Đối thủ cạnh tranh, Yêu cầu về vốn, Yêu cầu khác",
        plugins: [
           'advlist','autolink',
           'lists','link','image','charmap','preview','anchor','searchreplace','visualblocks',
           'fullscreen','insertdatetime','media','table','help','wordcount'
        ],
        toolbar: 'undo redo | a11ycheck casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist checklist outdent indent | removeformat | code table help'
    })
})