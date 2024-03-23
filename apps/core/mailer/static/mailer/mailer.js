class MailerTinymceControl {
    constructor(opts) {

    }

    static init_tinymce_editable(textarea$, content = '', mentions_opts = {}, opts = {}) {
        mentions_opts = {
            'application_id': null,
            'system_code': null,
            'url': null,
            ...mentions_opts
        }
        textarea$.val(content);
        textarea$.tinymce(
            $x.opts.tinymce_extends({
                // width: '640',
                plugins: [
                    mentions_opts.url ? 'mention' : '',
                    ' image template link hr lists table preview visualblocks'
                ],
                toolbar: 'fontselect fontsizeselect formatselect | bold italic underline strikethrough | forecolor backcolor removeformat | image template link hr | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist table | preview visualblocks | undo redo',
                quickbars_insert_toolbar: 'link image | numlist bullist table twoColumn threeColumn | hr pagebreak | removeSelectionEle',
                content_style: `
                    body {
                        min-width: 320px;
                        max-width: 640px;
                    }
                `,
                mentions: {
                    items: 10,
                    queryBy: 'code',
                    delimiter: '#',
                    source: function (query, process, delimiter) {
                        if (delimiter === '#') {
                            let url = $x.opts.tinymce.mentions__get_url(mentions_opts.url, {
                                'page': 1,
                                'pageSize': 10,
                                'ordering': 'title',
                                'is_mail': true,
                                'application__in': `${
                                    mentions_opts.application_id ? mentions_opts.application_id + ',' : ''
                                }ba2ef9f1-63f4-4cfb-ae2f-9dee6a56da68`,
                                ...(mentions_opts.system_code ? {'system_code__is_null_or_value': mentions_opts.system_code} : {}),
                            }, query)
                            $.fn.callAjax2({url: url, method: 'GET', cache: true}).then(
                                (resp) => {
                                    let data = $.fn.switcherResp(resp);
                                    if (data) {
                                        let resource = (
                                            data?.['application_property_list'] || []
                                        ).map(
                                            item => UtilControl.flattenObject(item),
                                        )
                                        process(resource);
                                    }
                                },
                                (errs) => $.fn.switcherResp(errs),
                            )
                        }
                    },
                },
                ...opts,
            })
        )
    }
}