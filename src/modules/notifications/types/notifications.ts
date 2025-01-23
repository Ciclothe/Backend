export interface NotificationPayload {
  userId: string | string[];
  fromUserId?: string;
  type: string;
  content: string;
  relatedPostId?: string;
  relatedEventId?: string;
}

export interface SingleNotificationPayload extends NotificationPayload {
  userId: string;
}

export enum NotificationType {
  LIKE = 'New like on your publication',
  COMMENT = 'New comment on your publication',
  FOLLOW = 'has started following you',
  EVENT = 'has created a new event',
  SWAP = 'has offered a swap',
}