$(document).ready(function () {
    const $modalProduct = $('#modal-product');
    const $assignItemBtn = $('#assign-item-btn')
    const $tableProduct = $('#modal-table-product')
    const $saveProductBtn = $('#btn-save-product')
    const $linkedItemTable = $('#table-linked-item')

    const $formAdd = $('#form-add')

    let tempSelectedProducts = []
    let linkedItemData = []

    let assetCategoryCache = [];     // full list
    let assetCategoryMap = {};       // id → item
    let childrenMap = {};

    UsualLoadPageAccountingFunction.LoadAccountingAccount({
        element: $('.gl-acc-select'),
        data_params: {
            "is_account": true,
        }
    })

    let assetCateDtb = $('#asset-category-table').DataTableDefault({
        data: [],
        columns: [
            {
                targets: 0,
                data: 'title',
                className: 'w-20',
                render: (data, type, row) => {
                    const indent = row.level * 20;
                    let toggle = "";
                    if (childrenMap[row.id]) {
                        const icon = row.isExpanded ? "fa-chevron-down" : "fa-chevron-right";
                        toggle = `
                        <span class="tree-toggle ${row.isExpanded ? "" : "collapsed"}"
                              data-node-id="${row.id}">
                            <i class="fas ${icon}"></i>
                        </span>`;
                    }

                    return `
                    <div style="padding-left:${indent}px;">
                        ${toggle}
                        <span>${row.title}</span>
                    </div>`;
                }
            },
            {
                targets: 0,
                className: 'w-30',
                render: (data, type, row) => {
                    return `<span>${row?.['title'] || ''}</span>`
                }
            },
            {
                targets: 0,
                className: 'w-15',
                render: (data, type, row) => {
                    return `<span>${row?.['category_type_display'] || '--'}</span>`
                }
            },
            {
                targets: 0,
                className: 'w-20',
                render: (data, type, row) => {
                    return `<span>${row?.['depreciation_method_display'] || '--'}</span>`
                }
            },
            {
                targets: 0,
                className: 'w-10',
                render: (data, type, row) => {
                    return `<span>${row?.['depreciation_time'] || '--'} (Months)</span>`
                }
            },
            {
                targets: 0,
                className: 'w-5',
                render: (data, type, row) => {
                    return `<button type="button" class="btn btn-outline-primary btn-edit"
                                    data-id="${row.id}"
                                    title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>`
                }
            },
        ]
    })

    let linkedItemDtb = $linkedItemTable.DataTableDefault({
        data: linkedItemData,
        rowIdx: true,
        columns: [
            {
                targets: 0,
                render: (data, type, row) => {
                    return ``
                }
            },
            {
                targets: 1,
                render: (data, type, row) => {
                    return `<span>${row?.['code'] || ''}</span>`
                }
            },
            {
                targets: 2,
                render: (data, type, row) => {
                    return `<span>${row?.['title'] || ''}</span>`
                }
            },
            {
                targets: 3,
                className: 'text-center',
                render: (data, type, row) => {
                    return `<button class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                            data-product-id="${row?.['product_id']}">
                                <span class="btn-icon-wrap">
                                    <span class="feather-icon text-danger">
                                        <i class="bi bi-trash"></i>
                                    </span>
                                </span>
                    </button>`
                }
            },
        ]
    })

    $tableProduct.DataTableDefault({
        rowIdx: true,
        useDataServer: true,
        reloadCurrency: true,
        scrollCollapse: true,
        scrollY: '50vh',
        scrollX: true,
        ajax: {
            url: $tableProduct.attr('data-url'),
            type: 'GET',
            dataSrc: function (resp) {
                let data = $.fn.switcherResp(resp);
                if (data) {
                    return resp.data['product_list'] ? resp.data['product_list'] : [];
                }
                return [];
            },
        },
        columns: [
            {
                render: (data, type, row) => {
                    return ``
                }
            },
            {
                render: (data, type, row) => {
                    return `<div class="form-check">
                                <input type="checkbox" class="form-check-input" id="select-product-${row?.['id']}" name="select-product" data-product-id="${row?.['id'] || ''}"/>
                            </div>`
                }
            },
            {
                render: (data, type, row) => {
                    return `<label class="form-check-label mr-2" for="select-product-${row?.['id']}">
                                <span class="badge badge-sm badge-soft-secondary mr-1">${row?.['code'] || ''}</span>
                                <span>${row?.['title'] || ''}</span>
                            </label>`
                }
            },
            {
                render: (data, type, row) => {
                    return `<span>${row?.['description'] || ''}</span>`
                }
            },
            {
                render: (data, type, row) => {
                    const assetCategory = row?.['asset_category']?.title || '(None)'
                    return `<span>${assetCategory}</span>`
                }
            },
        ],
    })

    function loadAssetCategoryData() {
        return $.ajax({
            url: $('#asset-category-table').attr('data-url'),
            type: "GET",
        }).then(resp => {
            assetCategoryCache = resp.data.asset_category_list || [];

            // Build quick lookup maps
            assetCategoryMap = {};
            childrenMap = {};

            assetCategoryCache.forEach(item => {
                assetCategoryMap[item.id] = item;

                if (!childrenMap[item.parent_id]) {
                    childrenMap[item.parent_id] = [];
                }
                childrenMap[item.parent_id].push(item);
            });
        });
    }

    function renderRootRows() {
        const roots = childrenMap[null] || childrenMap[0] || [];
        roots.forEach(item => {
            item.level = 0;
            item.isExpanded = false;
        });

        assetCateDtb.clear();
        assetCateDtb.rows.add(roots);
        assetCateDtb.draw();
    }

    function expandNode(parentId, parentRowIndex) {
        const children = childrenMap[parentId] || [];
        if (!children.length) return;

        children.forEach((child, index) => {
            child.level = (assetCategoryMap[parentId].level || 0) + 1;
            child.isExpanded = false;
            UsualLoadPageFunction.AddTableRowAtIndex($('#asset-category-table'), child, parentRowIndex + 1 + index)
        })
    }

    function collapseNode(parentId) {
        const rowsToRemove = [];

        assetCateDtb.rows().every(function () {
            const row = this.data();
            if (row.parent_id === parentId) {
                rowsToRemove.push(this.index());
                collapseNode(row.id);
            }
        });

        rowsToRemove.sort((a, b) => b - a).forEach(i => {
            assetCateDtb.row(i).remove();
        });

        assetCateDtb.draw(false);
    }

    function handleCheckAndSaveProduct() {
        $tableProduct.on('change', 'input[name="select-product"]', function () {
            const $checkbox = $(this);
            const productId = $checkbox.data('product-id');
            const rowData = $tableProduct.DataTable().row($checkbox.closest('tr')).data();

            if ($checkbox.is(':checked')) {
                if (!tempSelectedProducts.some(p => p.product_id === productId)) {
                    tempSelectedProducts.push({
                        product_id: rowData.id,
                        title: rowData.title,
                        code: rowData.code,
                    });
                }
            } else {
                tempSelectedProducts = tempSelectedProducts.filter(p => p.product_id !== productId)
            }
        })

        $tableProduct.on('draw.dt', function () {
            $tableProduct.find('input[name="select-product"]').each(function () {
                const $checkbox = $(this)
                const productId = $checkbox.data('product-id')

                if (tempSelectedProducts.some(p => p.product_id === productId)) {
                    $checkbox.prop('checked', true);
                }
            })
        })

        $saveProductBtn.on('click', function () {
            const checkedProducts = [...tempSelectedProducts]
            const currentData = linkedItemDtb.data().toArray()
            const newData = [...currentData, ...checkedProducts]
            linkedItemDtb.clear().rows.add(newData).draw(false)
            $tableProduct.find('input[name="select-product"]').prop('checked', false)
            tempSelectedProducts = []
        })

        $('#modal-product').on('hidden.bs.modal', function () {
            tempSelectedProducts = [];
        });
    }

    $assignItemBtn.on('click', function () {
        $modalProduct.modal('show')
    })

    $linkedItemTable.on('click', '.btn-delete', function (e) {
        const $btn = $(this);
        const productId = $btn.data('product-id');
        const $row = $btn.closest('tr');

        linkedItemDtb.row($row).remove().draw(false)

        $tableProduct.find(`input[data-product-id="${productId}"]`).prop('checked', false)
    })

    $('#asset-category-table').on('click', '.tree-toggle', function () {
        const nodeId = $(this).data('node-id');
        const rowIndex = assetCateDtb.row($(this).closest('tr')).index();
        const rowData = assetCateDtb.row(rowIndex).data();

        if (rowData.isExpanded) {
            collapseNode(nodeId);
            rowData.isExpanded = false;
        } else {
            expandNode(nodeId, rowIndex);
            rowData.isExpanded = true;
        }

        assetCateDtb.row(rowIndex).data(rowData).draw(false);
    });

    function setUpFormData(frm) {
        frm.dataForm['linked_product_data'] = linkedItemDtb.data().toArray().map(item => item.product_id)
    }

    new SetupFormSubmit($formAdd).validate({
        submitHandler: function (form) {
            let frm = new SetupFormSubmit($(form))
            setUpFormData(frm)

            $.fn.callAjax2({
                'url': frm.dataUrl,
                'method': frm.dataMethod,
                'data': frm.dataForm,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        $.fn.notifyB({description: "Successfully"}, 'success')
                        $(form)[0].reset();
                        const $modal = $(form).closest('.modal');
                        if ($modal.length) {
                            $modal.modal('hide');
                        }
                        $('.gl-acc-select').val('').trigger('change');
                        UsualLoadPageAccountingFunction.LoadAccountingAccount({
                            element: $('.gl-acc-select'),
                            data_params: {
                                "is_account": true,
                            }
                        })
                        linkedItemDtb.clear().draw(false)
                    }

                    loadAssetCategoryData().then(() => {
                        renderRootRows()
                    })
                },
                (errs) => {
                    $.fn.notifyB({description: errs.data.errors}, 'failure');
                }
            )
        }
    })

    // call functions
    handleCheckAndSaveProduct()
    loadAssetCategoryData().then(() => {
        renderRootRows()
    })
    $('#asset-category-table').on('click', '.btn-edit', function(e) {
        const categoryId = $(this).data('id')
        const $modal = $('#modal-add-asset-category')
        const $form = $('#form-add')
        const $modalTitle = $('#modalTitle')
        $.fn.callAjax2({
            url: $form.data('detail-url').format_url_with_uuid(categoryId), // Adjust URL pattern as needed
            type: 'GET',
        }).then(
            (resp) => {
                const data = resp.data['asset_category_detail']
                // Update modal title
                $modalTitle.text('Edit Asset Category')

                // Populate basic information
                $('#category-code').val(data.code || '')
                $('#category-name').val(data.title || '')
                $('#category-type').val(data.category_type).trigger('change')
                $('#description').text(data.remark || '')

                $('#parent-category').initSelect2({
                    data: data.parent,
                })

                $('#depreciation-method').val(data.depreciation_method).trigger('change')
                $('#depreciation-time').val(data.depreciation_time || '')

                $('.gl-acc-select').val('').trigger('change')
                UsualLoadPageAccountingFunction.LoadAccountingAccount({element: $('#asset-account'), data: data.asset_account})
                UsualLoadPageAccountingFunction.LoadAccountingAccount({element: $('#accum-dep-account'), data: data.accumulated_depreciation_account})
                UsualLoadPageAccountingFunction.LoadAccountingAccount({element: $('#dep-expense-account'), data: data.depreciation_expense_account})
                linkedItemDtb.clear()
                linkedItemDtb.rows.add(data.linked_product_data || [])
                linkedItemDtb.draw(false)
                $modal.modal('show')
            }
        )
    })


})