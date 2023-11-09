import json

from django import template
from django.urls import reverse

register = template.Library()


@register.filter(name='render_tree_page')
def render_tree_page(value):
    result = []
    if isinstance(value, list):
        for item in value:
            state_of_page = "success" if item['is_publish'] is True else "danger"
            url = reverse('WebsiteDetailDesign', kwargs={'pk': item['id']})
            result.append(
                f"""
                <li>
                    <span class="page-item badge badge-soft-success" data-id="{item['id']}">{item['title']}</span>
                    <span class="badge badge-xs badge-soft-secondary" style="text-transform: unset;">
                        {item['page_path']}
                    </span>
                    <span class="badge badge-{state_of_page} badge-indicator badge-indicator-lg"></span>
                    <a class="btn btn-xs btn-flush-primary open-page-design" href="{url}" target="_blank">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <script type="application/json" class="hidden page-item-data">{json.dumps(item)}</script>
                </li>
            """
            )

    return "".join(result)
