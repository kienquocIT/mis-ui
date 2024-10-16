from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.log.models import TicketLog
from apps.log.tasks import ticket_push_notify


@receiver(post_save, sender=TicketLog)
def ticket_object(sender, instance, created, **kwargs):
    ticket_push_notify.apply_async(args=[str(instance.id)], countdown=30)
