# Attachments app

---

Lịch sử phiên bản tài liệu (Document Revision History)
- ...
- 2023-12-27: Khởi tạo tài liệu
    ```text
    Mô tả việc ứng dụng components Attachment vào chức năng!
    ```

---

### Áp dụng component Attachment

1. Đối với HTML
- [files/all.html](http://git.mtsolution.com.vn/mts/mis/mis-ui/-/blob/sit/templates/extends/files/all.html)
```html

{% include 'extends/files/all.html' with id="attachment" %}
```
2. Đối với JS
- [init-setup.js/FileControl.init()](http://git.mtsolution.com.vn/mts/mis/mis-ui/-/blob/sit/statics/assets/js/init-setup.js#L3833)
- [attachment.Files.get_detail()](http://git.mtsolution.com.vn/mts/mis/mis-api/-/blob/sit/apps/core/attachments/models.py#L109)
```javascript
// INIT
new $x.cls.file($('#attachment')).init({'name': 'attachment'});

// $('#attachment') : là thẻ bao ngoài của {% include ... %} hoặc ID của chính nó!
// Init Opts:
//      name [str]: Tên thả input sẽ được tạo -> nằm trong form thì form sẽ serializer được tên input này!
//      enable_edit [bool] (default: True): Được chỉnh sửa
//      data [list-object] (default: []): Tập tin có sẵn của phiếu trước đó, mỗi item ở API là attachments.Files...[0].get_detail()
//      ... Xem thêm tại class FileControl.init()
```
```javascript
// GET DATA
$x.cls.file.get_val(formData.attachment, [])

// formData.attachment: lấy được val() của thẻ input đã khai báo lúc init - bằng formData hoặc $('input[name="attachment"]').val() đều được.
// --> return về danh sách ID của attachment đã sử dụng!
```

---