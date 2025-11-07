$(document).ready(function () {
    const $dimensionValueDataTable = $('#datatable-value')
    const $dimensionSelect = $('#dimension-select')

    let currData = null

    function getDescendantIds(nodeId) {
        const node = currData.find(n => n.id === nodeId);
        if (!node || !node.children_ids || node.children_ids.length === 0) return [];
        let descendants = [...node.children_ids];
        node.children_ids.forEach(cid => {
            descendants = descendants.concat(getDescendantIds(cid));
        });
        return descendants;
    }

    function showDescendants(nodeId) {
        const node = currData.find(n => n.id === nodeId);
        if (!node || !node.children_ids) return;
        node.children_ids.forEach(cid => {
            $(`#${cid}`).removeClass('hidden-row');
            const childNode = currData.find(n => n.id === cid);
            // set toggle DOM to expanded if node.isExpanded is true
            if (childNode && childNode.has_children) {
                const $toggle = $(`#${cid}`).find('.tree-toggle');
                if (childNode.isExpanded) {
                    $toggle.removeClass('collapsed');
                    $toggle.find('i').removeClass('fa-chevron-right').addClass('fa-chevron-down');
                    // continue recursively
                    showDescendants(cid);
                } else {
                    // ensure child toggle shows collapsed state
                    $toggle.addClass('collapsed');
                    $toggle.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-right');
                }
            }
        });
    }

    function collapseDescendants(nodeId) {
        const ids = getDescendantIds(nodeId);
        ids.forEach(id => {
            const dn = currData.find(n => n.id === id);
            if (dn) dn.isExpanded = false;
            $(`#${id}`).addClass('hidden-row');
            const $childToggle = $(`#${id}`).find('.tree-toggle');
            $childToggle.addClass('collapsed');
            $childToggle.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-right');
        });
    }

    //sort data from api
    function sortByHierarchy(data) {
        if (!Array.isArray(data)) return [];

        // Map all items by id
        const map = new Map();
        data.forEach(item => map.set(item.id, { ...item }));

        // Find roots (no parent_id)
        const roots = data.filter(item => !item.parent_id);

        // Recursive traversal following children_ids order
        const result = [];
        function traverse(node) {
            if (!node) return;
            result.push(node);
            if (Array.isArray(node.children_ids) && node.children_ids.length > 0) {
                node.children_ids.forEach(childId => {
                    const child = map.get(childId);
                    if (child) traverse(child);
                });
            }
        }

        // Start traversal from each root
        roots.forEach(root => traverse(root));

        return result;
    }

    function buildParentSelector($container, data, selectedParentId = null) {
        $container.empty();

        // Root option
        $container.append(`
            <div class="parent-option ${selectedParentId === null ? 'selected' : ''}" data-id="root">
                <strong>(Root Level - No Parent)</strong>
            </div>
        `);

        data.forEach(node => {
            const paddingLeft = 12 + (node.level * 20);
            const isSelected = selectedParentId === node.id ? 'selected' : '';
            const optionHTML = `
                <div class="parent-option ${isSelected}" data-id="${node.id}"
                     style="padding-left: ${paddingLeft}px;">
                    ${node.title} <span class="text-muted">(${node.code})</span>
                </div>
            `;
            $container.append(optionHTML);
        });
    }

    // Initialize DataTable
    $dimensionValueDataTable.DataTableDefault({
        data: currData,
        rowId: 'id',
        columns: [
            {
                data: 'title',
                render: function (data, type, row) {
                    const paddingLeft = 12 + (row.level * 30);
                    let html = `<div class="d-flex align-center" style="padding-left: ${paddingLeft}px;">`;
                    console.log(row.isExpanded)
                    if (row.has_children) {
                        const iconClass = row.isExpanded ? 'fa-chevron-down' : 'fa-chevron-right';
                        html += `
                            <span class="tree-toggle ${!row.isExpanded ? 'collapsed' : ''}"
                                  data-node-id="${row.id}">
                                <i class="fas ${iconClass}"></i>
                            </span>`;
                    } else {
                        html += '<span style="display: inline-block; width: 20px"></span>';
                    }

                    html += `<span class="${row.has_children ? 'node-parent' : 'node-child'}">${data}</span>`;
                    html += `<span class="ml-2">(level ${row.level})</span>`
                    html += `</div>`;
                    return html;
                }
            },
            {
                data: 'code',
                render: (data, type) => `<span class="text-primary">${data}</span>`
            },
            {
                data: 'allow_posting',
                className: 'text-center',
                render: (data, type) => {
                    return data
                        ? '<span class="badge bg-success">Yes</span>'
                        : '<span class="badge bg-secondary">No</span>';
                }
            },
            {
                className: 'text-center',
                render: function (data, type, row) {
                    let edit_btn = `<a class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover btn-edit"
                           data-id="${row?.['id']}"
                           data-code="${row?.['code']}"
                           data-title="${row?.['title']}"
                           data-bs-toggle="modal"
                           data-bs-target="#modal-update-value"
                           data-bs-placement="top" title=""
                           >
                           <span class="btn-icon-wrap"><span class="feather-icon text-primary"><i data-feather="edit"></i></span></span>
                        </a>`
                    let delete_btn = `<a class="btn btn-icon btn-flush-danger btn-rounded flush-soft-hover btn-delete"
                                data-id="${row?.['id']}">
                            <span class="btn-icon-wrap">
                                <span class="feather-icon text-danger">
                                    <i class="bi bi-trash"></i>
                                </span>
                            </span>
                        </a>`
                    return `${edit_btn}${delete_btn}`
                }
            }
        ],
    });

    // select dimension
    $dimensionSelect.on('change', (e) => {
        const dimensionId = $(e.currentTarget).val()
        let url = `/accounting-settings/dimension-definition-values/api/${dimensionId}`
        $.fn.callAjax2({
            url: url,
            method: 'GET',
        }).then(
            (resp) => {
                currData = sortByHierarchy(resp.data?.['dimension_definition_with_values']?.['values'] || [])
                currData = currData.map((item)=>{
                    return {
                        isExpanded: true,
                        ...item
                    }
                })
                const table = $dimensionValueDataTable.DataTable();

                table.clear().rows.add(currData).draw();

                buildParentSelector($('#parent-selector'), currData);
            }
        )
    })

    // expand or collapse row
    $dimensionValueDataTable.on('click', '.tree-toggle', function (e) {
        e.stopPropagation();
        const $toggle = $(this);
        const nodeId = $toggle.data('node-id');
        const $icon = $toggle.find('i');

        const node = currData.find(n => n.id === nodeId);
        if (!node) return;

        if (node.isExpanded) {
            // collapse node and all its descendants
            node.isExpanded = false;
            $toggle.addClass('collapsed');
            $icon.removeClass('fa-chevron-down').addClass('fa-chevron-right');

            collapseDescendants(nodeId);
        } else {
            // expand node
            node.isExpanded = true;
            $toggle.removeClass('collapsed');
            $icon.removeClass('fa-chevron-right').addClass('fa-chevron-down');

            // show direct children
            if (node.children_ids && node.children_ids.length) {
                node.children_ids.forEach(cid => {
                    $(`#${cid}`).removeClass('hidden-row');
                });

                // For each child that is expanded, reveal its descendants recursively
                node.children_ids.forEach(cid => {
                    const childNode = currData.find(n => n.id === cid);
                    if (childNode && childNode.isExpanded) {
                        showDescendants(cid);
                    } else {
                        // ensure collapsed children show correct toggle state
                        const $ct = $(`#${cid}`).find('.tree-toggle');
                        $ct.addClass('collapsed');
                        $ct.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-right');
                    }
                });
            }
        }
    });

    // expand all row
    $('#expandAll').click(function () {
        currData.forEach(n => {
            n.isExpanded = true;
            if (n.has_children) {
                const $toggle = $(`[data-node-id="${n.id}"]`);
                $toggle.removeClass('collapsed');
                $toggle.find('i').removeClass('fa-chevron-right').addClass('fa-chevron-down');
            }
            $(`#${n.id}`).removeClass('hidden-row');
        });
    });

    // collapse all row
    $('#collapseAll').click(function () {
        currData.forEach(n => {
            n.isExpanded = false;
            if (n.has_children) {
                const $toggle = $(`[data-node-id="${n.id}"]`);
                $toggle.addClass('collapsed');
                $toggle.find('i').removeClass('fa-chevron-down').addClass('fa-chevron-right');
            }
            if (n.level > 0) {
                $(`#${n.id}`).addClass('hidden-row');
            }
        });
    });

    // choose parent in form
    $('#modal-add-value, #modal-update-value').on('click', '.parent-option', function () {
        const $option = $(this);
        const $container = $option.closest('.parent-selector-tree');

        $container.find('.parent-option').removeClass('selected');
        $option.addClass('selected');

        // Store parent id in its associated form
        const parentId = $option.data('id') === 'root' ? null : $option.data('id');
        const $form = $container.closest('form');
        $form.data('selected-parent', parentId);
    });

    // when click edit dimension value
    $dimensionValueDataTable.on('click', '.btn-edit', function (e) {
        const $btn = $(this);
        const rowId = $btn.data('id');

        const rowData = currData.find(item => item.id === rowId);
        if (!rowData) return;

        const $modal = $('#modal-update-value');

        $modal.find('#value-code').val(rowData.code || '');
        $modal.find('#value-name').val(rowData.title || '');
        $modal.find('#allow-posting').prop('checked', !!rowData.allow_posting);

        const parentId = rowData.parent_id || null;

        buildParentSelector($('#parent-selector-update'), currData, parentId);

        const $form = $('#form-update-value');
        $form.data('dim-value-id', rowId);
    });

    //submit form
    new SetupFormSubmit($('#form-add-value')).validate({
            rules: {
                code: {
                    required: true,
                },
                title: {
                    required: true,
                }
            },
            submitHandler: function (form) {
                let frm = new SetupFormSubmit($(form))
                const parentId = $('#form-add-value').data('selected-parent') || null;
                frm.dataForm['parent_id'] = parentId;
                frm.dataForm['dimension_id'] = $dimensionSelect.val()
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

                            const currentDimensionId = $dimensionSelect.val();
                            if (currentDimensionId) {
                                $dimensionSelect.trigger('change');
                            }

                        }
                    },
                    (errs) => {
                        $.fn.notifyB({description: errs.data.errors}, 'failure');
                    }
                )
            }
        })
    new SetupFormSubmit($('#form-update-value')).validate({
        rules: {
            code: { required: true },
            title: { required: true }
        },
        submitHandler: function (form) {
            const frm = new SetupFormSubmit($(form));
            const dimValueId = $(form).data('dim-value-id');
            const parentId = $('#form-update-value').data('selected-parent') || null;
            frm.dataForm['parent_id'] = parentId;
            frm.dataForm['dimension_id'] = $dimensionSelect.val()

            $.fn.callAjax2({
                url: frm.dataUrl.replace('0', dimValueId),
                method: frm.dataMethod,
                data: frm.dataForm
            }).then(
                (resp) => {
                    $.fn.notifyB({ description: "Updated successfully" }, 'success');
                    const $modal = $(form).closest('.modal');
                    if ($modal.length) {
                        $modal.modal('hide');
                    }
                    $('#dimension-select').trigger('change');
                },
                (errs) => {
                    $.fn.notifyB({ description: errs.data.errors }, 'failure');
                }
            );
        }
    });
});