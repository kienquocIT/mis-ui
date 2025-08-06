$(document).ready(function () {

    const ele$ = $('#modalSearchMenu');
    const inp$ = ele$.find('.form-control-search');
    const data$ = ele$.find('.data-list');
    const dataFavorite$ = ele$.find('.data-favorite');

    let menusData = {};

    class MenuFavorite {
        static menusFavoriteData = [];

        static getFavorite() {
            if (localStorage) {
                MenuFavorite.menusFavoriteData = JSON.parse(
                    localStorage.getItem('menu_favorite') ?? `[]`
                );
            }
            return MenuFavorite.menusFavoriteData;
        }

        static hasInFavorite(item) {
            return MenuFavorite.menusFavoriteData.filter(itemChild => itemChild.url === item.url).length > 0;
        }

        static setFavorite(item) {
            if (localStorage) {
                const exist = MenuFavorite.menusFavoriteData.filter(itemChild => itemChild.url === item.url);
                if (exist.length === 0) {
                    MenuFavorite.menusFavoriteData.push(item);
                    localStorage.setItem('menu_favorite', JSON.stringify(MenuFavorite.menusFavoriteData));
                }
            }
        }

        static removeFavorite(item) {
            if (localStorage) {
                MenuFavorite.menusFavoriteData = MenuFavorite.menusFavoriteData.filter(itemChild => itemChild.url !== item.url);
                localStorage.setItem('menu_favorite', JSON.stringify(MenuFavorite.menusFavoriteData));
            }
        }

        static render(searchTxt){
            const eleNew$ = renderChild(
                searchTxt && searchTxt != "" ? MenuFavorite.menusFavoriteData.filter(
                    item => item.name.toLowerCase().indexOf(searchTxt) !== -1 || item.name_i18n.toLowerCase().indexOf(searchTxt) !== -1
                ) : MenuFavorite.menusFavoriteData
            );
            dataFavorite$.empty().append(eleNew$);
        }
    }

    function removeVietnameseTones(str) {
        return str.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // remove diacritics
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    }

    function searchMenus(data, keyword) {
        const result = {};

        const cleanKeyword = removeVietnameseTones(keyword.toLowerCase());

        function searchInMenu(menu) {
            return menu.filter(item => {
                const name = removeVietnameseTones(item.name?.toLowerCase() || "");
                const name_i18n = removeVietnameseTones(item.name_i18n?.toLowerCase() || "");

                const isMatch = name.includes(cleanKeyword) || name_i18n.includes(cleanKeyword);

                const matchingChildren = searchInMenu(item.child || []);
                if (matchingChildren.length > 0) {
                    item.child = matchingChildren;
                }

                return isMatch || matchingChildren.length > 0;
            });
        }

        for (const key in data) {
            const filteredMenus = searchInMenu(data[key]);
            if (filteredMenus.length > 0) {
                result[key] = filteredMenus;
            }
        }

        return result;
    }

    function renderMenus(data) {
        data$.empty();
        Object.keys(data).map(
            key => {
                const menusChild$ = renderChild(data[key]);
                const tag$ = $(`<div class="w-100">${key.replaceAll("-", " ").toUpperCase()}</div>`).append(menusChild$);
                data$.append(tag$);
            }
        )
    }

    function renderChild(dataList, marginLeft = 1) {
        const eleItemChild$ = $(`<div class="w-100" style="padding-left: ${marginLeft * 30}px"></div>`);
        dataList.map(
            item => {
                let eleChild$ = $(``);
                if (typeof item.url === 'string' && item.url.length > 0 && item.url !== '#') {
                    let star$ = '';
                    if (MenuFavorite.hasInFavorite(item)) {
                        star$ = $(`<span class="text-warning mr-3"><i class="fa-solid fa-star"></i></span>`);
                        star$.on('click', function () {
                            console.log('item:', item);
                            MenuFavorite.removeFavorite(item);
                            MenuFavorite.render();
                            renderMenus(menusData);
                        })
                    } else {
                        star$ = $(`<span class="text-light mr-3"><i class="fa-regular fa-star"></i></span>`);
                        star$.on('click', function () {
                            MenuFavorite.setFavorite(item);
                            MenuFavorite.render();
                            renderMenus(menusData);
                        })
                    }

                    eleChild$ = $(`<div class="w-100"></div>`).append(star$).append(`
                        <a href="${item.url}" class="w-100">
                            ${item.icon}
                            ${item.name_i18n}
                            <small class="text-light">${item.name}</small>
                        </a>
                    `);
                } else {
                    eleChild$ = $(`
                        <div class="w-100">
                            ${item.icon}
                            ${item.name}
                        </div>
                    `);
                }
                let item$ = $(`<div class="w-100"></div>`);
                eleChild$.attr('menuData', item);
                item$.append(eleChild$);

                if (item.child.length > 0) {
                    const child$ = renderChild(item.child, marginLeft + 1);
                    item$.append(child$);
                }

                eleItemChild$.append(item$);
            }
        );
        return eleItemChild$;
    }

    function renderSearch(txt) {
        data$.empty();
        if (txt && txt !== "") {
            const dataFiltered = searchMenus(menusData, txt);
            renderMenus(dataFiltered);
        } else {
            renderMenus(menusData);
        }
    }

    let keyDebouncing = null;
    inp$.on('input', function () {
        const txt = $(this).val();
        if (keyDebouncing) clearTimeout(keyDebouncing);
        keyDebouncing = setTimeout(
            () => {
                renderSearch(txt);
                MenuFavorite.render(txt);
            },
            300
        );
    })

    ele$.find('.dropdown-toggle').on('click', function (e) {
        e.preventDefault(); // tránh submit form
        e.stopPropagation(); // tránh Bootstrap đóng ngay

        $.fn.callAjax2({
            url: ele$.data('url'),
            method: 'GET',
            isLoading: true,
            cache: true,
        }).then(resp => {
            const data = $.fn.switcherResp(resp);
            if (data && data.hasOwnProperty('menus')) {
                MenuFavorite.getFavorite();
                MenuFavorite.render();
                menusData = data['menus'];
                renderMenus(menusData);

                // Mở dropdown sau khi có data
                bootstrap.Dropdown.getOrCreateInstance(ele$.find('.dropdown-toggle')[0]).show();
            }
        });
    });



})
