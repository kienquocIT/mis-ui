$(function () {
    $(document).ready(function () {
        let $folderTree = $('#folder-tree');
        let $folderContent = $('#folder-content-body');
        let $btnAdd = $('#btn-add-folder');
        loadAction();
        loadAjaxFolder(0);


        $folderTree.on('mouseenter', '.folder-btn', function () {
            if (!$(this).hasClass('clicked')) {
                $(this).closest('.folder-wrapper').css('background-color', '#ebfcf5');
            }
        });

        $folderTree.on('mouseleave', '.folder-btn', function () {
            if (!$(this).hasClass('clicked')) {
                $(this).closest('.folder-wrapper').css('background-color', '');
            }
        });

        $folderTree.on('click', '.folder-btn', function () {
            for (let eleBtn of $folderTree[0].querySelectorAll('.folder-btn')) {
                eleBtn.classList.remove('clicked');
                $(eleBtn).closest('.folder-wrapper').css('background-color', '');
            }
            $(this).addClass('clicked');
            $(this).closest('.folder-wrapper').css('background-color', '#f7f7f7');
        });

        $folderTree.on('click', '.folder-btn', function () {
            loadAjaxFolderContent($(this));
        });

        $folderTree.on('click', '.folder-cl', function () {
            loadAjaxFolder(1, $(this));
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        });



        $folderContent.on('mouseenter', '.folder-btn', function () {
            if (!$(this).hasClass('clicked')) {
                $(this).closest('.folder-wrapper').css('background-color', '#ebfcf5');
            }
        });

        $folderContent.on('mouseleave', '.folder-btn', function () {
            if (!$(this).hasClass('clicked')) {
                $(this).closest('.folder-wrapper').css('background-color', '');
            }
        });

        $folderContent.on('click', '.folder-btn', function () {
            for (let eleBtn of $folderContent[0].querySelectorAll('.folder-btn')) {
                eleBtn.classList.remove('clicked');
                $(eleBtn).closest('.folder-wrapper').css('background-color', '');
            }
            $(this).addClass('clicked');
            $(this).closest('.folder-wrapper').css('background-color', '#f7f7f7');
        });

        $folderContent.on('dblclick', '.folder-btn', function () {
            loadAjaxFolderContent($(this));
        });

        $btnAdd.on('click', function () {
            let dataSubmit = {};
            dataSubmit['title'] = $('#add-folder-title').val();
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': $(this).attr('data-url'),
                    'method': $(this).attr('data-method'),
                    'data': dataSubmit,
                }
            ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && (data['status'] === 201 || data['status'] === 200)) {
                            $.fn.notifyB({description: data.message}, 'success');
                            setTimeout(() => {
                                window.location.replace($(this).attr('data-redirect'));
                            }, 1000);
                        }
                    }, (err) => {
                        setTimeout(() => {
                            WindowControl.hideLoading();
                        }, 1000)
                        $.fn.notifyB({description: err?.data?.errors || err?.message}, 'failure');
                    }
                )
        });


        // FUNCTIONS
        function loadAction() {
            let $ele = $('#breadcrumb-data');
            if ($ele && $ele.length > 0) {
                let blogHeader = $ele[0].closest('.blog-header');
                if (blogHeader) {
                    blogHeader.classList.add('hidden');
                }
            }
        }

        function loadAjaxFolder(load_type, $eleFolderCl = null) {
            let dataFilter = {};
            if (load_type === 0) {
                dataFilter = {'parent_n_id__isnull': true};
                $.fn.callAjax2({
                    url: $folderTree.attr('data-url'),
                    method: $folderTree.attr('data-method'),
                    'data': dataFilter,
                    isLoading: true,
                }).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && resp.data.hasOwnProperty('folder_list')) {
                            let dataFolderList = resp.data['folder_list'] ? resp.data['folder_list'] : [];
                            loadFolderParent(dataFolderList);
                        }
                    }
                )
            }
            if (load_type === 1) {
                if ($eleFolderCl && $eleFolderCl.length > 0) {
                    let parentID = "folder-" + $eleFolderCl.attr('data-id').replace(/-/g, "");
                    let $eleParent = $('#' + parentID);
                    if (!$eleParent.length > 0) {
                        dataFilter = {'parent_n_id': $eleFolderCl.attr('data-id')};
                        $.fn.callAjax2({
                            url: $folderTree.attr('data-url'),
                            method: $folderTree.attr('data-method'),
                            'data': dataFilter,
                            isLoading: false,
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data && resp.data.hasOwnProperty('folder_list')) {
                                    let dataFolderList = resp.data['folder_list'] ? resp.data['folder_list'] : [];
                                    if ($eleFolderCl && $eleFolderCl.length > 0) {
                                        loadFolderChild(dataFolderList, $eleFolderCl);
                                    }
                                }
                            }
                        )
                    }
                }
            }
        }

        function loadFolderParent(dataList) {
            for (let dataFolder of dataList) {
                $folderTree.append(`<div class="d-flex justify-content-start folder-wrapper">
                                        <small><button 
                                            type="button" 
                                            class="btn btn-icon btn-xs folder-cl" 
                                            data-id="${dataFolder?.['id']}"
                                            data-bs-toggle="collapse"
                                            data-bs-target="#folder-${dataFolder?.['id'].replace(/-/g, "")}"
                                            data-bs-placement="top"
                                            aria-expanded="false"
                                        >
                                            <span class="icon"><small><i class="fas fa-chevron-right mt-2"></i></small></span>
                                        </button></small>
                                        <button type="button" class="btn folder-btn" data-id="${dataFolder?.['id']}">
                                            <span>
                                                <span class="icon"><i class="far fa-folder"></i></span>
                                                <span>${dataFolder?.['title']}</span>
                                            </span>
                                        </button>
                                    </div>`);
            }
        }

        function loadFolderChild(dataList, $eleFolderCl) {
            let parentID = "folder-" + $eleFolderCl.attr('data-id').replace(/-/g, "");
            let $eleParent = $('#' + parentID);
            if ($eleParent && $eleParent.length > 0) {
                $eleParent.remove();
            }
            let numMargin = 16;
            let $eleFolderWrp = $eleFolderCl.closest('.folder-wrapper');
            if ($eleFolderWrp && $eleFolderWrp.length > 0) {
                let marginLeft = $eleFolderWrp.css('margin-left');
                if (marginLeft !== undefined && marginLeft !== '0px') {
                    let num = parseInt(marginLeft);
                    numMargin += num;
                }
            }
            let margin = String(numMargin) + 'px';
            let htmlChild = ``;
            for (let dataFolder of dataList) {
                let childID = "folder-" + dataFolder?.['id'].replace(/-/g, "");
                htmlChild += `<div class="d-flex justify-content-start folder-wrapper" style="margin-left: ${margin}">
                                    <small><button 
                                        type="button" 
                                        class="btn btn-icon btn-xs folder-cl" 
                                        data-id="${dataFolder?.['id']}"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#${childID}"
                                        data-bs-placement="top"
                                        aria-expanded="false"
                                    >
                                        <span class="icon"><small><i class="fas fa-chevron-right mt-2"></i></small></span>
                                    </button></small>
                                    <button type="button" class="btn folder-btn" data-id="${dataFolder?.['id']}"
                                    >
                                        <span>
                                            <span class="icon"><i class="far fa-folder"></i></span>
                                            <span>${dataFolder?.['title']}</span>
                                        </span>
                                    </button>
                                </div>`;
            }
            $($eleFolderCl[0].closest('.folder-wrapper')).after(`<div class="collapse show collapse-folder-child" id="${parentID}">${htmlChild}</div>`);
        }

        function loadAjaxFolderContent($eleFolder) {
            $.fn.callAjax2({
                url: $folderTree.attr('data-url'),
                method: $folderTree.attr('data-method'),
                'data': {'parent_n_id': $eleFolder.attr('data-id')},
                isLoading: false,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data && resp.data.hasOwnProperty('folder_list')) {
                        let dataFolderList = resp.data['folder_list'] ? resp.data['folder_list'] : [];
                        // loadFolderContent(dataFolderList);
                        $.fn.callAjax2({
                            url: $folderTree.attr('data-url-file'),
                            method: $folderTree.attr('data-method'),
                            'data': {'folder_id': $eleFolder.attr('data-id')},
                            isLoading: false,
                        }).then(
                            (resp) => {
                                let data = $.fn.switcherResp(resp);
                                if (data && resp.data.hasOwnProperty('folder_file_list')) {
                                    let dataFileList = resp.data['folder_file_list'] ? resp.data['folder_file_list'] : [];
                                    loadFolderContent(dataFolderList, dataFileList);
                                }
                            }
                        )
                    }
                }
            )
        }

        function loadFolderContent(dataFolderList, dataFileList) {
            $folderContent.empty();
            for (let data of dataFolderList) {
                $folderContent.append(`<div class="row">
                                            <div class="col-12 col-md-5 col-lg-5">
                                                <div class="d-flex justify-content-start folder-wrapper">
                                                    <button type="button" class="btn folder-btn" data-id="${data?.['id']}">
                                                        <span>
                                                            <span class="icon"><i class="far fa-folder"></i></span>
                                                            <span>${data?.['title']}</span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-2 col-lg-2">${moment(data?.['date_modified']).format('DD/MM/YYYY')}</div>
                                            <div class="col-12 col-md-2 col-lg-2">Folder</div>
                                        </div>`);
            }
            let imgMapType = {
                'txt': 'far fa-file-alt',
                'text/plain': 'far fa-file-alt',
                'application/pdf': 'far fa-file-pdf',
                'application/msword': 'far fa-file-word',
                'image/png': 'far fa-image',
                'image/jpeg': 'far fa-image',
            }
            for (let data of dataFileList) {
                $folderContent.append(`<div class="row">
                                            <div class="col-12 col-md-5 col-lg-5">
                                                <div class="d-flex justify-content-start file-wrapper">
                                                    <button type="button" class="btn file-btn" data-id="${data?.['id']}">
                                                        <span>
                                                            <span class="icon"><i class="${imgMapType[data?.['file_type']]}"></i></span>
                                                            <span>${data?.['file_name']}</span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-2 col-lg-2">${moment(data?.['date_created']).format('DD/MM/YYYY')}</div>
                                            <div class="col-12 col-md-2 col-lg-2">${data?.['file_type']}</div>
                                            <div class="col-12 col-md-2 col-lg-2">${data?.['file_size']}</div>
                                        </div>`);
            }
        }



    });
});