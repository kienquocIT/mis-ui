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
    has_opp: true,
    has_inherit: true,
    has_process: true,
    has_prj: true,
    
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
    "oppFlagData": {"disabled": true},
    "prjFlagData": {"disabled": true},
    "inheritFlagData": {"disabled": true},
    "processFlagData": {"disabled": true},
    "processStageAppFlagData": {"disabled": true},
    // -- Thêm dành chi chi tiết muốn vô hiệu hoá các trường dữ liệu
    
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
