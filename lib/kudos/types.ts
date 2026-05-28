export interface UserInfo {
  id: string;
  name: string;
  avatar: string | null;
  department?: string | null;
}

export interface KudosPost {
  id: string;
  sender: UserInfo | null;
  anonymous_name: string | null;
  recipient: UserInfo;
  badge: string;
  content: string;
  hashtags: string[];
  images: string[];
  created_at: string;
  like_count: number;
  liked_by_me: boolean;
  recipient_kudos_count: number;
}
