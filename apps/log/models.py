from uuid import uuid4

from django.db import models
from django.utils import timezone

from apps.core.account.models import User

__all__ = [
    'TicketLog',
    'TicketLogAttachments',
]


class TicketLog(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    code = models.CharField(max_length=36, unique=True)
    user = models.ForeignKey(
        User,
        null=True,
        on_delete=models.CASCADE,
        verbose_name=''
    )
    user_info = models.JSONField(default=dict)

    email = models.TextField()
    location_raise = models.TextField()

    email_input = models.TextField()
    location_raise_input = models.TextField()

    title = models.TextField()
    remarks = models.TextField()
    hash_tags = models.TextField()

    resolve_state = models.BooleanField(default=False)

    date_created = models.DateTimeField(verbose_name='date created', default=timezone.now, editable=False)

    def __str__(self):
        return f'{str(self.user)} - {self.title}'

    class Meta:
        verbose_name = 'Ticket Log'
        verbose_name_plural = 'Ticket Log'
        ordering = ('-date_created',)
        default_permissions = ()
        permissions = ()


class TicketLogAttachments(models.Model):
    id = models.UUIDField(default=uuid4, primary_key=True, editable=False)
    ticket = models.ForeignKey(TicketLog, on_delete=models.CASCADE)
    img = models.FileField(upload_to='ticket')

    date_created = models.DateTimeField(verbose_name='date created', default=timezone.now, editable=False)

    class Meta:
        verbose_name = 'Attachments of Ticket'
        verbose_name_plural = 'Attachments of Ticket'
        ordering = ('-date_created',)
        default_permissions = ()
        permissions = ()
