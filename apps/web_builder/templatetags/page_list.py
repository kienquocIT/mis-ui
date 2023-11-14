import json

from django import template
from django.urls import reverse

register = template.Library()


@register.simple_tag(name='render_tree_page', takes_context=True)
def render_tree_page(context, page_list, page_viewer_domain):
    def resolve_page_path_reverse(_path):
        if _path == "/":
            return ""

        if _path.startswith("/"):
            return _path[1:]

        return _path

    def result_full_path(_main_path):
        if page_viewer_domain != '#':
            return page_viewer_domain + _main_path
        return '#'

    result = []
    if isinstance(page_list, list):
        for item in page_list:
            state_of_page = "success" if item['is_publish'] is True else "danger"
            url = reverse('WebsiteDetailDesign', kwargs={'pk': item['id']})
            url_view = result_full_path(
                reverse(
                    'CompanyWebsitePathView', kwargs={'path_sub': resolve_page_path_reverse(item['page_path'])}
                )
            )
            result.append(
                f"""
                <li>
                    <span class="page-item badge badge-soft-success" data-id="{item['id']}">{item['title']}</span>
                    <span class="badge badge-xs badge-soft-secondary" style="text-transform: unset;">
                        {item['page_path']}
                    </span>
                    <span class="badge badge-{state_of_page} badge-indicator badge-indicator-lg"></span>
                    <a class="btn btn-xs btn-flush-primary open-page-design" href="{url}" target="_blank">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </a>
                    <a class="btn btn-xs btn-flush-primary open-page-design" href="{url_view}" target="_blank">
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    <script type="application/json" class="hidden page-item-data">{json.dumps(item)}</script>
                </li>
            """
            )

    return "".join(result)
