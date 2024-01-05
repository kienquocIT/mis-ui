$(function () {

    function activeDrawer(drawerID, eleClicked, alwaysState = null) {
        let selectEle = $(drawerID);
        if (selectEle.length > 0) {
            // convert some flag
            let drawerPush = selectEle.attr('data-drawer-push');
            if (eleClicked) {
                let drawerPushBtn = $.fn.parseBoolean(eleClicked.attr('data-drawer-push'));
                if ($.fn.isBoolean(drawerPushBtn)) drawerPush = drawerPushBtn;

                let alwaysStateBtn = $.fn.parseBoolean(eleClicked.attr('data-drawer-always-state'));
                if ($.fn.isBoolean(alwaysStateBtn)) alwaysState = alwaysStateBtn;
            }
            // => always_state
            if (alwaysState === true) {
                selectEle.addClass('open');
                $('.hk-wrapper').addClass('open');
            } else if (alwaysState === false) {
                selectEle.removeClass('open');
                $('.hk-wrapper').removeClass('open');
            } else {
                selectEle.toggleClass('open');
                $('.hk-wrapper').toggleClass('open');
            }
            // => drawerPush
            let drawerWidth = selectEle.attr('data-drawer-width');
            if (!drawerWidth) {
                drawerWidth = selectEle.width() + 2 + 'px'; // plus "2" px border of drawer + body-content
            } else {
                drawerWidth += 'px';
            }
            if (selectEle.hasClass('ntt-drawer-left')) {
                $(':root').css({
                    '--ntt-drawer-width': drawerWidth,
                });
            } else if (selectEle.hasClass('ntt-drawer-right')) {
                $(':root').css({
                    '--ntt-drawer-width': drawerWidth,
                })
            }
            if (drawerPush === true || drawerPush === 'true') {
                if (selectEle.hasClass('ntt-drawer-left')) {
                    $(':root').css({
                        '--ntt-drawer-margin-left': drawerWidth
                    });
                } else if (selectEle.hasClass('ntt-drawer-right')) {
                    $(':root').css({
                        '--ntt-drawer-margin-right': drawerWidth
                    })
                }
            }
            if (selectEle.hasClass('ntt-drawer-left') || selectEle.hasClass('ntt-drawer-right')){
                let heightNavHeader = $('.hk-navbar').outerHeight();
                $('.ntt-drawer').css('top', heightNavHeader)
                    .css('height', "calc(100vh - " + (heightNavHeader + "px") + ")");
            }

            // push first active tab to history | don't need to click to tab element
            selectEle.find('.nav-tabs a[data-bs-toggle="tab"].active').each(function (){
                $x.cls.window.pushHashUrl(this.hash);
            })
        }
    }

    $(document).on('click', '.ntt-drawer-toggle-link', function (event) {
        event.preventDefault();
        activeDrawer($(this).attr('data-drawer-target'), $(this));
    });
    $(document).on('click', '.ntt-drawer-close', function (event) {
        event.preventDefault();

        // remove has URL when close
        let hasStateInHere = $(this).closest('.ntt-drawer').find('.nav-tabs a[data-bs-toggle="tab"]').filter(function () {
            return this.hash === $x.cls.window.getHashUrl();
        }).length;
        if (hasStateInHere > 0) $x.cls.window.removeHashUrl();

        $(this).closest('.ntt-drawer').toggleClass('open');
        $('.hk-wrapper').toggleClass('open');
    });
})

