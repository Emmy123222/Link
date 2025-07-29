export interface CardProps {
  badge?: string
  badgeIcon?: React.ReactNode
  image?: React.ReactNode
  title: string
  children: React.ReactNode
  onClick?: () => void
}

export interface Card {
  created_at: Date;
  description: string;
}
