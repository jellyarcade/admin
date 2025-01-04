export interface Category {
  _id: string;
  name: {
    tr: string;
    en: string;
  };
  slug: {
    tr: string;
    en: string;
  };
  description?: {
    tr: string;
    en: string;
  };
  keywords?: {
    tr: string[];
    en: string[];
  };
  parent: string | null;
  image?: string;
  order: number;
  isNewGames: boolean;
  isMostPlayed: boolean;
}
