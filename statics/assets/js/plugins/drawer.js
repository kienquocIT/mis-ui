$(function () {

    function activeDrawer(drawerID) {
        let selectEle = $(drawerID);
        if (selectEle.length > 0) {
            selectEle.toggleClass('open');
            $('.hk-wrapper').toggleClass('open');
            let drawerPush = selectEle.attr('data-drawer-push');
            if (drawerPush === true || drawerPush === 'true') {
                let drawerWidth = selectEle.attr('data-drawer-width');
                if (!drawerWidth) {
                    drawerWidth = selectEle.width() + 2 + 'px'; // plus "2" px border of drawer + body-content
                } else {
                    drawerWidth += 'px';
                }

                if (selectEle.hasClass('ntt-drawer-left')) {
                    $(':root').css({
                        '--ntt-drawer-width': drawerWidth,
                        '--ntt-drawer-margin-left': drawerWidth
                    });
                } else if (selectEle.hasClass('ntt-drawer-right')) {
                    $(':root').css({
                        '--ntt-drawer-width': drawerWidth,
                        '--ntt-drawer-margin-right': drawerWidth
                    })
                }
            }

        }
    }

    $('.ntt-drawer-toggle-link').click(function (event) {
        event.preventDefault();
        activeDrawer($(this).attr('data-drawer-target'));
    });
    $('.ntt-drawer-close').click(function (event) {
        event.preventDefault();
        $(this).closest('.ntt-drawer').toggleClass('open');
        $('.hk-wrapper').toggleClass('open');
    });
})

