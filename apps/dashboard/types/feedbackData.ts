export interface FeedbackMessageType {
  message: string;
  answer: string;
}

export interface FeedbackType {
  id: string;
  message: string;
  messages: FeedbackMessageType[];
}
