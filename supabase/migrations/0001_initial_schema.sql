-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS (Synced from Clerk)
CREATE TABLE public.users (
    id TEXT PRIMARY KEY, -- Clerk User ID
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    mobile_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- REWARDS
CREATE TABLE public.rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    current_xp INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'silver',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- MOVIES (Synced copy from Partner Provider)
CREATE TABLE public.movies (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    language TEXT,
    genre TEXT,
    duration_minutes INTEGER,
    rating NUMERIC(3, 1),
    poster_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- THEATRES (Synced copy from Partner Provider)
CREATE TABLE public.theatres (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    partner_id TEXT,
    available_facilities JSONB DEFAULT '[]'::jsonb,
    supports_seat_delivery BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SHOWS (Synced copy from Partner Provider)
CREATE TABLE public.shows (
    id TEXT PRIMARY KEY,
    movie_id TEXT REFERENCES public.movies(id) ON DELETE CASCADE,
    theatre_id TEXT REFERENCES public.theatres(id) ON DELETE CASCADE,
    screen TEXT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    seat_layout TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEATS (Synced copy from Partner Provider)
CREATE TABLE public.seats (
    id TEXT PRIMARY KEY,
    show_id TEXT REFERENCES public.shows(id) ON DELETE CASCADE,
    seat_number TEXT NOT NULL,
    seat_type TEXT NOT NULL,
    status TEXT NOT NULL, -- 'available', 'booked', 'reserved'
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SNACKS (Synced copy from Partner Provider)
CREATE TABLE public.snacks (
    id TEXT PRIMARY KEY,
    theatre_id TEXT REFERENCES public.theatres(id) ON DELETE CASCADE,
    category TEXT,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    is_veg BOOLEAN DEFAULT TRUE,
    availability TEXT DEFAULT 'in_stock',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BOOKINGS
CREATE TABLE public.bookings (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    movie_id TEXT REFERENCES public.movies(id),
    theatre_id TEXT REFERENCES public.theatres(id),
    show_id TEXT REFERENCES public.shows(id),
    fulfilment_method TEXT,
    qr_code TEXT,
    otp TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled'
    total_amount NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BOOKING SEATS
CREATE TABLE public.booking_seats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
    seat_id TEXT REFERENCES public.seats(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BOOKING SNACKS
CREATE TABLE public.booking_snacks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
    snack_id TEXT REFERENCES public.snacks(id),
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PAYMENTS
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    gateway_signature TEXT,
    status TEXT DEFAULT 'created', -- 'created', 'success', 'failed'
    amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CARTS
CREATE TABLE public.carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
    session_id TEXT UNIQUE, -- for guest carts before login
    theatre_id TEXT REFERENCES public.theatres(id) ON DELETE SET NULL,
    movie_id TEXT REFERENCES public.movies(id) ON DELETE SET NULL,
    show_id TEXT REFERENCES public.shows(id) ON DELETE SET NULL,
    seats JSONB DEFAULT '[]'::jsonb, -- Array of seat IDs
    fulfilment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CART ITEMS
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE,
    snack_id TEXT REFERENCES public.snacks(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(cart_id, snack_id)
);

-- RLS POLICIES (Example simplified for this iteration)
-- In production, you would enable row level security on all tables
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
-- Example Policy: CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid()::text = id);
