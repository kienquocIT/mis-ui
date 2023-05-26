/** *************Init JS*********************

 TABLE OF CONTENTS
 ---------------------------
 1.Ready function
 2.Load function
 3.Toggle function
 4.jampack function
 5.Horizontal Menu
 6.Navbar Menu
 7.Unique ID Gen
 8.Full height function
 9.Chat App function
 10.Email App function
 11.Contact App function
 12.Invoice App function
 13.File Manager App function
 14.Gallery App function
 15.Blog App function
 16.Integrations App function
 17.Checklist App function
 18.Todo App function
 19.Calendar App function
 20.Advance List Z-index
 21.Resize function
 ** ***************************************/

"use strict";
/*****Ready function start*****/
$(function () {
    jampack();
    horizontalMenu();
    navheadMenu();

    /*App Functions */
    emailApp();
    contactApp();
    chatApp();
    calendarApp();
    fmApp();
    blogApp();
    invoiceApp();
    galleryApp();
    integrationsApp();
    taskboardApp();
    checklistApp();
    todoApp();

    /*Table Search*/
    $(".table-search").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".table-filter tbody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    /*Disabled*/
    $(document).on("click", "a.disabled,a:disabled", function (e) {
        return false;
    });
});
/*****Ready function end*****/

/*****Load function start*****/
$(window).on("load", function () {
    $(".preloader-it").delay(500).fadeOut("slow");

    /*Chat popover animation*/
    var chatPopver = $('.chat-popover');
    if ($('.chat-popover').length > 0) {
        chatPopver.delay(500).fadeIn("fast");
    }
});
/*****Load function* end*****/

/*Variables*/
var height, width, $wrapper = $(".hk-wrapper"), $menu = $(".hk-menu"),
    $stickytableheadWrap = $(".sticky-table-head-wrap table"), $navbar = $(".hk-navbar");

/***** Toggle function start *****/
var toggleFullscreen = function (elem) {
    elem = elem || document.documentElement;
    if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}
/***** Toggle function end *****/

/***** jampack function start *****/
var jampack = function () {
    /*Current Year*/
    if ($('#copyright_year').length > 0) {
        document.getElementById('copyright_year').appendChild(document.createTextNode(new Date().getFullYear()))
    }
    /*Select Dropdown*/
    $(document).on('click', '.selectable-dropdown .dropdown-menu .dropdown-item', function (e) {
        var selText = $(this).text(), selbg = $(this).attr('data-color');
        $(this).parents('.selectable-dropdown').find('.dropdown-toggle').css({
            "border-color": selbg,
            "background": selbg
        }).html(selText);
    });
    $(document).on('click', '.selectable-split-dropdown .dropdown-menu .dropdown-item', function (e) {
        var selText = $(this).text(), selbg = $(this).attr('data-color');
        $(this).parents('.selectable-split-dropdown').find('.btn-dyn-text').html(selText);
    });

    /*Fade In*/
    $(document).on('click', '[data-fade-in]', function (e) {
        $($(this).attr('data-fade-in')).fadeIn('fast');
    });
    $(document).on('click', '[data-fade-out]', function (e) {
        $($(this).attr('data-fade-out')).fadeOut('fast');
    });

    /*Feather Icon*/
    if ($('.feather-icon').length > 0) {
        feather.replace();
    }

    /*Progress Bar Animation Icon*/
    if ($('.progress-width-animated').length > 0) {
        var delay = 500;
        $(".progress-width-animated .progress-bar").each(function (i) {
            $(this).delay(delay * i).animate({width: $(this).attr('aria-valuenow') + '%'}, delay);

            $(this).prop('Counter', 0).animate({
                Counter: $(this).find('span').text()
            }, {
                duration: delay,
                easing: 'swing',
                step: function (now) {
                    $(this).find('span').text(Math.ceil(now) + '%');
                }
            });
        });
    }

    /*Input Search Clear*/
    if ($('.input-search input').length > 0) {
        $(document).on("keyup", ".input-search input", function (e) {
            if ((!$(this).val().length == 0)) {
                $(this).closest('.input-search').find('.btn-input-clear').show();
            } else if ($(this).val().length == 0) {
                $(this).closest('.input-search').find('.btn-input-clear').hide();
            }
            return false;
        });

        $(document).on("click", ".input-search .btn-input-clear", function (e) {
            $(this).closest('.input-search').find('input').val("").trigger('keyup').trigger('blur');
            /*Navbar Input Search Close*/
            $(".dropdown-toggle").dropdown('hide');
            return false;
        });
        $(document).on("mousedown", '.input-search .btn-input-clear', function (e) {
            e.preventDefault();
        });
    }

    /*Navbar Input Search Close*/
    var searchClicked, targetGrp = '.navbar-search .dropdown-toggle';
    $(document).on('click', targetGrp, function (e) {
        if (width > 1199) {
            searchClicked = true;
            return false;
        }
    });
    $(document).on("hide.bs.dropdown", targetGrp, function (e) {
        if (width > 1199) {
            if (searchClicked == true) {
                searchClicked = false;
                return false;
            }
        }
    });
    $(document).on('focusout', targetGrp, function (e) {
        if (width > 1199) {
            $(".dropdown-toggle").dropdown('hide');
            return false;
        }
    });
    $(document).on("mousedown", '.navbar-search .dropdown-menu', function (e) {
        if (width > 1199) e.preventDefault();
    });

    /*Counter Animation*/
    var counterAnim = $('.counter-anim');
    if (counterAnim.length > 0) {
        counterAnim.counterUp({
            delay: 10,
            time: 1000
        });
    }

    /*Tooltip*/
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    /*Popover*/
    if ($('[data-toggle="popover"]').length > 0) $('[data-toggle="popover"]').popover()

    /*Navbar Collapse Animation*/
    var navbarNavAnchor = '.hk-menu .navbar-nav  li a,.nav-vertical li a';
    $(document).on("click", navbarNavAnchor, function (e) {
        $(this).closest('.menu-group').siblings().find('.collapse').collapse('hide');
        $(this).closest('.nav-item').siblings().find('.collapse').collapse('hide');
        $(this).closest('.nav-item').find('.collapse').collapse('hide');
        $(this).closest('.menu-group').siblings().find('.nav-link[data-bs-toggle="collapse"]').attr('aria-expanded', 'false');
        $(this).closest('.nav-item').siblings().find('.nav-link[data-bs-toggle="collapse"]').attr('aria-expanded', 'false');
    });

    /*Vertical Classic Menu*/
    $(document).on('click', '[data-layout="vertical"] .navbar-toggle', function (e) {
        $(this).trigger('blur');
        if (($wrapper).attr('data-layout-style') == 'default') {
            $wrapper.attr('data-layout-style', 'collapsed');
            setTimeout(function () {
                $wrapper.attr('data-hover', 'active');
            }, 250);
        } else if ((($wrapper).attr('data-layout-style') == 'collapsed') && (($wrapper).attr('data-hover') == 'active')) {
            $wrapper.attr('data-layout-style', 'default');
            $wrapper.removeAttr('data-hover');
        }
        return false;
    });
    $(document).on('click', '[data-layout="vertical"] #hk_menu_backdrop', function (e) {
        $wrapper.attr('data-layout-style', 'default');
        $wrapper.removeAttr('data-hover');
        return false;
    });

    /*Horizontal Menu*/
    $(document).on('click', '[data-layout="horizontal"] .navbar-toggle', function (e) {
        $(this).trigger('blur');
        if (($wrapper).attr('data-layout-style') == 'default') {
            $wrapper.attr('data-layout-style', 'collapsed');
        } else {
            $wrapper.attr('data-layout-style', 'default');
        }
        return false;
    });
    $(document).on('click', '[data-layout="horizontal"] #hk_menu_backdrop', function (e) {
        $wrapper.attr('data-layout-style', 'default');
        return false;
    });

    /*Navbar Menu*/
    $(document).on('click', '[data-layout="navbar"] .navbar-toggle', function (e) {
        $(this).trigger('blur');
        if (($wrapper).attr('data-layout-style') == 'default') {
            $wrapper.attr('data-layout-style', 'collapsed');
        } else {
            $wrapper.attr('data-layout-style', 'default');
        }
        return false;
    });
    $(document).on('click', '[data-layout="navbar"] #hk_menu_backdrop', function (e) {
        $wrapper.attr('data-layout-style', 'default');
        return false;
    });

    /*Drawer Js*/
    $(document).on('click', '.drawer-toggle-link', function (e) {
        var targetDrawer = $(this).attr('data-target');
        $('.hk-drawer').removeClass('drawer-toggle');
        $('.hk-drawer').css({"box-shadow": "none"});
        $wrapper.remove('.hk-drawer-backdrop');
        $wrapper.removeClass(function (index, className) {
            return (className.match(/\hk-drawer-\S+/g) || []).join(' ');
        });
        if ($(this).attr('data-drawer') == "push-normal") {
            if ($(targetDrawer).hasClass('drawer-left')) $wrapper.addClass('hk-drawer-push hk-drawer-pushleft'); else $wrapper.addClass('hk-drawer-push hk-drawer-pushright');

        } else if ($(this).attr('data-drawer') == "push-wth-nav") {
            if ($(targetDrawer).hasClass('drawer-left')) $wrapper.addClass('hk-drawer-push hk-drawer-wth-nav-push hk-drawer-pushleft'); else $wrapper.addClass('hk-drawer-push hk-drawer-wth-nav-push hk-drawer-pushright');
        } else if ($(this).attr('data-drawer') == "overlay") {
            $(targetDrawer).css({
                "border": "none",
                "box-shadow": "0 8px 32px rgba(0, 0, 0, 0.1)"
            });
            if ($(this).attr('data-backdrop') == "active") $wrapper.append('<div class="hk-drawer-backdrop"></div>');
        }
        $(targetDrawer).addClass('drawer-toggle');

        return false;
    });
    $(document).on('click', '.hk-drawer-backdrop', function (e) {
        $(this).remove();
        $('.hk-drawer').css({"box-shadow": "none"});
        $('.hk-drawer').removeClass('drawer-toggle');
        $wrapper.removeClass(function (index, className) {
            return (className.match(/\hk-drawer-\S+/g) || []).join(' ');
        });
        return false;
    });
    $(document).on('click', '.drawer-close', function (e) {
        $('.hk-drawer-backdrop').remove();
        $(this).closest('.hk-drawer').removeClass('drawer-toggle');
        $wrapper.removeClass(function (index, className) {
            return (className.match(/\hk-drawer-\S+/g) || []).join(' ');
        });
        return false;
    });

    /*Card Remove*/
    $(document).on('click', '.card-close', function (e) {
        var effect = $(this).data('effect');
        $(this).closest('.card').remove();
        return false;
    });

    /*Fixed Footer Remove*/
    $(document).on('click', '[data-dismiss="footer"]', function (e) {
        $(this).closest('.hk-fixed-footer').remove();
        return false;
    });

    /*Chips JS*/
    $(document).on("click", ".chip-dismissable .btn-close", function (e) {
        $(this).closest('.chip').remove();
        return false;
    });

    /*Togglable Js*/
    $(document).on('click', '.hk-navbar-togglable', function (e) {
        if (!(($wrapper).attr('data-navbar-style') == 'collapsed')) $wrapper.attr('data-navbar-style', 'collapsed'); else $wrapper.removeAttr('data-navbar-style');
        $(this).find('.feather-icon').toggleClass('d-none');
        return false;
    });

    /*Refresh Init Js*/
    var refreshMe = '.refresh';
    $(document).on("click", refreshMe, function (e) {
        var panelToRefresh = $(this).closest('.card').find('.refresh-container');
        var loadingAnim = panelToRefresh.find('.la-anim-1');
        panelToRefresh.show();
        setTimeout(function () {
            loadingAnim.addClass('la-animate');
        }, 100);

        function started() {
        } //function before timeout
        setTimeout(function () {
            function completed() {
            } //function after timeout
            panelToRefresh.fadeOut(800);
            setTimeout(function () {
                loadingAnim.removeClass('la-animate');
            }, 800);
        }, 1500);
        return false;
    });

    /*Fullscreen Init Js*/
    $(document).on("click", ".full-screen", function (e) {
        $(this).closest('.card').toggleClass('fullscreen');
        $(this).find('.icon > *').toggleClass('d-none');
        $(window).trigger("resize");
        return false;
    });

    /*Password Check Js*/
    $(document).on("click", ".password-check a", function (e) {
        var targetInput = $(this).closest(".input-group").find('input');
        if (targetInput.val().length > 0) {
            if ('password' == targetInput.attr('type')) {
                targetInput.prop('type', 'text');
                $(this).find('span').toggleClass('d-none');
            } else {
                targetInput.prop('type', 'password');
                $(this).find('span').toggleClass('d-none');
            }
        } else {
            $(this).find('span:first-child').removeClass('d-none');
            $(this).find('span:last-child').addClass('d-none');

        }
        return false;
    });
    $(document).on("input", ".password-check input", function (e) {
        if ($(this).val() == "") {
            $(this).prop('type', 'password');
            $(this).parent().find('.input-suffix > span:first-child').removeClass('d-none');
            $(this).parent().find('.input-suffix > span:last-child').addClass('d-none');
        }
    });

};
/***** jampack function end *****/

/***** Horizontal Menu start *****/
var horizontalMenu = function () {
    var horMenu = $('[data-layout="horizontal"] .hk-menu .menu-group');
    if (horMenu.length > 0) {
        var horMenuRect = horMenu[0].getBoundingClientRect(), liTotalWidth = 0, liCount = 0, extraLiHide = 0;
        if (horMenu.children("ul").children("li.more-nav-item").remove(), horMenu.children("ul").children("li").each(function (index) {
            $(this).removeAttr("style"), liTotalWidth += $(this).outerWidth(!0), liCount++
        }), !(window.innerWidth < 1199)) {
            var visibleLi = parseInt(horMenuRect.width / (liTotalWidth / liCount)) - 2;
            if ((visibleLi -= extraLiHide) < liCount) for (var horWrapper = function (horMenu) {
                horMenu.children("ul").append("<li class='nav-item more-nav-item'><a class='nav-link' href='javascript:void(0);' data-bs-toggle='collapse' data-bs-target='#dash_more'><span class='nav-icon-wrap'><span class='svg-icon'><svg xmlns='http://www.w3.org/2000/svg' class='icon icon-tabler icon-tabler-dots' width='24' height='24' viewBox='0 0 24 24' stroke-width='2' stroke='currentColor' fill='none' stroke-linecap='round' stroke-linejoin='round'> <path stroke='none' d='M0 0h24v24H0z' fill='none'></path> <circle cx='5' cy='12' r='1'></circle> <circle cx='12' cy='12' r='1'></circle> <circle cx='19' cy='12' r='1'></circle></svg></span></span></a><ul id='dash_more' class='nav flex-column collapse nav-children'></ul></li>");
                return horMenu.children("ul").children("li.more-nav-item")
            }(horMenu), i = visibleLi; i < liCount; i++) {
                var currentLi = horMenu.children("ul").children("li").eq(i), clone = currentLi.clone();
                horWrapper.children("ul").append(clone), currentLi.hide();
                if ($('.feather-icon').length > 0) feather.replace();
            }
        }
    }
    $(document).on('mouseenter', '[data-layout="horizontal"] .hk-menu .menu-content-wrap .navbar-nav  li', function () {
        if ($('ul', this).length) {
            var elm = $('ul:first', this);
            var off = elm.offset();
            var l = off.left;
            var w = elm.width();
            var isEntirelyVisible = (l + w <= width);
            if (!isEntirelyVisible) {
                $(this).addClass('edge');
            }
        }
    }).on('mouseleave', '[data-layout="horizontal"] .hk-menu .menu-content-wrap .navbar-nav  li', function () {
        $(this).removeClass('edge');
    });
}

/***** Horizontal Menu end*****/

/***** Navbar Menu start *****/
var navheadMenu = function () {
    var navbarMenu = $('[data-layout="navbar"] .hk-menu .menu-group');
    if (navbarMenu.length > 0) {
        var navbarMenuRect = navbarMenu[0].getBoundingClientRect(), liTotalWidth = 0, liCount = 0, extraLiHide = 0;
        if (navbarMenu.children("ul").children("li.more-nav-item").remove(), navbarMenu.children("ul").children("li").each(function (index) {
            $(this).removeAttr("style"), liTotalWidth += $(this).outerWidth(!0), liCount++
        }), !(window.innerWidth < 1199)) {
            var visibleLi = parseInt(navbarMenuRect.width / (liTotalWidth / liCount)) - 2;
            if ((visibleLi -= extraLiHide) < liCount) for (var navWrapper = function (navbarMenu) {
                navbarMenu.children("ul").append("<li class='nav-item more-nav-item'><a class='nav-link' href='javascript:void(0);' data-bs-toggle='collapse' data-bs-target='#dash_more'><span class='nav-icon-wrap'><span class='feather-icon'><i data-feather='more-horizontal'></i></span></span></a><ul id='dash_more' class='nav flex-column collapse nav-children'></ul></li>");
                return navbarMenu.children("ul").children("li.more-nav-item")
            }(navbarMenu), i = visibleLi; i < liCount; i++) {
                var currentLi = navbarMenu.children("ul").children("li").eq(i), clone = currentLi.clone();
                navWrapper.children("ul").append(clone), currentLi.hide();
                if ($('.feather-icon').length > 0) feather.replace();
            }
        }
    }
    $(document).on('mouseenter', '[data-layout="navbar"] .hk-menu .menu-content-wrap .navbar-nav  li', function () {
        if ($('ul', this).length) {
            var elm = $('ul:first', this);
            var off = elm.offset();
            var l = off.left;
            var w = elm.width();
            var isEntirelyVisible = (l + w <= width);
            if (!isEntirelyVisible) {
                $(this).addClass('edge');
            }
        }
    }).on('mouseleave', '[data-layout="navbar"] .hk-menu .menu-content-wrap .navbar-nav  li', function () {
        $(this).removeClass('edge');
    });
}

/***** Navbar Menu end*****/

/***** Unique ID Gen start*****/
var uniqId = (function () {
    var i = 0;
    return function () {
        return i++;
    }
})();
/***** Unique ID Gen end*****/

/***** Full height function start *****/
var setHeightWidth = function () {
    height = window.innerHeight;
    width = window.innerWidth;
    $('.full-height').css('height', (height));
};
/***** Full height function end *****/

/***** Chat App function start *****/
var chatAppTarget;
chatAppTarget = $('.chatapp-wrap')
var chatApp = function () {
    if (width > 991) chatAppTarget.removeClass('chatapp-slide');
    $(document).on("click", ".chatapp-wrap .chatapp-content .chatapp-aside .aside-body .chat-contacts-list .media", function (e) {
        if (width <= 991) {
            chatAppTarget.addClass('chatapp-slide');
            $wrapper.attr('data-navbar-style', 'collapsed');
            $('.hk-pg-wrapper').css('transition', '0s');
        }
        return false;
    });
    $(document).on("click", "#back_user_list", function (e) {
        if (width <= 991) {
            chatAppTarget.removeClass('chatapp-slide');
            $wrapper.removeAttr('data-navbar-style');
        }
        return false;
    });
    $(document).on("click", ".chatapp-info-toggle,.info-close", function (e) {
        chatAppTarget.toggleClass('chatapp-info-active');
        $(this).toggleClass('active');
        return false;
    });
    $(document).on("click", ".modal-fullscreen-togglable", function (e) {
        $(this).closest('.modal-content').toggleClass('fullscreen');
        $(this).find('.icon >*').toggleClass('d-none');
        return false;
    });

    /*Demo ChatApp*/
    if ($('.chatapp-wrap #chat_body').length > 0) {
        var demoScroll = document.querySelector('#chat_body .simplebar-content-wrapper');
        demoScroll.scrollTo({
            top: 100000,
            behavior: "smooth"
        });
        $(document).on('click', '.chat-contacts-list > .list-group-item > div.media', function (e) {
            $('.chat-contacts-list > .list-group-item > div.media').removeClass('active-user');
            $(this).addClass('read-chat active-user').find('.badge-pill').remove();
            $('.chatapp-single-chat header .user-name, .chat-info .cp-name,#audio_call .modal-body h3,#video_call .modal-body h3').text($(this).find('.user-name').text());
            $('.chatapp-single-chat header .media-head .avatar').replaceWith($(this).find('.media-head').html());
            if (!($('.chat-contacts-list').hasClass('group-list'))) {
                $('.chatapp-single-chat #dummy_avatar >li > .avatar').replaceWith($(this).find('.media-head').html());
                $('.chatapp-single-chat #dummy_avatar >li > .avatar').removeClass('avatar-sm badge-on-avatar badge-bottom-right custom-badge-on-avatar').addClass('avatar-xs').find('.badge,.hk-custom-badge').remove();
            }
            $('.chat-info .text-center .avatar,#audio_call .modal-body .avatar,#video_call .modal-body .avatar').replaceWith(($(this).find('.media-head').html()));
            $('.chat-info .text-center .avatar,#audio_call .modal-body .avatar,#video_call .modal-body .avatar').removeClass('avatar-sm').addClass('avatar-xxl').find('.badge,.badge-icon').remove();
            $('#audio_call .modal-body .avatar,#video_call .modal-body .avatar').addClass('d-20');
            $('.chat-info .cp-name').next().text($(this).find('.user-status').html());
            if ($(this).find('.user-last-chat').text() == 'Typing...') $('.chatapp-single-chat header .user-status').html('Typing<span class="one">.</span><span class="two">.</span><span class="three">.</span>'); else if ($(this).find('.media-head').find('.badge').length !== 0) $('.chatapp-single-chat header .user-status').text('Online'); else $('.chatapp-single-chat header .user-status').text('Active ' + Math.floor(Math.random() * 10 + 1) + 'min ago');

            return false;
        });
        $(document).on("keypress", "#input_msg_send_chatapp", function (e) {
            if ((e.which == 13) && (!$(this).val().length == 0)) {
                $('.chat-body .start-conversation').remove();
                $('<li class="media sent"><div class="media-body"><div class="msg-box"><div><p>' + $(this).val() + '</p><span class="chat-time">7:57 PM</span></div><div class="msg-action"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover no-caret"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-corner-up-right"><polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret" data-bs-toggle="dropdown"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></span></span></a><div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item ml-0" href="#">Forward</a><a class="dropdown-item ml-0" href="#">Copy</a></div></div></div></div></div></li>').appendTo(".chatapp-single-chat  ul.list-unstyled");
                $(this).val('');
                demoScroll.scrollTo({
                    top: 100000,
                    behavior: "smooth"
                });
                setTimeout(function () {
                    $('<li class="media received"><div class="avatar avatar-xs"><img src="' + $('.chat-header .avatar img').attr('src') + '" alt="user" class="avatar-img rounded-circle"></div><div class="media-body"><div class="msg-box"><div><p>What are you saying?</p><span class="chat-time">10:55 AM</span></div><div class="msg-action"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover no-caret"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-corner-up-right"><polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret" data-bs-toggle="dropdown"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></span></span></a><div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item ml-0" href="#">Forward</a><a class="dropdown-item ml-0" href="#">Copy</a></div></div></div></div></div></li>').appendTo(".chatapp-single-chat .chat-body ul.list-unstyled");
                    demoScroll.scrollTo({
                        top: 100000,
                        behavior: "smooth"
                    });
                }, 1000);
            } else if (e.which == 13) {
                alert('Please type somthing!');
            }
            return;
        });
        var targetInput = $('#input_msg_send_chatapp');
        $(document).on("click", ".chat-footer .btn-send", function (e) {
            if (!(targetInput.val() == 0)) {
                $('.chat-body .start-conversation').remove();
                $('<li class="media sent"><div class="media-body"><div class="msg-box"><div><p>' + targetInput.val() + '</p><span class="chat-time">7:57 PM</span></div><div class="msg-action"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover no-caret"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-corner-up-right"><polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret" data-bs-toggle="dropdown"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></span></span></a><div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item ml-0" href="#">Forward</a><a class="dropdown-item ml-0" href="#">Copy</a></div></div></div></div></div></li>').appendTo(".chatapp-single-chat  ul.list-unstyled");
                targetInput.val('');
                demoScroll.scrollTo({
                    top: 100000,
                    behavior: "smooth"
                });
                setTimeout(function () {
                    $('<li class="media received"><div class="avatar avatar-xs"><img src="' + $('.chat-header .avatar img').attr('src') + '" alt="user" class="avatar-img rounded-circle"></div><div class="media-body"><div class="msg-box"><div><p>What are you saying?</p><span class="chat-time">10:55 AM</span></div><div class="msg-action"><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover no-caret"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-corner-up-right"><polyline points="15 14 20 9 15 4"></polyline><path d="M4 20v-7a4 4 0 0 1 4-4h12"></path></svg></span></span></a><a href="#" class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret" data-bs-toggle="dropdown"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-horizontal"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg></span></span></a><div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item ml-0" href="#">Forward</a><a class="dropdown-item ml-0" href="#">Copy</a></div></div></div></div></div></li>').appendTo(".chatapp-single-chat .chat-body ul.list-unstyled");
                    demoScroll.scrollTo({
                        top: 100000,
                        behavior: "smooth"
                    });
                }, 1000);
            } else {
                alert('Please type somthing!');
            }
            return;
        });
        $(document).on("click", ".start-conversation .btn", function (e) {
            $('#input_msg_send_chatapp').trigger('focus');
            return;
        });
        $(".user-search").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $(".invite-user-list > li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        $(".search-files").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $(".cp-files li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
        $(".aside-search input").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $(".chat-contacts-list > li,.channels-list >li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    }

    /*ChatPopup*/
    if ($('.hk-chat-popup .chat-popup-body').length > 0) {
        var demoScroll = document.querySelector('.chat-popup-body .simplebar-content-wrapper');
        demoScroll.scrollTo({
            top: 100000,
            behavior: "smooth"
        });
        $(document).on("click", ".btn-popup-open", function (e) {
            $(this).addClass('d-none');
            $('.chat-popover').fadeOut('fast');
            $('.hk-chat-popup').addClass('d-flex');
            demoScroll.scrollTo({
                top: 100000,
                behavior: "smooth"
            });
            return false;
        });
        $(document).on("keypress", "#input_msg_chat_popup", function (e) {
            if ((e.which == 13) && (!$(this).val().length == 0)) {
                $('<li class="media sent"><div class="media-body"><div class="msg-box"><div><p>' + $(this).val() + '</p> <span class="chat-time">7:57 PM</span><div class="msg-action"><a href="#" class="btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret" data-bs-toggle="dropdown"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></span></span></a><div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item" href="#">Reply</a><a class="dropdown-item" href="#">Forward</a><a class="dropdown-item" href="#">Copy</a></div></div></div></div></div></div></li>').appendTo(".hk-chat-popup  ul.list-unstyled");
                $(this).val('');
                demoScroll.scrollTo({
                    top: 100000,
                    behavior: "smooth"
                });
                setTimeout(function () {
                    $('.typing-wrap').remove();
                    $('<li class="media received"><div class="avatar avatar-xs"> <img src="" alt="user" class="avatar-img rounded-circle"></div><div class="media-body"><div class="msg-box"><div><p>What are you saying?</p><span class="chat-time">10:55 AM</span><div class="msg-action"><a href="#" class="btn btn-sm btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret" data-bs-toggle="dropdown"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg></span></span></a><div class="dropdown-menu dropdown-menu-right"><a class="dropdown-item" href="#">Reply</a><a class="dropdown-item" href="#">Forward</a><a class="dropdown-item" href="#">Copy</a></div></div></div></div></div></div></li>').appendTo(".hk-chat-popup .chat-popup-body ul.list-unstyled");
                    demoScroll.scrollTo({
                        top: 100000,
                        behavior: "smooth"
                    });
                }, 1000);
            } else if (e.which == 13) {
                alert('Please type somthing!');
            }
            return;
        });
        $(document).on("click", "#close_popup", function (e) {
            $('.hk-chat-popup').removeClass('d-flex');
            $('.btn-popup-open').removeClass('d-none');
            return false;
        });
        $(document).on("click", "#user_list", function (e) {
            $('.hk-chat-popup header > .input-group,.hk-chat-popup .contact-list-wrap').removeClass('d-none');
            $('.hk-chat-popup header > .media-wrap,.hk-chat-popup header > .chat-popup-action,.hk-chat-popup .list-unstyled,.hk-chat-popup > footer').addClass('d-none');
            $('.hk-chat-popup .chat-popup-body').addClass('contact-list-height');
            return false;
        });
        $(document).on("click", "#contact_list_close", function (e) {
            $('.hk-chat-popup header > .input-group,.hk-chat-popup .contact-list-wrap').addClass('d-none');
            $('.hk-chat-popup header > .media-wrap,.hk-chat-popup header > .chat-popup-action,.hk-chat-popup .list-unstyled,.hk-chat-popup > footer').removeClass('d-none');
            $('.hk-chat-popup .chat-popup-body').removeClass('contact-list-height');
            return false;
        });
        $(".hk-chat-popup .contact-search").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            $(".contact-list-wrap .contact-list >li").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    }

    /*ChatBot*/
    if ($('.hk-chatbot-popup .chatbot-popup-body').length > 0) {
        var demoScroll = document.querySelector('.chatbot-popup-body .simplebar-content-wrapper');
        demoScroll.scrollTo({
            top: 100000,
            behavior: "smooth"
        });
        $(document).on("click", ".btn-popup-open", function (e) {
            $(this).addClass('btn-popup-close').removeClass('btn-popup-open');
            $('.chat-popover').fadeOut('fast');
            $('.hk-chatbot-popup').addClass('d-md-block d-flex');
            demoScroll.scrollTo({
                top: 100000,
                behavior: "smooth"
            });
            return false;
        });
        $(document).on("click", ".btn-popup-close", function (e) {
            $(this).addClass('btn-popup-open').removeClass('btn-popup-close');
            $('.hk-chatbot-popup').removeClass('d-md-block d-flex');
            return false;
        });
        $(document).on("click", "#minimize_chatbot", function (e) {
            $('.btn-popup-close').addClass('btn-popup-open').removeClass('btn-popup-close');
            $('.hk-chatbot-popup').removeClass('d-md-block d-flex');
            return false;
        });
        $(document).on("keypress", "#input_msg_chat_popup", function (e) {
            if ((e.which == 13) && (!$(this).val().length == 0)) {
                $('<li class="media sent"><div class="media-body"><div class="msg-box"><div><p>' + $(this).val() + '</p> </div></div></div></li>').appendTo(".hk-chatbot-popup  ul.list-unstyled");
                $(this).val('');
                demoScroll.scrollTo({
                    top: 100000,
                    behavior: "smooth"
                });
                setTimeout(function () {
                    $('.typing-wrap').remove();
                    $('<li class="media received"><div class="avatar avatar-xs avatar-soft-primary avatar-icon avatar-rounded"><span class="initial-wrap"><i class="ri-customer-service-2-line"></i></span></div><div class="media-body"><div class="msg-box"><div><p>What are you saying?</p></div></div></div></li>').appendTo(".hk-chatbot-popup .chatbot-popup-body ul.list-unstyled");
                    demoScroll.scrollTo({
                        top: 100000,
                        behavior: "smooth"
                    });
                }, 1000);
            } else if (e.which == 13) {
                alert('Please type somthing!');
            }
            return;
        });
        $(document).on("click", ".start-conversation", function (e) {
            $('.init-content-wrap').addClass('d-none');
            $('.list-unstyled,footer > .input-group').removeClass('d-none');
            $('.chatbot-popup-body .nicescroll-bar').css('margin-top', 0);
            $('.hk-chatbot-popup header').css('padding-bottom', '.5rem');
            $('.hk-chatbot-popup footer .chatbot-intro-text').addClass('d-none');
            return false;
        });
    }
};
/***** Chat App function end *****/

/***** Email App function start *****/
var emailAppTarget = $('.emailapp-wrap');
var emailApp = function () {
    if (width > 991) emailAppTarget.removeClass('emailapp-slide');
    $(document).on("click", ".emailapp-wrap .emailapp-content .emailapp-aside .aside-body .email-list .media", function (e) {
        if (width <= 991) {
            emailAppTarget.addClass('emailapp-slide');
            $wrapper.attr('data-navbar-style', 'collapsed');
            $('.hk-pg-wrapper').css('transition', '0s');
        }
        return;
    });
    $(document).on("click", ".emailapp-wrap .hk-sidebar-togglable", function (e) {
        emailAppTarget.toggleClass('emailapp-sidebar-toggle');
        $(this).toggleClass('active');
        return false;
    });
    $(document).on("click", "#back_email_list", function (e) {
        if (width <= 991) {
            emailAppTarget.removeClass('emailapp-slide');
            $wrapper.removeAttr('data-navbar-style');
        }
        return false;
    });
    $(document).on("click", ".show-compose-popup", function (e) {
        $('.compose-email-popup').addClass('d-block');
        return false;
    });
    $(document).on("click", "#min_compose_popup", function (e) {
        $('.compose-email-popup').removeClass('maximize-email-popup').toggleClass('minimize-email-popup');
        $wrapper.removeClass('hk__email__backdrop');
        return false;
    });
    $(document).on("click", "#max_compose_popup", function (e) {
        $('.compose-email-popup').removeClass('minimize-email-popup').toggleClass('maximize-email-popup');
        $wrapper.toggleClass('hk__email__backdrop');
        return false;
    });
    $(document).on("click", "#close_compose_popup", function (e) {
        $('.compose-email-popup').removeClass('d-block maximize-email-popup minimize-email-popup');
        $wrapper.removeClass('hk__email__backdrop');
        return false;
    });
    $(document).on("click", "[data-bs-target='#compose_email']", function (e) {
        $(this).parent().remove();
        return false;
    });

    /*Demo EmailApp*/ //Remove it if not nessasary
    $(".aside-search input").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $(".email-list > li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
};
/***** Email App function end *****/

/***** Contact App function start *****/
var contactAppTarget = $('.contactapp-wrap');
var contactApp = function () {
    $(document).on("click", ".contactapp-wrap .hk-sidebar-togglable", function (e) {
        contactAppTarget.toggleClass('contactapp-sidebar-toggle');
        $(this).toggleClass('active');
        return false;
    });
    $(document).on("click", ".contact-card-view input[type='checkbox']", function (e) {
        if ($(".contact-card-view input:checkbox:checked").length > 0) $('.contact-card-view').addClass('select-multiple'); else $('.contact-card-view').removeClass('select-multiple');
    });
}
/***** Contact App function end *****/

/***** Invoice App function start *****/
var invoiceAppTarget = $('.invoiceapp-wrap');
var invoiceApp = function () {
    $(document).on("click", ".invoiceapp-wrap .hk-sidebar-togglable", function (e) {
        invoiceAppTarget.toggleClass('invoiceapp-sidebar-toggle');
        $(this).toggleClass('active');
        return false;
    });
    $(document).on("click", ".invoiceapp-setting-toggle,.info-close", function (e) {
        invoiceAppTarget.toggleClass('invoiceapp-setting-active');
        $(this).toggleClass('active');
        return false;
    });
};
/***** Invoice App function end *****/

/***** File Manager App function start *****/
var fmAppTarget = $('.fmapp-wrap');
var fmApp = function () {
    $(document).on("click", ".fmapp-wrap .hk-sidebar-togglable", function (e) {
        fmAppTarget.toggleClass('fmapp-sidebar-toggle');
        $(this).toggleClass('active');
        return false;
    });
    $(document).on("click", ".fmapp-info-toggle,.info-close", function (e) {
        fmAppTarget.toggleClass('fmapp-info-active');
        $('.fmapp-info-toggle').toggleClass('active');
        return false;
    });
    $(document).on("click", ".fmapp-info-trigger", function (e) {
        fmAppTarget.addClass('fmapp-info-active');
        $('.fmapp-info-toggle').addClass('active');
        return false;
    });
};
/***** File Manager App function end *****/

/***** Gallery App function start *****/
var galleryAppTarget = $('.galleryapp-wrap');
var galleryApp = function () {
    $(document).on("click", ".galleryapp-wrap .hk-sidebar-togglable", function (e) {
        galleryAppTarget.toggleClass('galleryapp-sidebar-toggle');
        $(this).toggleClass('active');
        return false;
    });
    $(document).on("click", ".galleryapp-wrap input[type='checkbox']", function (e) {
        if ($(".gallery-body input:checkbox:checked").length > 0) {
            $('.gallery-body').addClass('select-multiple');
            $('.btn-file-download').removeClass('disabled');
        } else {
            $('.gallery-body').removeClass('select-multiple');
            $('.btn-file-download').addClass('disabled');
        }
    });
};
/***** Gallery App function end *****/

/***** Blog App function start *****/
var blogAppTarget = $('.blogapp-wrap');
var blogApp = function () {
    $(document).on("click", ".blogapp-wrap .hk-sidebar-togglable", function (e) {
        blogAppTarget.toggleClass('blogapp-sidebar-toggle');
        $(this).toggleClass('active');
        return false;
    });
};
/***** Blog App function end *****/

/***** Integrations App function start *****/
var integrationsAppTarget = $('.integrationsapp-wrap');
var integrationsApp = function () {
    $(document).on("click", ".integrationsapp-wrap .hk-sidebar-togglable", function (e) {
        integrationsAppTarget.toggleClass('integrationsapp-sidebar-toggle');
        $(this).toggleClass('active');
        return false;
    });
};
/***** Integrations App function end *****/

/***** Taskboard App function start *****/
var taskboardAppTarget = $('.taskboardapp-wrap');
var taskboardApp = function () {
    $(document).on("click", ".taskboardapp-wrap .hk-sidebar-togglable", function (e) {
        taskboardAppTarget.toggleClass('taskboardapp-sidebar-toggle');
        $(this).toggleClass('active');
        return false;
    });
    $(document).on("click", ".taskboardapp-info-toggle,.info-close", function (e) {
        taskboardAppTarget.toggleClass('taskboardapp-info-active');
        $('.taskboardapp-info-toggle').toggleClass('active');
        return false;
    });
};
/***** Taskboard App function end *****/

/***** Checklist App function start *****/
var checklistApp = function () {
    var id;
    $(document).on("click", ".add-new-checklist", function (e) {
        id = uniqId();
        $('<div class="form-check"> <input type="checkbox" class="form-check-input" id="customCheckListAppend_' + id + '"> <label class="form-check-label" for="customCheckListAppend_' + id + '"><span class="done-strikethrough"></span> </label> <input class="form-control checklist-input" type="text" placeholder="Add new Item"> <a href="#" class="btn btn-xs btn-icon btn-rounded btn-flush-light flush-soft-hover delete-checklist" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"><span class="icon"><span class="feather-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></span></span></a></div>').insertBefore($(this));
        $(this).prev().find('input').trigger('focus');
        return false;
    });
    $(document).on("click", ".delete-checklist", function (e) {
        $(this).closest('.form-check').remove();
        return false;
    });
    $(document).on("keypress", ".checklist-input", function (e) {
        if ((e.which == 13) && (!$(this).val().length == 0)) {
            $(this).prev().html($(this).val() + '<span class="done-strikethrough"></span>');
            $(this).remove();
        }
        return;
    });
};
/***** Checklist App function end *****/

/***** Todo App function start *****/
var todoAppTarget = $('.todoapp-wrap');
var todoApp = function () {
    $(document).on("click", ".todoapp-wrap .hk-sidebar-togglable", function (e) {
        todoAppTarget.toggleClass('todoapp-sidebar-toggle');
        $(this).toggleClass('active');
        return false;
    });
    $(document).on("click", ".todoapp-wrap .close-task-info", function (e) {
        todoAppTarget.toggleClass('todoapp-info-active');
        return false;
    });
    $(document).on("click", ".todoapp-wrap .edit-task,.todoapp-wrap .view-task,.todoapp-wrap .todo-text", function (e) {
        todoAppTarget.addClass('todoapp-info-active');
        $('.single-task-list').removeClass('active-todo');
        $(this).closest('li.single-task-list').addClass('active-todo');
        return;
    });
    $(document).on("click", ".todoapp-wrap .delete-task", function (e) {
        $(this).closest('li.single-task-list').remove();
        return false;
    });
    $(document).on("click", ".todoapp-wrap .full-screenapp", function (e) {
        $(this).find('.feather-icon').toggleClass('d-none');
        toggleFullscreen();
        return false;
    });
};
/***** Todo App function end *****/

/***** Calendar App function start *****/
var calendarAppTarget = $('.calendarapp-wrap');
var calendarApp = function () {
    $(document).on("click", ".calendarapp-wrap .hk-sidebar-togglable", function (e) {
        calendarAppTarget.toggleClass('calendarapp-sidebar-toggle');
        $(this).toggleClass('active');
        return false;
    });
};
/***** Calendar App function end *****/

/***** Advance List Z-index Start*****/
$('.advance-list li .dropdown').on('show.bs.dropdown', function () {
    $(this).closest('li').addClass('drp-open');
});
$('.advance-list li .dropdown').on('hide.bs.dropdown', function () {
    $(this).closest('li').removeClass('drp-open');
});
/***** Advance List Z-index End *****/

/***** Scroll function Start *****/
if ($('[data-scroll]').length > 0) {
    smoothScroll.init({
        speed: 100,
        easing: 'easeInOutCubic',
        offset: 80,
        updateURL: false,
        callbackBefore: function (toggle, anchor) {
        },
    });
}
/***** Scroll function End *****/

/***** Resize function start *****/
$(window).on("resize", function () {
    /*HeightWidth Calculation*/
    setHeightWidth();

    /*Classic Menu*/
    if (width < 1200 && (($wrapper).attr('data-layout') == 'vertical')) $wrapper.attr('data-layout-style', 'default');

    /*Horizontal Menu*/
    setTimeout(function () {
        horizontalMenu();
    }, 250);
    if (width > 1199 && (($wrapper).attr('data-layout') == 'horizontal')) $wrapper.attr('data-layout-style', 'default');

    /*Navbar Menu*/
    setTimeout(function () {
        navheadMenu();
    }, 250);
    if (width > 1199 && (($wrapper).attr('data-layout') == 'navbar')) $wrapper.attr('data-layout-style', 'default');

    /*Chat App Resopnsive*/
    if (width > 1199) {
        chatAppTarget.addClass('chatapp-info-active');
        $('.chatapp-info-toggle').addClass('active');
    } else {
        chatAppTarget.removeClass('chatapp-info-active');
        $('.chatapp-info-toggle').removeClass('active');
    }

    /*Todo App Resopnsive*/
    if (width > 1499 && !(todoAppTarget.hasClass('ganttapp-wrap'))) {
        todoAppTarget.addClass('todoapp-info-active');
    } else {
        todoAppTarget.removeClass('todoapp-info-active');
    }

    /*Invoice App Resopnsive*/
    if ($('.invoiceapp-setting-active').length > 0) {
        if (width > 1599) {
            invoiceAppTarget.addClass('invoiceapp-setting-active');
            $('.invoiceapp-setting-toggle').addClass('active');
        } else {
            invoiceAppTarget.removeClass('invoiceapp-setting-active');
            $('.invoiceapp-setting-toggle').removeClass('active');
        }
    }

    /*Sticky  Header*/
    $('.header-sticky,.header-sticky thead tr th').css('top', $navbar.outerHeight());
    if ($stickytableheadWrap.width() > $stickytableheadWrap.parent().width()) $stickytableheadWrap.parent().addClass('table-responsive'); else $stickytableheadWrap.parent().removeClass('table-responsive');
});
$(window).trigger("resize");
/***** Resize function end *****/


// clean notify child
$(document).ready(function () {
    new NotifyPopup().cleanChildNotifyBlock();
    $('.btn-redirect').click(function () {
        const url = $(this).attr('data-url');
        if (url) {
            location.href = url;
        }
    });

    // init dblclick form field to edit
    $.fn.formDetailToUpdateAction();
});


// function extend to jQuery
$.fn.extend({
    // utils
    generateRandomString: function (length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    arraysEqual: function (a, b) {
        if (a.length !== b.length) return false;
        return a.every((value, index) => value === b[index]);
    },
    arrayIncludesAll: function (a, b) {
        return b.every(value => a.includes(value));
    },
    shortName: function (name) {
        return name.split(" ").map((item) => {
            return item ? item.charAt(0) : ""
        }).join("");
    },
    DataTableDefault: function (opts, rowIdx = true) {
        let reloadCurrency = opts?.['reloadCurrency'];
        if (reloadCurrency !== undefined) {
            delete opts['reloadCurrency'];
        }
        let defaultConfig = {
            search: $.fn.DataTable.ext.type.search['html-numeric'],
            searching: true,
            ordering: false,
            paginate: true,
            pageLength: 10,
            dom: "<'row mt-3 miner-group'<'col-sm-12 col-md-3 col-lg-2 mt-3'f>>" + "<'row mt-3'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'p>>" + "<'row mt-3'<'col-sm-12'tr>>" + "<'row mt-3'<'col-sm-12 col-md-6'i>>",
            language: {
                url: $('#msg-datatable-language-config').text().trim(),
            },
            drawCallback: function () {
                feather.replace();
                if (reloadCurrency === true) {
                    // reload all currency
                    $.fn.initMaskMoney2();
                }
            },
            data: [], ...opts
        }
        if (opts?.['ajax']) delete defaultConfig['data'];
        if (rowIdx === true) defaultConfig['rowCallback'] = (row, data, index) => $('td:eq(0)', row).html(index + 1)
        let tbl = $(this).DataTable(defaultConfig);
        tbl.on('init.dt', function () {
            let minerGroup = $(this).closest('.waiter-miner-group');
            if (minerGroup.length > 0) {
                let filterGroup = $(minerGroup[0]).find('.miner-group');
                let filterItem = $(minerGroup[0]).find('.waiter-miner-item').children();
                if (filterGroup.length > 0 && filterItem.length > 0) {
                    filterItem.addClass('col-sm-12 col-md-3 col-lg-2 mt-3');
                    filterGroup.append(filterItem);
                    $('.dataTables_filter input').removeClass('form-control-sm');
                }
            }
            $(this).closest('.dataTables_wrapper').find('.select2').select2();
            $.fn.initMaskMoney2();
        });
        return tbl;
    },
    sumArray: (array) => {
        return array.reduce(function (acc, currentValue) {
            return acc + currentValue;
        }, 0);
    },

    // notify
    notifyB: function (option, typeAlert = null) {
        setTimeout(function () {
            $('.alert.alert-dismissible .close').addClass('btn-close').removeClass('close');
        }, 100);
        let msg = "";
        if (option.title) {
            msg += option.title;
        }
        if (option.description) {
            let des_tmp = '';
            if (typeof option.description === 'string') {
                des_tmp = option.description;
            } else if (Array.isArray(option.description)) {
                des_tmp = option.description.join(", ");
            } else {
                des_tmp = option.description.toString();
            }
            if (msg) {
                msg += ": " + des_tmp;
            } else {
                msg = des_tmp;
            }
        }
        let alert_config = {
            animate: {
                enter: 'animated bounceInDown',
                exit: 'animated bounceOutUp'
            },
            type: "dismissible alert-primary",
            z_index: 2147483647, /* Maximum index */
        }
        if (typeAlert === 'success') {
            alert_config['type'] = "dismissible alert-success";
        } else if (typeAlert === 'failure') {
            alert_config['type'] = "dismissible alert-danger";
        } else if (typeAlert === 'warning') {
            alert_config['type'] = "dismissible alert-warning";
        } else if (typeAlert === 'info') {
            alert_config['type'] = "dismissible alert-info";
        }
        $.notify(msg, alert_config);
    },
    notifyPopup: function (option, typeAlert = 'info') {
        // option: Object
        //     - title: title notify
        //     - description: content of notify
        // typeAlert: string
        //     - Choice in info, success, failure, warning
        if (typeAlert === 'success') {
            new NotifyPopup().success(option);
        } else if (typeAlert === 'failure') {
            new NotifyPopup().error(option);
        } else if (typeAlert === 'warning') {
            new NotifyPopup().warning(option);
        } else if (typeAlert === 'info') {
            new NotifyPopup().info(option)
        }
    },
    notifyErrors: (errs) => {
        if (errs && typeof errs === 'object') {
            let errors_converted = jQuery.fn.cleanDataNotify(errs);
            Object.keys(errors_converted).map((key) => {
                jQuery.fn.notifyB({
                    'title': key,
                    'description': errors_converted[key]
                }, 'failure');
            });
        }
    },

    // Config
    getCompanyConfig: async function () {
        let dataText = $('#urlCompanyConfigData').text();
        if (!dataText || dataText === '') {
            let companyConfigUrl = $('#urlCompanyConfig').attr('data-url');
            if (companyConfigUrl) {
                return await $.fn.callAjax(companyConfigUrl, 'GET').then((resp) => {
                    let data = $.fn.switcherResp(resp);
                    dataText = JSON.stringify(data);
                    $('#urlCompanyConfigData').text(dataText);
                    return data;
                }).then((rs) => {
                    return rs
                });
            }
        } else return JSON.parse(dataText);
    },
    getCompanyCurrencyConfig: async function () {
        let data = await $.fn.getCompanyConfig();
        return data['config']?.['currency_rule'];
    },

    // FORM handler
    serializerObject: function (formSelected) {
        return formSelected.serializeArray().reduce((o, kv) => ({
            ...o,
            [kv.name]: kv.value
        }), {});
    },
    formSubmit: function (formElement, notify = {
        'success': true,
        'failure': true
    }, enableRedirect = true,) {
        return new Promise(function (resolve, reject) {
            let frm = new SetupFormSubmit($(formElement));
            if (frm.dataUrl && frm.dataMethod) {
                $.fn.callAjax(frm.dataUrl, frm.dataMethod, frm.dataForm).then((resp) => {
                    if (notify.success) $.fn.notifyB({description: resp.detail}, 'info');
                    resolve(resp);
                    if (enableRedirect) if (frm.dataUrlRedirect) $.fn.redirectUrl(frm.dataUrlRedirect, frm.dataRedirectTimeout);
                }, (err) => {
                    console.log(err);
                    console.log(err.detail);
                    if (notify.failure) $.fn.notifyB({description: err.detail}, 'failure');
                    if (reject) {
                        reject(err);
                    }
                })
            } else throw 'Setup call raise exception with URL or method is incorrect.!';
        });
    },
    formDetailToUpdateAction: function () {
        let $DetailForm = $('form[readonly]');
        if ($DetailForm) {
            $('.readonly > * + span').on('click', function () {
                // for input/select
                $('[readonly]', $(this).parent('.readonly')).attr('readonly', false);
                $('input[disabled]', $(this).parent('.readonly')).attr('disabled', false);
                // for radio/checkbox
                $('[type="checkbox"][disabled], [type="radio"][disabled]', $(this).parent('.readonly'))
                    .attr('disabled', false);
                // for select2 with icon info
                $('[disabled]', $(this).closest('.input-group.readonly')).attr('disabled', false);
                // for select2 with icon info
                $('select[disabled]', $(this).parent('.readonly')).attr('disabled', false);
                // for table
                $(`[data-table-readonly="${$(this).parent('.readonly').find('table').attr('id')}"]`).attr('disabled', false)
                $('.table-readonly', $(this).parent('.readonly')).removeClass('.readonly.table-readonly');

                // final delete class readonly
                $(`button[form="${$DetailForm.attr('id')}"]`).removeClass('hidden')
                $(this).parent('.readonly').removeClass('readonly');
            });
        }
    },

    // CURRENCY handler
    valCurrency: function (returnType = null) { // returnType choice in ['string', 'number']
        if (!returnType) returnType = $(this).attr('data-return-type');
        let result = $(this).attr('value'); // don't change attr('value') to .val() !!!!
        if (!result) result = '0';
        switch (returnType) {
            case 'string':
                result = result.toString();
                break
            case 'number':
                result = parseFloat(result);
                break
            default:
                break
        }
        return result;
    },
    initMaskMoney2: function ($eleSelected = null, selectType = null) {
        // $eleSelected && selectType are required when apply Mask-Money for concrete element.
        // ELSE: apply all element have 'input.mask-money' & 'span.mask-money'
        let inputElement = $(document).find('input.mask-money');
        let spanElement = $(document).find('span.mask-money');
        if (inputElement.length > 0 || spanElement.length > 0) {
            $.fn.getCompanyCurrencyConfig().then((configData) => {
                let clsMaskMoney2 = new MaskMoney2(configData);
                if ($eleSelected && selectType) {
                    clsMaskMoney2.applyMaskMoney($($eleSelected), selectType)
                } else {
                    inputElement.map((idx, item) => clsMaskMoney2.applyMaskMoney($(item), 'input'));
                    spanElement.map((idx, item) => clsMaskMoney2.applyMaskMoney($(item), 'display'));
                }
            });
        }
    },

    // HTTP response, redirect, Ajax
    switcherResp: function (resp) {
        if (typeof resp === 'object') {
            let status = 500;
            if (resp.hasOwnProperty('status')) {
                status = resp.status;
            }
            switch (status) {
                case 200:
                    return resp.data
                case 201:
                    return resp.data
                case 204:
                    $.fn.notifyB({
                        'description': $('#msgSuccess').text()
                    }, 'success')
                    return {'status': status}
                case 400:
                    let mess = resp.data;
                    if (resp.data.hasOwnProperty('errors')) mess = resp.data.errors;
                    $.fn.notifyErrors(mess);
                    return {};
                case 401:
                    console.log(resp.data);
                    $.fn.notifyB({'description': resp.data}, 'failure');
                    return jQuery.fn.redirectLogin(500);
                // return {}
                case 403:
                    jQuery.fn.notifyB({'description': resp.data.detail}, 'failure');
                    return {};
                case 500:
                    return {};
                default:
                    return {};
            }
        }
    },
    cleanDataNotify: (data) => {
        if (data && typeof data === 'object' && data.hasOwnProperty('errors')) {
            data = data.errors;
            switch (typeof data) {
                case 'object':
                    ['status'].map((key) => {
                        delete data[key];
                    });
                    break;
                default:
                    data = {'': data.toString()}
            }
        } else {
            ['status'].map((key) => {
                delete data[key];
            });
        }
        return data;
    },
    redirectLogin: function (timeout = 0, location_to_next = true) {
        if (location_to_next === true) {
            jQuery.fn.redirectUrl('/auth/login', timeout, 'next=' + window.location.pathname);
        } else {
            jQuery.fn.redirectUrl('/auth/login', timeout, '');
        }

    },
    redirectUrl: function (redirectPath, timeout = 0, params = '') {
        setTimeout(() => {
            if (params && (params !== '' && params !== undefined)) {
                window.location.href = redirectPath + '?' + params;
            } else {
                window.location.href = redirectPath;
            }
        }, timeout);
    },
    callAjax: function (url, method, data, headers = {}) {

        return new Promise(function (resolve, reject) {
            let ctx = {
                url: url,
                type: method,
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(data),
                headers: {"X-CSRFToken": headers},
                success: function (rest, textStatus, jqXHR) {
                    let data = $.fn.switcherResp(rest);
                    if (data) resolve(rest);
                    else resolve({'status': jqXHR.status});
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    let resp_data = jqXHR.responseJSON;
                    if (resp_data && typeof resp_data === 'object') {
                        $.fn.switcherResp(resp_data);
                        reject(resp_data);
                    } else if (jqXHR.status === 204) reject({'status': 204});
                },
            };
            if (method.toLowerCase() === 'get') ctx.data = data
            $.ajax(ctx);
        });
    },

    // Table: loading
    showLoading: function (timeout) {
        $('#loadingContainer').removeClass('hidden');
        if (timeout) {
            setTimeout($.fn.hideLoading, (timeout > 100 ? timeout : 1000));
        }
    },
    hideLoading: function () {
        $('#loadingContainer').addClass('hidden');
    },
    getRowData: function () {
        // element call from in row of DataTable
        let row = $(this).closest('tr');
        return $($(this).closest('table')).DataTable().row(row).data();
    },
    groupDataFromPrefix: function (data, prefix) {
        let rs = {};
        Object.keys(data).map((key) => {
            if (key.startsWith(prefix)) {
                rs[key.split(prefix)[1]] = data[key]
            }
        })
        return rs;
    }

})

// support for Form Submit
class SetupFormSubmit {
    constructor(formSelected, urlDefault = null, urlRedirectDefault = null, dataMethodDefault = null) {
        // URL call API
        this.dataUrl = formSelected.attr('data-url');
        if (!this.dataUrl) this.dataUrl = urlDefault ? urlDefault : window.location.pathname;

        // METHOD call API
        this.dataMethod = formSelected.attr('data-method');
        if (!this.dataMethod) {
            if (dataMethodDefault) {
                this.dataMethod = dataMethodDefault
            } else {
                throw ('Data Method do not support! It is ' + this.dataMethod);
            }
        }

        // URL REDIRECT after success callback
        this.dataUrlRedirect = formSelected.attr('data-url-redirect');
        if (!this.dataUrlRedirect) this.dataUrlRedirect = urlRedirectDefault ? urlRedirectDefault : null;

        // REDIRECT TIMEOUT
        this.dataRedirectTimeout = formSelected.attr('data-redirect-timeout');
        if (!this.dataRedirectTimeout) this.dataRedirectTimeout = this.dataRedirectTimeout ? this.dataRedirectTimeout : 1000;

        // Data body get from form input
        this.dataForm = $.fn.serializerObject(formSelected);

        // URL DETAIL
        this.dataUrlDetail = formSelected.attr('data-url-detail');
        if (!this.dataUrlRedirect) this.dataUrlRedirect = urlRedirectDefault ? urlRedirectDefault : null;
        if (this.dataUrlDetail) {
            this.dataUrlDetail = this.dataUrlDetail.split("/").slice(0, -1).join("/") + "/";
        }
    }

    getCtxAjax() {
        return {
            url: this.dataUrl,
            method: this.dataMethod,
            data: this.dataForm,
            redirect: this.dataUrlRedirect,
            redirectTimeout: this.dataRedirectTimeout
        }
    }

    getUrlDetail(pk) {
        if (this.dataUrlDetail && pk) {
            return this.dataUrlDetail + pk.toString();
        }
        return null;
    }

    static getUrlDetailWithID(url, pk) {
        url = url.split("/").slice(0, -1).join("/") + "/";
        if (url && pk) {
            return url + pk.toString();
        }
        return null;
    }

    appendFilter(url, filter) {
        let params = '';
        Object.keys(filter).map((key) => {
            params += `{0}={1}`.format_by_idx(key, encodeURIComponent(filter[key]))
        })
        if (params) {
            return '{0}?{1}'.format_by_idx(url, params);
        }
        return url;
    }
}


// CURRENCY CLASS UTILS
class MaskMoney2 {
    static _beforeParseFloatAndLimit(strData) {
        let data = strData.replace(/^0+0+$/, "");
        if (data.indexOf('.') > -1 && data.length > 18) {
            return data.slice(0, 18);
        } else if (data.indexOf('.') === -1 && data.length > 17) {
            return data.slice(0, 17);
        }
        return data;
    }

    static focusInputMoney($ele) {
        return $($ele).val($($ele).attr('value'));
    }

    static blurInputMoney($eleSelected) {
        $.fn.getCompanyCurrencyConfig().then((configData) => {
            $($eleSelected).val(new MaskMoney2(configData).applyConfig($($eleSelected).attr('value')));
        });
    }

    static realtimeInputMoney($ele) {
        $($ele).attr(
            'value',
            parseFloat(
                MaskMoney2._beforeParseFloatAndLimit($($ele).val())
            )
        );
    }

    constructor(configData) {
        this.configData = configData;
    }

    applyConfig(strAttrValue) {
        let strDataParsed = parseFloat(strAttrValue);
        if (strAttrValue !== null && Number.isFinite(strDataParsed)) {
            strAttrValue = strDataParsed.toString();

            // apply mask-money config
            let prefix = this.configData?.['prefix'];
            let suffix = this.configData?.['suffix'];
            let decimal = this.configData?.['decimal'];
            let thousand = this.configData?.['thousands'];
            let precision = parseInt(this.configData?.['precision']);
            let parsedFloatData = parseFloat(MaskMoney2._beforeParseFloatAndLimit(strAttrValue));
            if (Number.isInteger(precision)) parsedFloatData = parseFloat(parsedFloatData.toFixed(precision));
            if (Number.isFinite(parsedFloatData)) {
                let result = '';
                let arrData = parsedFloatData.toString().split(".");
                if (arrData[0].length > 0) {
                    let rs = [];
                    arrData[0].split("").reverse().map((item, idx, {length}) => {
                        rs.push(item);
                        if (idx !== length - 1 && idx !== 0 && (idx + 1) % 3 === 0) rs.push(thousand ? thousand : "");
                    });
                    if (arrData.length === 2 && arrData[1].length > 0) {
                        result = rs.reverse().join("") + (decimal ? decimal : ".") + arrData[1];
                    } else result = rs.reverse().join("");
                }
                return (prefix ? prefix : "") + result + (suffix ? suffix : "");
            }
        }
    }

    applyMaskMoney($ele, inputOrDisplay) {
        // inputOrDisplay choice in ['input', 'display']
        switch (inputOrDisplay) {
            case 'input':
                $($ele).val(
                    this.applyConfig(
                        $($ele).attr('value')
                    )
                );
                break
            case 'display':
                $($ele).text(
                    this.applyConfig(
                        $($ele).attr('data-init-money')
                    )
                );
                break
            default:
                throw Error('strData must be required!')
        }
    }
}

// Extend and improvement base package
String.format = function () {
    // String.format("{0} : {1}", "Fullname", "Nguyen Van A") => "Fullname : Nguyen Van A"
    let s = arguments[0];
    for (let i = 0; i < arguments.length - 1; i++) {
        let reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
}
String.format_by_key = function () {
    let s = arguments[0];
    let objKey = arguments[1];
    Object.keys(objKey).forEach(function (key) {
        s = s.replace(new RegExp("\\{" + key + "\\}", "gm"), objKey[key]);
    });
    return s;
}

String.prototype.format_by_idx = function () {
    // argument of function start 0+ for fill to this
    // `<a href="{0}">{1}</a>`.format("http://...", "Tag a")
    // Return ==> `<a href="http://...">Tag A</a>`
    let s = this.toString();
    return s.replace(/\{(\d)\}/gm, (match, index) => arguments[index]);
}

String.prototype.format_url_with_uuid = function (uuid) {
    let s = this.toString();
    let reg = new RegExp(/([0-9])$/, "gm");
    s = s.replace(reg, uuid);
    return s;
}

String.prototype.format_by_key = function (objKey) {
    // objKey: Object Key-Value fill to this
    // `<a href="{href}">{title}</a>`.format_by_key({"href": "http://...", "title": "Tag A"})
    // Return ==> `<a href="http://...">Tag A</a>`
    let s = this.toString();
    Object.keys(objKey).forEach(function (key) {
        s = s.replace(new RegExp("\\{" + key + "\\}", "gm"), objKey[key]);
    });
    return s;
}

Array.prototype.convert_to_key = function (key = 'id') {
    if (Array.isArray(this)) {
        let objData = {};
        this.map((item) => {
            objData[item[key]] = item
        })
        return objData;
    }
    return {};
}

// -- Array Customize}
/**
 * common function for DataTable action
 */
var DataTableAction = {
    'delete': function (url, data, crf, row) {
        let div = jQuery('<div>');
        let $transElm = $('#trans-factory')
        let $content = '<div class="modal-dialog modal-dialog-centered"><div class="modal-content">' + `<div class="modal-header"><h5 class="modal-title">${$transElm.data('terms-mess_tit')}</h5></div>` + `<div class="modal-body"><p class="text-center">${$transElm.data('terms-mess')}</p></div>` + '<div class="modal-footer justify-content-between">' + `<button type="button" class="btn btn-primary" data-type="confirm">${$transElm.data('terms-config')}</button>` + `<button type="reset" class="btn btn-outline-primary" data-type="cancel">${$transElm.data('terms-cancel')}` + '</button></div></div></div>';
        div.addClass('modal fade')
        div.html($content)
        div.appendTo('body');
        div.modal('show');
        div.find('.btn').off().on('click', function (e) {
            if ($(this).attr('data-type') === 'cancel') div.remove();
            else {
                $.fn.callAjax(url, 'DELETE', data, crf)
                    .then((res) => {
                        if (res.hasOwnProperty('status')) {
                            div.modal('hide');
                            div.remove();
                            if ($(row).length)
                                $(row).closest('.table').DataTable().rows(row).remove().draw();
                            $.fn.notifyPopup(
                                {
                                    description: res?.data?.message ? res.data.message : 'Delete item successfully'
                                },
                                'success')
                        }
                    })
            }
        })
    },
    'status': function(stt){
        let html = '';
        const $baseTrans = $('#base-trans-factory')
        const listSys = {
            '0': $baseTrans.attr('data-draft'),
            '1': $baseTrans.attr('data-created'),
            '2': $baseTrans.attr('data-added'),
            '3': $baseTrans.attr('data-finish'),
            '4': $baseTrans.attr('data-cancel'),
        }
        html = `<span>${listSys[stt]}</span>`
        return html
    }
}
