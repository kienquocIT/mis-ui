// function loadTemplatePrint(data) {
//     return `<table style="border-collapse: collapse; width: 100%; height: 19px;" border="1">
// <tbody>
// <tr style="height: 19px;">
// <td style="width: 48.9665%; height: 19px; border-style: hidden;"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/FTEL_Logo.svg/2560px-FTEL_Logo.svg.png" alt="My alt text" width="354" height="116" /></td>
// <td style="width: 48.9665%; height: 19px; border-style: hidden;">
// <p>${data?.['customer']?.['title']}</p>
// <p>T&ograve;a nh&agrave; FPT T&acirc;n Thuận , L&ocirc;L29B-31B-33B, đường số 8, KCX T&acirc;n Thuận, phường T&acirc;n Thuận Đ&ocirc;ng, quận 7, Th&agrave;nh phố Hồ Ch&iacute; Minh, Việt Nam</p>
// </td>
// </tr>
// </tbody>
// </table>
// <hr />
// <h1 style="text-align: center;"><strong>QUOTATION</strong></h1>
// <table style="border-collapse: collapse; width: 100%; height: 74px; border-style: hidden;" border="1">
// <tbody>
// <tr style="height: 17px; border-style: hidden;">
// <td style="width: 48.9665%; height: 17px; border-style: hidden;"><strong>To: </strong>C&ocirc;ng ty cổ phần FPT</td>
// <td style="width: 48.9665%; height: 17px; text-align: right;"><strong>Quotation No.: </strong>SQ0001</td>
// </tr>
// <tr style="height: 19px; border-style: hidden;">
// <td style="width: 48.9665%; height: 19px;"><strong>Billing address: </strong>T&ograve;a nh&agrave; FPT T&acirc;n Thuận , L&ocirc;L29B-31B-33B, đường số 8, KCX T&acirc;n Thuận, phường T&acirc;n Thuận Đ&ocirc;ng, quận 7, Th&agrave;nh phố Hồ Ch&iacute; Minh, Việt Nam</td>
// <td style="width: 48.9665%; height: 19px; border-style: hidden; text-align: right;"><strong>Date: </strong>29/09/2023</td>
// </tr>
// <tr style="height: 19px; border-style: hidden;">
// <td style="width: 48.9665%; height: 19px; border-style: hidden;"><strong>Tax code: </strong>0101248141</td>
// <td style="width: 48.9665%; height: 19px; border-style: hidden; text-align: right;"><strong>Expire date: </strong>29/12/2023</td>
// </tr>
// <tr style="height: 19px;">
// <td style="width: 48.9665%; height: 19px;"><strong>Phone: </strong>+84 24 7300 7300</td>
// <td style="width: 48.9665%; height: 19px; border-style: hidden; text-align: right;"><strong>Currency: </strong>VND</td>
// </tr>
// </tbody>
// </table>
// <p>&nbsp;</p>
// <table style="border-collapse: collapse; width: 100%; height: 76px;" border="1">
// <tbody>
// <tr style="height: 19px;">
// <td style="width: 21.3619%; height: 19px; background-color: #ecf0f1; text-align: center;"><strong>Description</strong></td>
// <td style="width: 7.24254%; height: 19px; background-color: #ecf0f1; text-align: center;"><strong>Unit</strong></td>
// <td style="width: 2.1479%; height: 19px; background-color: #ecf0f1; text-align: center;"><strong>Quantity</strong></td>
// <td style="width: 25.947%; height: 19px; background-color: #ecf0f1; text-align: center;"><strong>Unit price</strong></td>
// <td style="width: 7.82481%; height: 19px; background-color: #ecf0f1; text-align: center;"><strong>Discount</strong></td>
// <td style="width: 7.60644%; height: 19px; background-color: #ecf0f1; text-align: center;"><strong>Tax</strong></td>
// <td style="width: 20.8534%; height: 19px; background-color: #ecf0f1; text-align: center;"><strong>Amount</strong></td>
// </tr>
// <tr style="height: 19px;">
// <td style="width: 21.3619%; height: 19px;">Dầu gội đầu th&aacute;i dương 450ml</td>
// <td style="width: 7.24254%; height: 19px; text-align: center;">chai</td>
// <td style="width: 2.1479%; height: 19px; text-align: center;">2</td>
// <td style="width: 25.947%; height: 19px; text-align: center;">120,000 VND</td>
// <td style="width: 7.82481%; height: 19px; text-align: center;">0%</td>
// <td style="width: 7.60644%; height: 19px; text-align: center;">8%</td>
// <td style="width: 20.8534%; height: 19px; text-align: center;">240,000 VND</td>
// </tr>
// <tr style="height: 19px;">
// <td style="width: 21.3619%; height: 19px;">Dầy x&atilde; dịu m&aacute;t VN No1 250ml</td>
// <td style="width: 7.24254%; height: 19px; text-align: center;">chai</td>
// <td style="width: 2.1479%; height: 19px; text-align: center;">2</td>
// <td style="width: 25.947%; height: 19px; text-align: center;">95,000 VND</td>
// <td style="width: 7.82481%; height: 19px; text-align: center;">0%</td>
// <td style="width: 7.60644%; height: 19px; text-align: center;">8%</td>
// <td style="width: 20.8534%; height: 19px; text-align: center;">190,000 VND</td>
// </tr>
// <tr style="height: 19px;">
// <td></td>
// <td style="width: 7.24254%; height: 19px; text-align: center;">chai</td>
// <td style="width: 2.1479%; height: 19px; text-align: center;">1</td>
// <td style="width: 25.947%; height: 19px; text-align: center;">250,000 VND</td>
// <td style="width: 7.82481%; height: 19px; text-align: center;">5%</td>
// <td style="width: 7.60644%; height: 19px; text-align: center;">10%</td>
// <td style="width: 20.8534%; height: 19px; text-align: center;">250,000 VND</td>
// </tr>
// </tbody>
// </table>
// <p>&nbsp;</p>
// <table style="border-collapse: collapse; width: 40%; float: right; height: 76px;" border="1">
// <tbody>
// <tr style="height: 19px;">
// <td style="width: 32.3144%; height: 19px; background-color: #ecf0f1;"><strong>Total discount</strong></td>
// <td style="width: 32.3144%; height: 19px; text-align: center;">1.87%</td>
// <td style="width: 32.3144%; height: 19px; text-align: center;">12,500 VND</td>
// </tr>
// <tr style="height: 19px;">
// <td style="width: 32.3144%; height: 19px; background-color: #ecf0f1;"><strong>Pretax subtotal</strong></td>
// <td style="width: 32.3144%; height: 19px; text-align: center;">&nbsp;</td>
// <td style="width: 32.3144%; height: 19px; text-align: center;">667,500 VND</td>
// </tr>
// <tr style="height: 19px;">
// <td style="width: 32.3144%; height: 19px; background-color: #ecf0f1;"><strong>Tax</strong></td>
// <td style="width: 32.3144%; height: 19px; text-align: center;">&nbsp;</td>
// <td style="width: 32.3144%; height: 19px; text-align: center;">58,150 VND</td>
// </tr>
// <tr style="height: 19px;">
// <td style="width: 32.3144%; height: 19px; background-color: #ecf0f1;"><strong>Total</strong></td>
// <td style="width: 32.3144%; height: 19px; text-align: center;">&nbsp;</td>
// <td style="width: 32.3144%; height: 19px; text-align: center;">725,650 VND</td>
// </tr>
// </tbody>
// </table>
// <p>&nbsp;</p>
// <p>&nbsp;</p>
// <p>&nbsp;</p>
// <p>&nbsp;</p>
// <p>&nbsp;</p>
// <hr />
// <p>Note</p>
// <ol>
// <li>Delivery: Trong v&ograve;ng 10 ng&agrave;y kể từ ng&agrave;y đặt h&agrave;ng</li>
// <li>Warranty: Bảo h&agrave;nh 12 th&aacute;ng kể từ ng&agrave;y b&agrave;n giao h&agrave;ng h&oacute;a&nbsp;</li>
// </ol>
// <p>Payment:</p>
// <ol>
// <li>Credit term: thanh to&aacute;n 100% trước khi giao h&agrave;ng</li>
// <li>Bank account:</li>
// </ol>
// <ul>
// <li>C&ocirc;ng ty cổ phần FPT</li>
// <li>A/C no: 1235378290940</li>
// <li>Vietcombank - HCM Branch</li>
// </ul>
// <p>&nbsp;</p>
// <p>&nbsp;</p>
// <table style="border-collapse: collapse; width: 100%; height: 76px; border-style: hidden;" border="1">
// <tbody>
// <tr style="height: 19px;">
// <td style="width: 48.9665%; height: 19px; border-style: hidden;"><strong>Sale Account Contact</strong></td>
// <td style="width: 48.9665%; height: 19px; border-style: hidden; text-align: right;"><strong>Customer Confirm</strong></td>
// </tr>
// <tr style="height: 19px;">
// <td style="width: 48.9665%; height: 19px;">Name: Nguyễn Thị Ngọc Quy&ecirc;n</td>
// <td style="width: 48.9665%; height: 19px; border-style: hidden;">&nbsp;</td>
// </tr>
// <tr style="height: 19px;">
// <td style="width: 48.9665%; height: 19px; border-style: hidden;">Email: ntnquyen</td>
// <td style="width: 48.9665%; height: 19px;">&nbsp;</td>
// </tr>
// <tr style="height: 19px;">
// <td style="width: 48.9665%; height: 19px;">Phone no: 0905376289</td>
// <td style="width: 48.9665%; height: 19px; border-style: hidden;">&nbsp;</td>
// </tr>
// </tbody>
// </table>`;
// }
//
// function loadTinymce(data) {
//     tinymce.init({
//         selector: 'textarea#quotation-tinymce',
//         // Callback function that runs after TinyMCE is initialized
//         setup: function (editor) {
//             // Set the initial HTML content
//             editor.setContent(loadTemplatePrint(data));
//         },
//         plugins: 'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
//         imagetools_cors_hosts: ['picsum.photos'],
//         menubar: 'file edit view insert format tools table help',
//         toolbar: 'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
//         toolbar_sticky: true,
//         autosave_ask_before_unload: true,
//         autosave_interval: '30s',
//         autosave_prefix: '{path}{query}-{id}-',
//         autosave_restore_when_empty: false,
//         autosave_retention: '2m',
//         image_advtab: true,
//         importcss_append: true,
//         template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
//         template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
//         height: 400,
//         image_caption: true,
//         quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
//         noneditable_noneditable_class: 'mceNonEditable',
//         toolbar_mode: 'sliding',
//         contextmenu: 'link image imagetools table',
//         content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
//     });
// }
//
//
// $(function () {
//
//     $(document).ready(function () {
//         let $form = $('#frm_quotation_create');
//         let eleDataDetail = $('#quotation-detail-data');
//
//         // call ajax get info quotation detail
//         $.fn.callAjax2({
//             url: $form.data('url'),
//             method: 'GET',
//             isLoading: true,
//         }).then(
//             (resp) => {
//                 let data = $.fn.switcherResp(resp);
//                 if (data) {
//                     eleDataDetail.val(JSON.stringify(data));
// 					loadTinymce(data);
//                 }
//             }
//         )
//         // mask money
//         $.fn.initMaskMoney2();
//
//
//     });
// });
