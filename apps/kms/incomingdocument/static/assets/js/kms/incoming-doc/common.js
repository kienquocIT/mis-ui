// Declare elements in Page
class IncomingDocElements {
    constructor() {
        this.$titleEle = $('#txt_create_title')
        this.$descriptionEle = $('#textarea_remark')

        // attached document
        this.$senderEle = $('#sender')
        this.$docTypeEle = $('#select-box-doc_type')
        this.$contentGroupEle = $('#select-box-content_group')
        this.$effectiveDateEle = $('#kms_effective_date')
        this.$expiredDateEle = $('#kms_expired_date')
        this.$securityLevelEle = $('#kms_security_level')
        this.$folderEle = $('#kms_folder')

        // internal recipient
        this.$tableInternalRecipient = $('#table_internal_recipient')
    }
}
const pageElements = new IncomingDocElements();

// Load data
class IncomingDocLoadDataHandle {
    static initPage() {
        // init selection
        FormElementControl.loadInitS2(pageElements.$docTypeEle);
        FormElementControl.loadInitS2(pageElements.$contentGroupEle);
        FormElementControl.loadInitS2(pageElements.$folderEle);

        // init date
        $('.date-picker').each(function () {
            DateTimeControl.initDatePicker(this);
        });
    }

    static initInternalRecipientTable(data) {
        const $tbl = pageElements.$tableInternalRecipient;
        if ($tbl.hasClass('dataTable')) {
            $tbl.DataTable().clear().rows.add(data).draw();
            return;
        }
        $tbl.DataTableDefault({
            data: data,
            paging: false,
            info: false,
            searching: false,
            columns: [
                {
                    data: 'id',
                    render: (row, index, data) => {
                        if (!$x.fn.checkUUID4(row)) data.id = $x.cls.util.generateUUID4();
                        const key = data?.kind === 1 ? 'employee_access' : 'group_access';
                        const data_loop = data[key] || [];
                        return Object.values(data_loop).map(val => {
                            const name = data.kind === 1 ? val.full_name : val?.title;
                            return `<div class="chip recipient-chip chip-outline-primary pill chip-pill mr-2">
                                        <span class="chip-text">${name}</span>
                                    </div>`;
                        }).join('');
                    }
                },
                {
                    data: 'title',
                    render: (row) => row
                },
                {
                    data: 'id',
                    render: (row) => {
                        return `<div class="actions-btn text-center">
                            <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover edit-button"
                               title="Edit" href="#" data-id="${row}" data-action="edit">
                               <span class="btn-icon-wrap"><i class="fa-solid fa-pen"></i></span></a>
                            <a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover delete-btn"
                               title="Delete" href="#" data-id="${row}" data-action="delete">
                               <span class="btn-icon-wrap"><i class="fa-regular fa-trash-can"></i></span></a>
                        </div>`;
                    }
                }
            ],
            rowCallback: function (row, data, index) {
                $('.actions-btn a.delete-btn', row).off().on('click', function (e) {
                    e.stopPropagation();
                    $tbl.DataTable().row(row).remove().draw(false);
                });
                $('.actions-btn a.edit-button', row).off().on('click', function (e) {
                    e.stopPropagation();
                    $('#modal-recipient').trigger('modal.Recipient.edit', [{row_index: index}]);
                });
            }
        });
    }


    static buildAttachedList() {
        let parsedEffectiveDate = moment(pageElements.$effectiveDateEle.val(), "DD/MM/YYYY", true);
        let parsedExpiredDate = moment(pageElements.$expiredDateEle.val(), "DD/MM/YYYY", true);

        return [{
            sender: pageElements.$senderEle.val(),
            document_type: pageElements.$docTypeEle.val(),
            content_group: pageElements.$contentGroupEle.val(),
            effective_date: parsedEffectiveDate.isValid() ? parsedEffectiveDate.format('YYYY-MM-DD') : null,
            expired_date: parsedExpiredDate.isValid() ? parsedExpiredDate.format('YYYY-MM-DD') : null,
            security_level: pageElements.$securityLevelEle.val(),
        }]
    }


    static combineData(formEle) {
        let frm = new SetupFormSubmit($(formEle));
        frm.dataForm['title'] = pageElements.$titleEle.val();
        frm.dataForm['remark'] = pageElements.$descriptionEle.val() ||'';
        frm.dataForm['attached_list'] = IncomingDocLoadDataHandle.buildAttachedList();
        frm.dataForm['internal_recipient'] = pageElements.$tableInternalRecipient.DataTable().data().toArray();
        if (frm.dataForm.hasOwnProperty('attachment')) {
          frm.dataForm['attachment'] = $x.cls.file.get_val(frm.dataForm?.['attachment'], []);
        }
        return frm;
    }
}

// Load Editor
class loadEditor {
    init() {
        const $textArea = $('#textarea_remark');
        $textArea.tinymce({
            height: 500,
            menubar: false,
            plugins: ['columns', 'print', 'preview', 'paste', 'importcss', 'searchreplace', 'autolink', 'autosave',
                'save', 'directionality', 'code', 'visualblocks', 'visualchars', 'fullscreen', 'image', 'link', 'media',
                'codesample', 'table', 'charmap', 'hr', 'pagebreak', 'nonbreaking', 'anchor', 'toc',
                'insertdatetime', 'advlist', 'lists', 'wordcount', 'imagetools', 'textpattern', 'noneditable',
                'help', 'charmap', 'quickbars', 'emoticons'],
            toolbar: 'bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist table twoColumn threeColumn | preview pagebreak removeformat print visualblocks',  // | rarely_used
            quickbars_insert_toolbar: 'link image | numlist bullist table twoColumn threeColumn | hr pagebreak',
            toolbar_groups: {
                rarely_used: {
                    icon: 'more-drawer',
                    tooltip: 'Rarely Used',
                    items: 'ltr rtl | charmap emoticons | superscript subscript | nonbreaking anchor media | undo redo | '
                }
            },
            font_formats: 'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Cambria=cambria,serif; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
            pagebreak_split_block: true,
            pagebreak_separator: '<span class="page-break-here"><!-- my page break --></span>',
            nonbreaking_force_tab: true,
            insertdatetime_formats: ['%d-%m-%Y %H:%M:%S', '%d-%m-%Y', '%H:%M:%S', '%I:%M:%S %p'],
            content_css: $textArea.attr('data-css-url-render'),
            content_style: `
                body { font-family: Cambria,sans-serif; font-size: 12pt; }
                @import url('/static/assets/fonts/cambria/Cambria.ttf');
                @media print {
                    .mce-visual-caret {
                        display: none;
                    }
                }
            `
        });
    }
}
