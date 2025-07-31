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

Include the required files in your template (example for revenue report):

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

Required for every template:
This url used for loading left dropdown data 
```html
data-app-prop-list = "{% url 'ApplicationPropertyListAPI' %}"
```

Can adjust based on feature:  
This url used for loading right dropdown data

```html
data-account-list="{% url 'your-account-list-url' %}">
```

<br/>
Tổng hợp;

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
                "url": $('#app-url-factory').data('xxx'),
                "keyResp": "xxx",
                "keyText": "xxx"
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

#### Example for revenue report:
```javascript
class AdvanceFilterRevenueCommonHandler extends AdvanceFilterCommonHandler{
    constructor() {
        super();
        this.$url = $('#app-url-factory')
        this.CONTENT_TYPE_MAPPING_URL = {
            "saledata.account": {
                "url": $('#app-url-factory').data('account-list'),
                "keyResp": "account_list",
                "keyText": "title"
            },
        }
    }

    getPropUrl() {
        return this.$url.data('app-prop-list')
    }

    getContentTypeMappingUrl(contentType) {
        return this.CONTENT_TYPE_MAPPING_URL[contentType]
    }

    clearDataFormCreateFilter() {
        super.clearDataFormCreateFilter();
        this.init()
    }
}


$(document).ready(function () {
    const advanceFilterRevenueCommonHandler = new AdvanceFilterRevenueCommonHandler();
    advanceFilterRevenueCommonHandler.getCurrPageAppID()
    advanceFilterRevenueCommonHandler.addEventBinding()
    advanceFilterRevenueCommonHandler.init()

    advanceFilterRevenueCommonHandler.setUpFormCreateFilterSubmit()
    advanceFilterRevenueCommonHandler.fetchDataFilterList()

    advanceFilterRevenueCommonHandler.setUpFormUpdateFilterSubmit()
})
```

### 4. API Integration

The module expects these API endpoints:

#### Filter CRUD Operations:
- `GET /api/advance-filter/` - List all filters
- `POST /api/advance-filter/` - Create new filter
- `PUT /api/advance-filter/{id}/` - Update filter
- `DELETE /api/advance-filter/{id}/` - Delete filter

### 5. Data Structure

#### Filter Condition Format:
DATA_PROPERTY_TYPE = (  
    (1, 'Text'),  
    (2, 'Date time'),  
    (3, 'Choices'),  
    (4, 'Checkbox'),  
    (5, 'Master data'),  
    (6, 'Number'),  
)
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
