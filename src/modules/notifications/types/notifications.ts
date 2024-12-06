export interface NotificationPayload {
  userId: number | number[];
  fromUserId?: number;
  type: string;
  content: string;
  relatedPostId?: number;
  relatedEventId?: number;
}

export interface SingleNotificationPayload extends NotificationPayload {
  userId: number;
}

export enum NotificationType {
  LIKE = 'New like on your publication',
  COMMENT = 'New comment on your publication',
  FOLLOW = 'has started following you',
  EVENT = 'has created a new event',
  SWAP = 'has offered a swap',
}