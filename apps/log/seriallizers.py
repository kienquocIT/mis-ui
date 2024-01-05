from rest_framework import serializers

from apps.log.models import TicketLog, TicketLogAttachments

__all__ = [
    'TicketErrorCreateSerializer',
]

from apps.shared import RandomGenerate


class TicketErrorCreateSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user_obj = self.context.get('user_obj', None)
        attachments = self.context.get('attachments', [])

        # create ticket
        obj = TicketLog.objects.create(
            **validated_data, code=RandomGenerate.get_string(length=36), user=user_obj, user_info={
                'id': str(user_obj.id),
                'first_name': str(user_obj.first_name),
                'last_name': str(user_obj.last_name),
                'username_auth': str(user_obj.username_auth),
                'username': str(user_obj.username),
                'email': str(user_obj.email),
                'phone': str(user_obj.phone),
                'dob': str(user_obj.dob),
                'gender': str(user_obj.gender),
                'language': str(user_obj.language),
                'is_admin_tenant': str(user_obj.is_admin_tenant),
                'tenant_current_data': str(user_obj.tenant_current_data),
                'company_current_data': str(user_obj.company_current_data),
                'space_current_data': str(user_obj.space_current_data),
                'employee_current_data': str(user_obj.employee_current_data),
                'companies_data': str(user_obj.companies_data),
                'last_login': str(user_obj.last_login),
                'ui_space_selected': str(user_obj.ui_space_selected),
            }
        )

        # create ticket images
        img = []
        for x in attachments:
            img.append(
                TicketLogAttachments(
                    ticket=obj,
                    img=x
                )
            )
        TicketLogAttachments.objects.bulk_create(img)
        return obj

    class Meta:
        model = TicketLog
        fields = (
            'email', 'location_raise', 'email_input', 'location_raise_input', 'title', 'remarks', 'hash_tags',
        )
