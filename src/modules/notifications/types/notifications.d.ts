import { from } from 'rxjs';

export interface NotificationPayload {
  userId: number;
  fromUserId?: number;
  type: string;
  content: string;
  relatedPostId: number;
}
