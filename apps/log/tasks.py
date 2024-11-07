import json

from celery import shared_task
from apps.log.models import TicketLog, TicketLogAttachments
from apps.shared.push_notify import TeleBotPushNotify


@shared_task
def ticket_push_notify(ticket_id):
    ticket_obj = TicketLog.objects.get(pk=ticket_id)
    msg = TeleBotPushNotify.generate_msg(
        idx=str(ticket_obj.id),
        status='INFO',
        group_name='TICKET',
        title=str(ticket_obj.title),
        remarks=str(ticket_obj.remarks),
        hash_tags=str(ticket_obj.hash_tags),
        date_created=str(ticket_obj.date_created),
        email=str(ticket_obj.email),
        location_raise=str(ticket_obj.location_raise),
        # user_info=json.dumps(ticket_obj.user_info, indent=4),
    )
    TeleBotPushNotify().send_msg(msg=msg)
    for instance in TicketLogAttachments.objects.filter(ticket=ticket_obj):
        if instance.ticket and instance.img:
            TeleBotPushNotify().send_photo(
                f_path=instance.img.path,
                caption=f'{str(instance.ticket_id)}:{str(instance.ticket.title)}',
            )
