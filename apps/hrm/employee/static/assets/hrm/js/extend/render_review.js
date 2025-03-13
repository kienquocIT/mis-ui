function splitIntoPages(parent = null) {
    const content = document.getElementById("content");
    const pageHeight = 1123 - 96; // Trừ padding
    let currentHeight = 0;

    let pagesContainer = document.createElement("div");
    let currentPage = document.createElement("div");
    currentPage.classList.add("sheet");
    pagesContainer.appendChild(currentPage);

    let elements = Array.from(content.children);

    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let ElmStyle = window.getComputedStyle(element);

        // Nếu phần tử là bảng
        if (element.tagName === "TABLE") {
            // gán phần tử bảng cho biến table, khai báo thead và rows
            let table = element;
            let thead = table.querySelector("thead") ? table.querySelector("thead").outerHTML : '';
            let rows = Array.from(table.querySelectorAll("tbody tr"));

            // khai báo một element table mới
            let newTable = document.createElement("table");
            newTable.innerHTML = thead;
            let newTbody = document.createElement("tbody");
            newTable.appendChild(newTbody);
            // cộng chiều dài của head khi tạo table mới
            if (table.querySelector("thead"))
                currentHeight += table.querySelector("thead").offsetHeight
            currentPage.appendChild(newTable);

            for (let j = 0; j < rows.length; j++) {
                let row = rows[j];
                let rowHeight = row.offsetHeight;

                if ((currentHeight + rowHeight) > pageHeight) {
                    // Tạo trang mới nếu hàng tiếp theo vượt quá trang
                    currentPage = document.createElement("div");
                    currentPage.classList.add("sheet");
                    pagesContainer.appendChild(currentPage);

                    // Bắt đầu một bảng mới trên trang mới
                    newTable = document.createElement("table");
                    // newTable.innerHTML = thead;
                    newTbody = document.createElement("tbody");
                    newTable.appendChild(newTbody);
                    currentPage.appendChild(newTable);

                    currentHeight = 0;
                }

                newTbody.appendChild(row);
                currentHeight += rowHeight;
            }
        }
        else {
            let elementHeight = element.offsetHeight +
                parseInt(ElmStyle.marginBottom.replace('px', ''));

            if (currentHeight + elementHeight > pageHeight) {
                // nếu chiều dài content vượt quá kích thước A4 format lại current page và current height
                currentPage = document.createElement("div");
                currentPage.classList.add("sheet");
                pagesContainer.appendChild(currentPage);
                currentHeight = 0;
            }

            currentPage.appendChild(element);
            currentHeight += elementHeight;
        }
    }

    if (parent){
        const $Element = document.querySelector(parent);
        $Element.innerHTML = "";
        $Element.appendChild(pagesContainer);
    }
}