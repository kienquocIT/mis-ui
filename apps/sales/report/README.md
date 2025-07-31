# Advance Filter Module

## Features

### 1. Filter Groups
- Support for multiple filter groups connected by OR operators
- Each group contains multiple conditions connected by AND operators

### 2. Operator Types
The system supports different operators based on data types:

#### Text Fields (Type 1)
- IS (exact match)
- IS NOT (not equal)
- CONTAINS (case-insensitive)
- DOES NOT CONTAIN
- IS EMPTY (null check)
- IS NOT EMPTY

#### Select/Dropdown Fields (Type 5)
- IS
- IS NOT
- IS EMPTY
- IS NOT EMPTY

#### Numeric Fields (Type 6)
- '<' (less than)
- '>'  (greater than)
- d (less than or equal)
- e (greater than or equal)
- ` (not equal)
- = (equal)

### 3. Dynamic Property Loading
Properties are loaded dynamically based on:
- Application context (`currPageAppID`)
- Content type mapping for related fields
- Filter condition support flag

## Usage

### 1. Basic Setup

Include the required files in your template:

```html
<!-- Include the filter display area -->
{% include 'sales/advance_filter.html' with app_id=your_app_id %}

<!-- Include the modal dialogs -->
{% include 'sales/advance_filter_modal.html' with app_id=your_app_id %}

<!-- Include JavaScript files -->
<script src="{% static 'assets/sales/report/js/advance_filter/advance_filter_common.js' %}"></script>
<script src="{% static 'assets/sales/report/js/advance_filter/advance_filter_revenue.js' %}"></script>
```

### 2. URL Configuration

Set up the required URLs in your template:

```html
<div id="app-url-factory"
     data-app-prop-list="{% url 'your-app-property-list-url' %}"
     data-account-list="{% url 'your-account-list-url' %}">
</div>
```

### 3. Implementation Steps

#### Step 1: Extend the Base Handler
Create a specific handler for your module:

```javascript
class YourModuleFilterHandler extends AdvanceFilterCommonHandler {
    constructor() {
        super();
        // Define content type mappings
        this.CONTENT_TYPE_MAPPING_URL = {
            "your.model": {
                "url": $('#app-url-factory').data('your-model-list'),
                "keyResp": "model_list",
                "keyText": "name"
            }
        };
    }
    
    getPropUrl() {
        return $('#app-url-factory').data('app-prop-list');
    }
    
    getContentTypeMappingUrl(contentType) {
        return this.CONTENT_TYPE_MAPPING_URL[contentType];
    }
}
```

#### Step 2: Initialize the Handler
```javascript
$(document).ready(function () {
    const filterHandler = new YourModuleFilterHandler();
    filterHandler.getCurrPageAppID();
    filterHandler.addEventBinding();
    filterHandler.init();
    filterHandler.setUpFormCreateFilterSubmit();
    filterHandler.fetchDataFilterList();
    filterHandler.setUpFormUpdateFilterSubmit();
});
```

### 4. Creating Filters

#### User Workflow:
1. Click "Open Advance Filter" button
2. Enter a filter title
3. Build filter conditions:
   - Select property from dropdown
   - Choose operator based on property type
   - Enter/select value (disabled for null operators)
4. Add more conditions with "And" button (within same group)
5. Add new filter groups with "Add Group" button (OR relationship)
6. Save the filter

#### Visual Example:
```
Filter: Active Premium Customers

Group 1:
  - Account Type IS "Premium" AND
  - Status IS "Active"
  
OR

Group 2:
  - Revenue > 1000000 AND
  - Last Order Date >= "2024-01-01"
```

### 5. Managing Filters

#### Available Actions:
- **Select**: Click radio button to apply filter
- **Edit**: Click pencil icon to modify
- **Delete**: Click trash icon to remove
- **Deselect**: Click selected radio button again to clear

### 6. API Integration

The module expects these API endpoints:

#### Filter CRUD Operations:
- `GET /api/advance-filter/` - List all filters
- `POST /api/advance-filter/` - Create new filter
- `PUT /api/advance-filter/{id}/` - Update filter
- `DELETE /api/advance-filter/{id}/` - Delete filter

#### Supporting APIs:
- Application properties list
- Related model lists (based on content type)

### 7. Data Structure

#### Filter Condition Format:
```json
{
    "title": "Filter Name",
    "application": "app_id",
    "filter_condition": [
        [
            {
                "left": "property_id",
                "operator": "exact",
                "right": "value",
                "type": 1
            }
        ]
    ]
}
```

## Advanced Features

### 1. Custom Select2 Templates
The system supports custom result templates for dropdowns:
```javascript
{
    res1: "code",    // Badge display
    res2: "title"    // Main text
}
```

### 2. Type-based Input Switching
- Automatically switches between select and input based on property type
- Numeric validation for type 6 fields
- Dynamic operator list based on field type

### 3. Null Handling
- Special operators (exactnull, notexactnull) disable value input
- Automatic handling of empty/null checks

## Troubleshooting

### Common Issues:

1. **Properties not loading**
   - Check `currPageAppID` is set correctly
   - Verify API endpoint URLs
   - Ensure `is_filter_condition: true` parameter

2. **Operators not showing**
   - Verify property type is returned from API
   - Check COMPARE_OPERATOR_MAPPING configuration

3. **Values not populating**
   - Confirm content type mapping is defined
   - Check API response format matches expected keys

### Debugging Tips:
- Check browser console for AJAX errors
- Verify data attributes on select elements
- Use network tab to inspect API responses

## Customization

### Adding New Operator Types:
1. Add to `COMPARE_OPERATOR_MAPPING` in base class
2. Handle new operator in backend filter logic

### Supporting New Content Types:
1. Add mapping to `CONTENT_TYPE_MAPPING_URL`
2. Ensure API returns data in expected format

### Styling:
- Uses Bootstrap 5 classes
- Custom classes: `.filter-card`, `.filter-row`, `.filter-group-body`
- Icons from Font Awesome

## Best Practices

1. **Performance**
   - Limit filter complexity to avoid slow queries
   - Consider indexing filtered fields
   - Implement pagination for result sets

2. **User Experience**
   - Provide meaningful property names
   - Group related properties
   - Show property descriptions in tooltips

3. **Security**
   - Validate filter conditions server-side
   - Sanitize user inputs
   - Check user permissions for properties

4. **Maintenance**
   - Keep property definitions updated
   - Document custom operators
   - Test filter combinations regularly