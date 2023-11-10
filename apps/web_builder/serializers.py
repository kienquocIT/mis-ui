from rest_framework import serializers


class WebDesignUpdateSerializer(serializers.Serializer):  # noqa
    page_html = serializers.CharField()
    page_css = serializers.CharField()
    page_js = serializers.CharField(allow_blank=True)
