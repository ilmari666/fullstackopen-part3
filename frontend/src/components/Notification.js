import React from 'react';
import '../css/notification.css';

const Notification = ({note, error}) => note ? <div className={error ? 'notification_error' : 'notification'}>{note}</div> : null;

export default Notification;
