$(function () {
    $(document).ready(function () {
        let $folderMenu = $('#folder-menu');
        let $folderHistory = $('#folder-history');
        let $folderHistoryPath = $('#folder-history-path');
        let $btnRefresh = $('#btn-refresh');
        let $folderPath = $('#folder-path');
        let $uploadFile = $('#upload-file')
        let $folderTree = $('#folder-tree');
        let $folderContent = $('#folder-content-body');
        let $modalAdd = $('#addFolderMdl');
        let $modalUpFile = $('#uploadFileMdl');
        let $btnAdd = $('#btn-add-folder');
        let $btnUpFile = $('#btn-upload-file');

        let $transFact = $('#app-trans-factory');
        let $urlFact = $('#app-url-factory');

        loadAction();
        loadAjaxFolder(0);

        // ACTIONS
        // $uploadFile.on('click', function () {
        //     $('#uploadOpen').click();
        // });

        // FOLDER TREE
        $folderTree.on('mouseenter', '.folder-btn', function () {
            if (!$(this).hasClass('clicked')) {
                $(this).closest('.folder-wrapper').css('background-color', '#f7f7f7');
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
            $(this).closest('.folder-wrapper').css('background-color', '#99efcc');

            loadAjaxFolderContent($(this));
        });

        $folderTree.on('dblclick', '.folder-btn', function () {
            loadAjaxFolderContent($(this));
            let folderWrp = this.closest('.folder-wrapper');
            if (folderWrp) {
                let eleCl = folderWrp.querySelector('.folder-cl');
                if (eleCl) {
                    $(eleCl).click();
                }
            }
        });

        $folderTree.on('click', '.folder-cl', function () {
            loadAjaxFolder(1, $(this));
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-right');
        });

        // FOLDER CONTENT
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
            for (let btn of $folderMenu[0].querySelectorAll('.btn-action')) {
                btn.removeAttribute('disabled');
            }
        });

        $folderContent.on('dblclick', '.folder-btn', function () {
            loadAjaxFolderContent($(this));
        });

        // FOLDER PATH
        $folderPath.on('click', '.folder-btn', function () {
            loadAjaxFolderContent($(this));
        });

        $modalAdd.on('shown.bs.modal', function () {
            loadInitS2($('#add-folder-box-parent'));
        });

        $btnAdd.on('click', function () {
            let dataSubmit = {};
            dataSubmit['title'] = $('#add-folder-title').val();
            dataSubmit['parent_n'] = $('#add-folder-box-parent').val();
            WindowControl.showLoading();
            $.fn.callAjax2(
                {
                    'url': $urlFact.attr('data-url'),
                    'method': 'POST',
                    'data': dataSubmit,
                }
            ).then(
                    (resp) => {
                        let data = $.fn.switcherResp(resp);
                        if (data && (data['status'] === 201 || data['status'] === 200)) {
                            $.fn.notifyB({description: data.message}, 'success');
                            // refresh folder content
                            $btnRefresh.click();
                            setTimeout(() => {
                                window.location.replace($urlFact.attr('data-url-redirect'));
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

        $btnUpFile.on('click', function () {
            $btnRefresh.click();
        });


        // FUNCTIONS
        function loadInitS2($ele, $modal = null, data = [], dataParams = {}) {
            let opts = {'allowClear': true};
            $ele.empty();
            if ($modal) {
                opts['dropdownParent'] = $modal;
            }
            if (data.length > 0) {
                opts['data'] = data;
            }
            if (Object.keys(dataParams).length !== 0) {
                opts['dataParams'] = dataParams;
            }
            $ele.initSelect2(opts);
            return true;
        }

        function loadAction() {
            let $ele = $('#breadcrumb-data');
            if ($ele && $ele.length > 0) {
                let blogHeader = $ele[0].closest('.blog-header');
                if (blogHeader) {
                    blogHeader.classList.add('hidden');
                }
            }
            return true;
        }

        function loadAjaxFolder(load_type, $eleFolderCl = null) {
            let dataFilter = {};
            if (load_type === 0) {
                dataFilter = {'parent_n_id__isnull': true};
                $.fn.callAjax2({
                    url: $urlFact.attr('data-url'),
                    method: 'GET',
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
                            url: $urlFact.attr('data-url'),
                            method: 'GET',
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
            return true;
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
                                        <button type="button" class="btn folder-btn" data-id="${dataFolder?.['id']}" data-parent-id="${dataFolder?.['parent_n_id'] ? dataFolder?.['parent_n_id'] : ''}">
                                            <span>
                                                <span class="icon"><i class="far fa-folder"></i></span>
                                                <span>${dataFolder?.['title']}</span>
                                            </span>
                                        </button>
                                    </div>`);
            }
            return true;
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
                                    <button type="button" class="btn folder-btn" data-id="${dataFolder?.['id']}" data-parent-id="${dataFolder?.['parent_n_id'] ? dataFolder?.['parent_n_id'] : ''}">
                                        <span>
                                            <span class="icon"><i class="far fa-folder"></i></span>
                                            <span>${dataFolder?.['title']}</span>
                                        </span>
                                    </button>
                                </div>`;
            }
            $($eleFolderCl[0].closest('.folder-wrapper')).after(`<div class="collapse show collapse-folder-child" id="${parentID}">${htmlChild}</div>`);
            return true;
        }

        function loadAjaxFolderContent($eleFolder) {
            // set data-id dad-file-control-group (modal #uploadFileMdl)
            let fileCtrlEle = $modalUpFile[0].querySelector('.dad-file-control-group');
            if (fileCtrlEle) {
                $(fileCtrlEle).attr('data-folder-id', $eleFolder.attr('data-id'));
            }
            // load Folders
            let urlDetail = $urlFact.attr('data-url-detail').format_url_with_uuid($eleFolder.attr('data-id'));
            $.fn.callAjax2({
                url: urlDetail,
                method: 'GET',
                isLoading: false,
            }).then(
                (resp) => {
                    let data = $.fn.switcherResp(resp);
                    if (data) {
                        loadFolderContent(data?.['child_n'], data?.['file']);

                        if (!['btn-back', 'btn-next', 'btn-refresh'].includes($eleFolder[0].id)) {
                            // reset path
                            if ($eleFolder[0].closest('#folder-tree')) {
                                loadFolderPath(3);
                            }
                            // set next path
                            loadFolderPath(0, data);
                            // set data-list for $folderHistory
                            let listHistory = [];
                            if ($folderHistory.attr('data-list')) {
                                listHistory = JSON.parse($folderHistory.attr('data-list'));
                            }
                            for (let dataHis of listHistory) {
                                delete dataHis['is_current'];
                            }
                            data['is_current'] = true;
                            listHistory.push(data);
                            $folderHistory.attr('data-list', JSON.stringify(listHistory));
                            // set data-list for $folderHistoryPath
                            let listHistoryPath = [];
                            if ($folderHistoryPath.attr('data-list')) {
                                listHistoryPath = JSON.parse($folderHistoryPath.attr('data-list'));
                            }
                            for (let dataHisPath of listHistoryPath) {
                                delete dataHisPath['is_current'];
                            }
                            listHistoryPath.push({'path': $folderPath[0].innerHTML, 'is_current': true});
                            $folderHistoryPath.attr('data-list', JSON.stringify(listHistoryPath));
                        }
                    }
                }
            )
            return true;
        }

        function loadFolderContent(dataFolderList, dataFileList) {
            $folderContent.empty();
            for (let data of dataFolderList) {
                $folderContent.append(`<div class="row align-items-center">
                                            <div class="col-12 col-md-5 col-lg-5">
                                                <div class="d-flex justify-content-start folder-wrapper">
                                                    <button type="button" class="btn folder-btn" data-id="${data?.['id']}" data-parent-id="${data?.['parent_n_id'] ? data?.['parent_n_id'] : ''}">
                                                        <span>
                                                            <span class="icon"><i class="far fa-folder"></i></span>
                                                            <span>${data?.['title']}</span>
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="col-12 col-md-2 col-lg-2">Me</div>
                                            <div class="col-12 col-md-2 col-lg-2">${moment(data?.['date_modified']).format('DD/MM/YYYY')}</div>
                                        </div>`);
            }
            let imgMapType = {
                'txt': 'far fa-file-alt',
                'text/plain': 'far fa-file-alt',
                'application/pdf': 'far fa-file-pdf text-red',
                'application/msword': 'far fa-file-word text-indigo',
                'image/png': 'far fa-image text-violet',
                'image/jpeg': 'far fa-image text-violet',
            }
            for (let data of dataFileList) {
                $folderContent.append(`<div class="row align-items-center">
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
                                            <div class="col-12 col-md-2 col-lg-2">Me</div>
                                            <div class="col-12 col-md-2 col-lg-2">${moment(data?.['date_created']).format('DD/MM/YYYY')}</div>
                                            <div class="col-12 col-md-2 col-lg-2">${data?.['file_size']} KB</div>
                                            <div class="col-12 col-md-1 col-lg-1">
                                                <div class="dropdown">
                                                    <button class="btn btn-icon btn-rounded btn-flush-light flush-soft-hover" aria-expanded="false" data-bs-toggle="dropdown"><span class="icon"><i class="far fa-caret-square-down"></i></span></button>
                                                    <div role="menu" class="dropdown-menu w-210p">
                                                        <a class="dropdown-item" href="#"><i class="dropdown-icon fas fa-share-square text-primary"></i><span>Share</span></a>
                                                        <a class="dropdown-item" href="#"><i class="dropdown-icon fas fa-download text-primary"></i><span>Download</span></a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`);
            }
            return true;
        }

        function loadFolderPath(load_type, dataFd = {}) {
            if (load_type === 0) {  // next path
                $folderPath.append(`<i class="fas fa-angle-right mr-2 ml-2"></i><button type="button" class="btn btn-flush-secondary flush-soft-hover btn-rounded btn-lg text-black folder-btn" data-id="${dataFd?.['id']}">${dataFd?.['title']}</button>`);
            }
            if (load_type === 1) {  // back path
                let lastIcon = $folderPath[0].querySelector('i:last-of-type');
                if (lastIcon) {
                    $folderPath[0].removeChild(lastIcon);
                }
                let lastSpan = $folderPath[0].querySelector('span:last-of-type');
                if (lastSpan) {
                    $folderPath[0].removeChild(lastSpan);
                }
            }
            if (load_type === 3) {  // reset path
                $folderPath.empty();
                $folderPath.append(`<button type="button" class="btn btn-flush-secondary flush-soft-hover btn-rounded btn-lg text-black folder-btn">My files</button>`);
            }
            return true;
        }


    });
});