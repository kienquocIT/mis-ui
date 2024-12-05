### Hướng dẫn chính

1. Sử dụng tệp HTML `extends/the-documents/bastion.html` để thêm HTML Process với tuỳ chọn `has_process=True`
2. Sử dụng class ở `$x.cls.bastionField` để tuỳ chỉnh các dữ liệu trên BastionField
3. Tham khảo các bước khởi tạo mặc định truờng `BastionField` ở tệp js `assets/js/extends/the-documents/auto-init-with-parameters.js`
4. Tuyệt đối không `trigger('change')` các trường dữ liệu trong `BastionField` sau khi khởi tạo vì `BastionField` lắng nghe `on('change')` để thực hiện xử lý logic dữ liệu giữa `Opp-Process-Inherit`
5. Muốn gọi `change` sau khi khởi tạo thì gọi `opp_call_trigger_change`, `prj_call_trigger_change`, `inherit_call_trigger_change`, `process_call_trigger_change` gán giá trị `= true` trong hàm khởi tạo `$x.cls.bastionField(...)`
6. Hoặc `trigger('change')` với dữ liệu `skipBastionField`, ví dụ `$('#opp_id').trigger('change', BastionFieldControl.skipBastionChange)` sẽ bỏ qua các xử lý của `BastionField`
7. Hạn chế sử dụng `event.preventDefault()` cho các `on('change')` của các trường trong `BastionField`.
8. Không nên gọi khởi tạo `$x.cls.bastionField` nhiều hơn 1 lần!

---

### Code cơ bản

```javascript
// Lấy các dữ liệu trên paramter -> trường hợp auto fill dữ liệu khi load page tạo
const {
    opp_id,
    opp_title,
    opp_code,
    process_id,
    process_title,
    process_stage_app_id,
    process_stage_app_title,
    inherit_id,
    inherit_title,
} = $x.fn.getManyUrlParameters([
    'opp_id', 'opp_title', 'opp_code',
    'process_id', 'process_title',
    'process_stage_app_id', 'process_stage_app_title',
    'inherit_id', 'inherit_title',
])

new $x.cls.bastionField({
    // has_opp: true,  // deprecated
    // has_inherit: true,  // deprecated
    // has_process: true,  // deprecated
    // has_prj: true,  // deprecated
    // has_* sẽ tự động check theo sự có mặt của thẻ select trong DOM HTML.
    
    // Dữ liệu ứng dụng cần thiết để bastionField hoạt động, thay thế `{{ ... }}` khi gọi trong JS vì `{{...}}` là templateTag của Django HTML.
    list_from_app: "{{ data.list_from_app }}",  // [*] set mã list_from_app cho bastionField hoạt động
    app_id: "{{ data.app_id }}",  // [*] set app_id cho bastionField hoạt động
    
    // Ghi đè hoặc khai báo các element | không khai báo sẽ có giá trị mặc định từ `extends/the-documents/bastion.html`
    mainDiv: group$,  // [jQuery] Element bao bọc tất cả các thẻ select
    oppEle: group$.find(':input[name=opportunity_id]'),  // Tìm trong mainDiv thẻ `:input` khớp với Opp 
    prjEle: group$.find(':input[name=project_id]'),  // Tìm trong mainDiv thẻ `:input` khớp với Project 
    empInheritEle: group$.find(':input[name=employee_inherit_id]'),   // Tìm trong mainDiv thẻ `:input` khớp với Inheritor
    processEle: group$.find(':input[name=processX]'),  // Tìm trong mainDiv thẻ `:input` khớp với Process
    processStageAppEle$: group$.find(':input[name=processStageAppX]'),   // Tìm trong mainDiv thẻ `:input` khớp với Process Stage App
    
    // Thêm dành cho việc load dữ liệu chọn sẵn 
    // Dữ liệu có thể lấy từ paramter hoặc doc detail. (Ví dụ là lấy từ paramter)
    data_opp: $x.fn.checkUUID4(opp_id) ? [
        {
            "id": opp_id,
            "title": $x.fn.decodeURI(opp_title),
            "code": $x.fn.decodeURI(opp_code),
            "selected": true,
        }
    ] : [],
    data_process: $x.fn.checkUUID4(process_id) ? [
        {
            "id": process_id,
            "title": process_title,
            "selected": true,
        }
    ] : [],
    data_process_stage_app: $x.fn.checkUUID4(process_stage_app_id) ? [
        {
            "id": process_stage_app_id,
            "title": process_stage_app_title,
            "selected": true,
        }
    ] : [],
    data_inherit: $x.fn.checkUUID4(inherit_id) ? [
        {
            "id": inherit_id,
            "full_name": inherit_title,
            "selected": true,
        }
    ] : [],
    // -- Thêm dành cho việc load dữ liệu chọn sẵn
    
    // Thêm dành chi chi tiết muốn vô hiệu hoá các trường dữ liệu
    // Sử dụng `disabled` khi muốn loại bỏ dữ liệu khỏi Form
    // Sử dụng readonly khi muốn không cho thay đổi dữ liệu sau khi init
    "oppFlagData": {"disabled": true, "readonly": true},
    "prjFlagData": {"disabled": true, "readonly": true},
    "inheritFlagData": {"disabled": true, "readonly": true},
    "processFlagData": {"disabled": true, "readonly": true},
    "processStageAppFlagData": {"disabled": true, "readonly": true},
    // -- Thêm dành chi chi tiết muốn vô hiệu hoá các trường dữ liệu
    
    
    // nếu `data` có trong `*FlagData` thì nó sẽ override dữ liệu từ `data_*`
}).init();
```

Đọc thêm các option khác ở class `assets/js/extends/the-documents/bastion_field.js` tại hàm `BastionFieldControl.constructor`

---

### Tạo mới
- Sử dụng bước khởi tạo BastionField tương tự như trong `assets/js/extends/the-documents/auto-init-with-parameters.js`
- Bước gửi `form data` lên server nên sử dụng `$(form).serializeObject()` để lấy dữ liệu trong `form` - đã bao gồm input name chứa `process` và `process_stage_app`

---

### Tải lại chi tiết phiếu có process
- Sử dụng lớp `$x.cls.bastionField` để khởi tạo các trường dữ liệu với tuỳ chỉnh đưa nội dung vào ở các trường `data_opp`, `data_process`, `data_process_stage_app`, `data_inherit`
- Có thể bật disable các thẻ thông qua tuỳ chỉnh của `$x.cls.bastionField`, ví dụ disabled trường Opp như sau `oppFlagData={"disabled": true}`


---

### Thêm giá trị `app_id` vào context render view để bastion gửi `app_id` khi gọi lên server check process app.
```python
class XView(View):
    @mask_view(...)
    def get(self, request, *args, **kwargs):
        ctx = {}
        ...
        ctx['list_from_app'] = 'base.application.create'   # sử dụng khi có sử dụng Opp
        ctx['app_id'] = '{APP_ID_IN_TABLE_BASE_APPLICATION}' 
        return ctx, status.HTTP_200_OK
```

---

## Tuỳ chỉnh trường select tuỳ chọn

1. Chỉ cần tạo `select` rỗng không cần điền các dữ liệu ajax `<select class="form-control" name="inheritorX"></select>`
2. Sau đó sử dụng jQuery Object `$('[name=inheritorX]')` truyền vào khi init để chỉ định element sử dụng bởi các trường `oppEle` `prjEle` `empInheritEle` `processEle` `processStageAppEle$`
3. Nên tuân thủ nguyên tắc `form-group` cho từng `select` để thư viện hoạt động tốt!
    ```html
    <div class="form-group">
        <label class="form-label" for="inp-inherit-x">Inherit</label>
        <select class="form-select" name="inheritorX" id="inp-inherit-x"></select>
    </div>
    ```
