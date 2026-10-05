export interface Post {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
  calendarEventIds?: string[]; // N - N relationship with CalendarEvent
}

