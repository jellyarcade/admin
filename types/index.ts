export interface Game {
  _id: string;
  title: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
  keywords: {
    tr: string[];
    en: string[];
  };
  categories: Category[];
  instantLink: string;
  image: string;
  isShowcased: boolean;
  playCount: number;
  isNew: boolean;
  isPopular: boolean;
  isActive: boolean;
  order: number;
  orientation: 'horizontal' | 'vertical';
  createdAt: string;
  updatedAt: string;
}

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
  order: number;
  parent: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
