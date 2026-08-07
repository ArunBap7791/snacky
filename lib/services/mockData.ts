import { Movie, Theatre, Show, Seat, Snack, User, RewardSummary, Booking } from '../types/domain';

export const mockMovies: Movie[] = [
  {
    id: 'm1',
    title: 'Inception',
    language: 'English',
    genre: 'Sci-Fi, Action',
    durationMinutes: 148,
    rating: 8.8,
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    trailerUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    certification: 'UA',
    castAndCrew: [
      { id: 'c1', name: 'Leonardo DiCaprio', role: 'Cobb', photoUrl: 'https://image.tmdb.org/t/p/w200/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg' },
      { id: 'c2', name: 'Joseph Gordon-Levitt', role: 'Arthur', photoUrl: 'https://image.tmdb.org/t/p/w200/dhv9ymcGijF2Hbx6hQEqeIu0p33.jpg' },
      { id: 'c3', name: 'Elliot Page', role: 'Ariadne', photoUrl: 'https://image.tmdb.org/t/p/w200/tp157uNewdOytpurWdsncZijWkl.jpg' },
    ],
    reviews: {
      overallRating: 8.8,
      totalCount: 3245,
      userReviews: [
        { id: 'r1', userName: 'Alice', rating: 9, text: 'Mind-bending masterpiece with stunning visuals and a deep plot.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
        { id: 'r2', userName: 'Bob', rating: 8, text: 'Great action and concept, though a bit confusing at times.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' }
      ]
    },
    moreLikeThis: ['m2', 'm3']
  },
  {
    id: 'm2',
    title: 'The Dark Knight',
    language: 'English',
    genre: 'Action, Crime, Drama',
    durationMinutes: 152,
    rating: 9.0,
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    trailerUrl: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?q=80&w=1200&auto=format&fit=crop',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    certification: 'UA',
    castAndCrew: [
      { id: 'c4', name: 'Christian Bale', role: 'Batman', photoUrl: 'https://image.tmdb.org/t/p/w200/b7fTC9WFkgqGOv77mLQAlpWxFcg.jpg' },
      { id: 'c5', name: 'Heath Ledger', role: 'Joker', photoUrl: 'https://image.tmdb.org/t/p/w200/pTynseMuX8sJRs9jW2Lnb9X0Y2X.jpg' },
    ],
    reviews: {
      overallRating: 9.0,
      totalCount: 4120,
      userReviews: [
        { id: 'r3', userName: 'Charlie', rating: 10, text: 'The best superhero movie ever made. Ledger is incredible.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' }
      ]
    },
    moreLikeThis: ['m1', 'm3']
  },
  {
    id: 'm3',
    title: 'Interstellar',
    language: 'English',
    genre: 'Sci-Fi, Drama',
    durationMinutes: 169,
    rating: 8.6,
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    trailerUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    certification: 'U',
    castAndCrew: [
      { id: 'c6', name: 'Matthew McConaughey', role: 'Cooper', photoUrl: 'https://image.tmdb.org/t/p/w200/sY2mwpafcwsqOW1QWzAA8XHRCEo.jpg' },
      { id: 'c7', name: 'Anne Hathaway', role: 'Brand', photoUrl: 'https://image.tmdb.org/t/p/w200/tLelKoPNiyJC2O2j0aOU68GOUeJ.jpg' },
    ],
    reviews: {
      overallRating: 8.6,
      totalCount: 2980,
      userReviews: [
        { id: 'r4', userName: 'Diana', rating: 9, text: 'Visually stunning and emotionally resonant.', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diana' }
      ]
    },
    moreLikeThis: ['m1']
  },
  {
    id: 'm4',
    title: 'Vikram',
    language: 'Tamil',
    genre: 'Action, Crime',
    durationMinutes: 175,
    rating: 8.4,
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500&auto=format&fit=crop',
    description: 'A special investigator discovers a case of serial killings is not what it seems to be.',
  },
  {
    id: 'm5',
    title: 'Ponniyin Selvan: Part I',
    language: 'Tamil',
    genre: 'Action, Drama',
    durationMinutes: 167,
    rating: 7.9,
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop',
    description: 'Vandiyathevan sets out to cross the Chola land to deliver a message from the Crown Prince.',
  },
  {
    id: 'm6',
    title: 'Master',
    language: 'Tamil',
    genre: 'Action, Crime',
    durationMinutes: 179,
    rating: 7.8,
    posterUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=500&auto=format&fit=crop',
    description: 'An alcoholic professor is sent to a juvenile school, where he clashes with a gangster.',
  },
  {
    id: 'm7',
    title: 'Jailer',
    language: 'Tamil',
    genre: 'Action, Comedy',
    durationMinutes: 168,
    rating: 7.5,
    posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=500&auto=format&fit=crop',
    description: 'A retired jailer goes on a manhunt to find his son\'s killers.',
  },
  {
    id: 'm8',
    title: 'Kaithi',
    language: 'Tamil',
    genre: 'Action, Crime',
    durationMinutes: 145,
    rating: 8.5,
    posterUrl: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?q=80&w=500&auto=format&fit=crop',
    description: 'Dilli, an ex-convict, endeavors to meet his daughter for the first time after leaving prison.',
  },
  {
    id: 'm9',
    title: 'RRR',
    language: 'Telugu',
    genre: 'Action, Drama',
    durationMinutes: 187,
    rating: 8.0,
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=500&auto=format&fit=crop',
    description: 'A fictitious story about two legendary revolutionaries and their journey away from home.',
  },
  {
    id: 'm10',
    title: 'Pushpa: The Rise',
    language: 'Telugu',
    genre: 'Action, Crime',
    durationMinutes: 179,
    rating: 7.6,
    posterUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=500&auto=format&fit=crop',
    description: 'A laborer rises through the ranks of a red sandalwood smuggling syndicate.',
  },
  {
    id: 'm11',
    title: 'Baahubali: The Beginning',
    language: 'Telugu',
    genre: 'Action, Drama',
    durationMinutes: 159,
    rating: 8.0,
    posterUrl: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=500&auto=format&fit=crop',
    description: 'In ancient India, an adventurous and daring man becomes involved in a decades-old feud.',
  },
  {
    id: 'm12',
    title: 'Ala Vaikunthapurramuloo',
    language: 'Telugu',
    genre: 'Action, Comedy',
    durationMinutes: 165,
    rating: 7.3,
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    description: 'Bantu grows up being constantly subjected to his father\'s scorn.',
  },
  {
    id: 'm13',
    title: 'Arjun Reddy',
    language: 'Telugu',
    genre: 'Drama, Action',
    durationMinutes: 182,
    rating: 8.1,
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    description: 'A short-tempered house surgeon gets used to drugs and drinks when his girlfriend is forced to marry another person.',
  },
  {
    id: 'm14',
    title: 'Drishyam 2',
    language: 'Malayalam',
    genre: 'Crime, Drama',
    durationMinutes: 152,
    rating: 8.6,
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    description: 'A gripping tale of an investigation and a family which is threatened by it.',
  },
  {
    id: 'm15',
    title: 'Minnal Murali',
    language: 'Malayalam',
    genre: 'Action, Comedy',
    durationMinutes: 158,
    rating: 7.9,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop',
    description: 'A tailor gains special powers after being struck by lightning.',
  },
  {
    id: 'm16',
    title: 'Kumbalangi Nights',
    language: 'Malayalam',
    genre: 'Drama, Comedy',
    durationMinutes: 135,
    rating: 8.6,
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop',
    description: 'Four brothers share a love-hate relationship with each other.',
  },
  {
    id: 'm17',
    title: 'Trance',
    language: 'Malayalam',
    genre: 'Drama, Sci-Fi',
    durationMinutes: 170,
    rating: 7.3,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop',
    description: 'A despondent motivational speaker gets hired by a corporate to become a pastor.',
  },
  {
    id: 'm18',
    title: 'Premam',
    language: 'Malayalam',
    genre: 'Comedy, Drama',
    durationMinutes: 156,
    rating: 8.3,
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop',
    description: 'While George\'s first love turns out to be a disappointment, he finds purpose in another.',
  },
  {
    id: 'm19',
    title: 'Dangal',
    language: 'Hindi',
    genre: 'Action, Drama',
    durationMinutes: 161,
    rating: 8.4,
    posterUrl: 'https://images.unsplash.com/photo-1604998103924-89e012e5265a?q=80&w=500&auto=format&fit=crop',
    description: 'Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.',
  },
  {
    id: 'm20',
    title: '3 Idiots',
    language: 'Hindi',
    genre: 'Comedy, Drama',
    durationMinutes: 170,
    rating: 8.4,
    posterUrl: 'https://images.unsplash.com/photo-1604998103924-89e012e5265a?q=80&w=500&auto=format&fit=crop',
    description: 'Two friends are searching for their long lost companion.',
  },
  {
    id: 'm21',
    title: 'PK',
    language: 'Hindi',
    genre: 'Comedy, Sci-Fi',
    durationMinutes: 153,
    rating: 8.1,
    posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=500&auto=format&fit=crop',
    description: 'An alien on Earth loses the only device he can use to communicate with his spaceship.',
  },
  {
    id: 'm22',
    title: 'Jawan',
    language: 'Hindi',
    genre: 'Action, Crime',
    durationMinutes: 169,
    rating: 7.2,
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    description: 'A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.',
  },
  {
    id: 'm23',
    title: 'Pathaan',
    language: 'Hindi',
    genre: 'Action, Crime',
    durationMinutes: 146,
    rating: 6.0,
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    description: 'An Indian spy takes on the leader of a group of mercenaries who have nefarious plans to target his homeland.',
  },
  {
    id: 'm24',
    title: 'The Matrix',
    language: 'English',
    genre: 'Sci-Fi, Action',
    durationMinutes: 136,
    rating: 8.7,
    posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality.',
  },
  {
    id: 'm25',
    title: 'Avatar',
    language: 'English',
    genre: 'Sci-Fi, Action',
    durationMinutes: 162,
    rating: 7.8,
    posterUrl: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?q=80&w=500&auto=format&fit=crop',
    description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
  },
  {
    id: 'm26',
    title: 'The Avengers',
    language: 'English',
    genre: 'Action, Sci-Fi',
    durationMinutes: 143,
    rating: 8.0,
    posterUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=500&auto=format&fit=crop',
    description: 'Earth\'s mightiest heroes must come together and learn to fight as a team if they are going to stop the mischievous Loki and his alien army from enslaving humanity.',
  }
];

export const mockTheatres: Theatre[] = [
  {
    id: 't1',
    name: 'PVR: Select City Walk',
    address: 'Saket, New Delhi',
    logoUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=200&auto=format&fit=crop',
    latitude: 28.528,
    longitude: 77.219,
    partnerId: 'p1',
    availableFacilities: ['IMAX', '4DX'],
    hallFeatures: [],
    supportsSeatDelivery: true
  },
  {
    id: 't2',
    name: 'INOX: Nehru Place',
    address: 'Nehru Place, New Delhi',
    logoUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=200&auto=format&fit=crop',
    latitude: 28.549,
    longitude: 77.252,
    partnerId: 'p2',
    availableFacilities: ['IMAX', '4DX'],
    hallFeatures: [],
    supportsSeatDelivery: true
  },
  {
    id: 't3',
    name: 'Cinepolis: DLF Avenue',
    address: 'Saket, New Delhi',
    logoUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200&auto=format&fit=crop',
    latitude: 28.527,
    longitude: 77.218,
    partnerId: 'p3',
    availableFacilities: ['IMAX', '4DX'],
    hallFeatures: [],
    supportsSeatDelivery: true
  }
];

export const mockShows: Show[] = [
  {
    id: 's1',
    movieId: 'm1',
    theatreId: 't1',
    screen: 'Screen 1',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '12:30',
    seatLayout: 'layout_1',
    availability: 'available'
  },
  {
    id: 's2',
    movieId: 'm1',
    theatreId: 't1',
    screen: 'Screen 2',
    date: new Date().toISOString().split('T')[0],
    startTime: '13:00',
    endTime: '15:30',
    seatLayout: 'layout_2',
    availability: 'fast-filling'
  },
  {
    id: 's3',
    movieId: 'm2',
    theatreId: 't1',
    screen: 'Screen 1',
    date: new Date().toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '18:30',
    seatLayout: 'layout_1',
    availability: 'house-full'
  },
  {
    id: 's4',
    movieId: 'm1',
    theatreId: 't2',
    screen: 'Audi 3',
    date: new Date().toISOString().split('T')[0],
    startTime: '11:00',
    endTime: '13:30',
    seatLayout: 'layout_3',
    availability: 'available'
  }
];

const generateSeats = (showId: string): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E'];
  rows.forEach(row => {
    for (let i = 1; i <= 10; i++) {
      seats.push({
        id: `seat_${showId}_${row}${i}`,
        showId,
        seatNumber: `${row}${i}`,
        seatType: row === 'E' ? 'Premium' : 'Standard',
        status: Math.random() > 0.7 ? 'booked' : 'available',
        price: row === 'E' ? 350 : 250,
      });
    }
  });
  return seats;
};

export const mockSeats: Record<string, Seat[]> = {
  s1: generateSeats('s1'),
  s2: generateSeats('s2'),
  s3: generateSeats('s3'),
  s4: generateSeats('s4'),
};

export const mockSnacks: Snack[] = [
  {
    id: 'sn1',
    theatreId: 't1',
    category: 'Popcorn',
    name: 'Large Salted Popcorn',
    description: 'Classic salted popcorn in a large tub',
    price: 250,
    isVeg: true,
    allergens: ['Contains Milk'],
    availability: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'sn2',
    theatreId: 't1',
    category: 'Popcorn',
    name: 'Caramel Popcorn',
    description: 'Sweet and crunchy caramel coated popcorn',
    price: 280,
    isVeg: true,
    allergens: ['Contains Milk', 'Contains Soy'],
    availability: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1585237841961-d7790b49cb3f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'sn3',
    theatreId: 't1',
    category: 'Beverage',
    name: 'Coke Large',
    description: 'Refreshing large fountain coke',
    price: 150,
    isVeg: true,
    allergens: ['Contains Caffeine'],
    availability: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'sn4',
    theatreId: 't1',
    category: 'Combo',
    name: 'Couple Combo',
    description: '1 Large Popcorn + 2 Large Cokes',
    price: 500,
    isVeg: true,
    allergens: ['Contains Milk', 'Contains Caffeine'],
    availability: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1626019550993-41bb62b5ebf0?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'sn5',
    theatreId: 't1',
    category: 'Snacks',
    name: 'Chicken Hot Dog',
    description: 'Classic chicken hot dog with mustard',
    price: 200,
    isVeg: false,
    allergens: ['Contains Soy', 'Contains Wheat'],
    availability: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?q=80&w=400&auto=format&fit=crop'
  }
];

export const mockUser: User = {
  id: 'u1',
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  mobileNumber: '+91 9876543210',
  rewardPoints: 1250,
  createdAt: '2025-01-01T10:00:00Z',
  updatedAt: '2025-06-01T10:00:00Z',
};

export const mockRewardSummary: RewardSummary = {
  userId: 'u1',
  currentXp: 1250,
  tier: 'gold',
  expiresAt: '2026-06-01T10:00:00Z',
  rewardHistory: [
    { id: 'rh1', title: 'Movie Ticket Booking', xpEarned: 150, date: '2026-07-31T12:00:00Z', source: 'movie_booking' },
    { id: 'rh2', title: 'Snack Combo Order', xpEarned: 50, date: '2026-07-31T12:05:00Z', source: 'snack_purchase' },
    { id: 'rh3', title: 'Friend Referral', xpEarned: 500, date: '2026-07-25T09:00:00Z', source: 'referral' },
    { id: 'rh4', title: 'Welcome Bonus', xpEarned: 200, date: '2026-07-01T10:00:00Z', source: 'bonus' }
  ],
  availableRewards: [
    {
      id: 'ar1',
      title: 'Free Large Popcorn',
      xpRequired: 500,
      description: 'Redeem a free large salted popcorn on your next visit.',
      imageUrl: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=400&auto=format&fit=crop',
      terms: ['Valid for 30 days after redemption', 'Not valid on premium flavours'],
      expiry: 'Valid till Dec 2026'
    },
    {
      id: 'ar2',
      title: 'Movie Ticket 50% Off',
      xpRequired: 1500,
      description: 'Get 50% off on your next movie ticket booking.',
      imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=400&auto=format&fit=crop',
      terms: ['Max discount of ₹150', 'Valid for standard 2D movies only'],
      expiry: 'Valid till Dec 2026'
    },
    {
      id: 'ar3',
      title: 'Free Seat Delivery',
      xpRequired: 200,
      description: 'Waive off seat delivery charges for one booking.',
      imageUrl: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?q=80&w=400&auto=format&fit=crop',
      terms: ['Applicable only in supported theatres'],
      expiry: 'Valid till Dec 2026'
    }
  ]
};

export const mockBookings: Booking[] = [];

export const mockBanners = [
  {
    id: 'b1',
    imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    alt: 'Inception',
    movieId: 'm1',
    title: 'Inception'
  },
  {
    id: 'b2',
    imageUrl: 'https://images.unsplash.com/photo-1585951237318-9ea5e175b891?q=80&w=1200&auto=format&fit=crop',
    alt: 'The Dark Knight',
    movieId: 'm2',
    title: 'The Dark Knight'
  },
  {
    id: 'b3',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200&auto=format&fit=crop',
    alt: 'Interstellar',
    movieId: 'm3',
    title: 'Interstellar'
  },
  {
    id: 'b4',
    imageUrl: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?q=80&w=1200&auto=format&fit=crop',
    alt: 'Avatar',
    movieId: 'm25',
    title: 'Avatar'
  }
];
