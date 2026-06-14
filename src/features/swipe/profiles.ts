/**
 * Sample swipe candidates for the Phase 0 deck. Real feed (the fair-matching
 * algorithm in the Fastify worker, Spec §6) arrives in Phase 2; these let the
 * deck look and feel real now. Face photos via pravatar (deterministic by id).
 */
export interface Candidate {
  id: string;
  name: string;
  age: number;
  distanceKm: number;
  photo: string;
  interests: string[];
  bio: string;
}

const photo = (n: number) => `https://i.pravatar.cc/900?img=${n}`;

export const sampleCandidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Ananya',
    age: 26,
    distanceKm: 2,
    photo: photo(5),
    interests: ['Music', 'Travel', 'Coffee'],
    bio: 'Architect who collects vinyl and chases sunsets.',
  },
  {
    id: 'c2',
    name: 'Diya',
    age: 28,
    distanceKm: 4,
    photo: photo(9),
    interests: ['Yoga', 'Books', 'Hiking'],
    bio: 'Weekend trekker, weekday product designer.',
  },
  {
    id: 'c3',
    name: 'Kabir',
    age: 29,
    distanceKm: 3,
    photo: photo(12),
    interests: ['Food', 'Cricket', 'Films'],
    bio: 'Will out-argue you about the best biryani in town.',
  },
  {
    id: 'c4',
    name: 'Meera',
    age: 25,
    distanceKm: 6,
    photo: photo(16),
    interests: ['Art', 'Dogs', 'Dance'],
    bio: 'Painting, two rescue dogs, and a lot of chai.',
  },
  {
    id: 'c5',
    name: 'Arjun',
    age: 30,
    distanceKm: 5,
    photo: photo(33),
    interests: ['Startups', 'Running', 'Jazz'],
    bio: 'Early mornings, long runs, late-night jazz.',
  },
];
