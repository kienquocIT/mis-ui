function bell_new_one(){
    $('#idxNotifyBell').trigger('data.newOne');
}

function fcm_handle_message(payload, fromWorker = 'foreground') {
    console.log('fcm_handle_message:', payload);
    if (fromWorker === 'background') {
        // if (payload.notification) {
        //     const notification = payload?.['notification'];
        //     if (notification && self.registration) {
        //         const title = notification?.title || '';
        //         const body = notification?.body || '';
        //         const notificationOptions = {
        //             body: body,
        //             icon: '/static/assets/images/brand/bflow/png/icon/icon-bflow-original-36x36.png'
        //         };
        //
        //         self.registration.showNotification(
        //             title,
        //             notificationOptions
        //         );
        //     }
        // }
    } else if (fromWorker === 'foreground'){
        if (payload.notification) {
            const notification = payload?.['notification'];
            const title = notification?.['title'];
            const body = notification?.['body'];
            bell_new_one();
            $.fn.notifyB({
                'title': title,
                'description': body,
            }, 'alert');
        }
    }
}