import { from } from 'rxjs';

export interface NotificationPayload {
  userId: number | number[];
  fromUserId?: number;
  type: string;
  content?: string;
  relatedPostId?: number;
  relatedEventId?: number;
}

export interface SingleNotificationPayload extends NotificationPayload {
  userId: number;
}
