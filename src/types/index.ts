export type AnimalCategory = 'Farm' | 'Pond' | 'Woodland' | 'Urban';

export interface AnimalCatalogItem {
  id: string;
  commonName: string;
  category: AnimalCategory;
  emoji: string;
  suggestedSnack: string;
  suggestedSnacks: string[];
  defaultLocation: string;
  imageUrl?: string;
}

export interface TrackedAnimal {
  id: string;
  speciesId: string;
  speciesName: string;
  category: AnimalCategory;
  emoji: string;
  status: 'pending' | 'fed';
  givenName: string | null;
  fullTitle: string | null;
  snackGiven: string | null;
  suggestedSnack?: string | null;
  interactionType?: 'fed' | 'pet' | 'both';
  fedAt: string | null;
  fedBy?: string | null;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  photoUrl?: string | null;
  rating?: number;
  isFavorite?: boolean;
  notes?: string | null;
  portion?: string | null;
}

export type ActiveTab = 'hungry' | 'barnyard';
