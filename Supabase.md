-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.impact_metrics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  waste_reused numeric DEFAULT 0,
  co2_saved numeric DEFAULT 0,
  transactions_count integer DEFAULT 0,
  CONSTRAINT impact_metrics_pkey PRIMARY KEY (id),
  CONSTRAINT impact_metrics_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.logistics (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  transaction_id uuid NOT NULL,
  pickup_location text NOT NULL,
  delivery_location text NOT NULL,
  transport_cost numeric DEFAULT 0,
  status character varying DEFAULT 'pending'::character varying,
  scheduled_at timestamp without time zone,
  notes text,
  CONSTRAINT logistics_pkey PRIMARY KEY (id),
  CONSTRAINT logistics_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id)
);
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  listing_id uuid NOT NULL,
  quantity numeric NOT NULL,
  price numeric NOT NULL,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'accepted'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT transactions_pkey PRIMARY KEY (id),
  CONSTRAINT transactions_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.users(id),
  CONSTRAINT transactions_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id),
  CONSTRAINT transactions_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.waste_listings(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  email character varying NOT NULL UNIQUE,
  password text NOT NULL,
  company_name character varying,
  industry_type character varying,
  location text,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE TABLE public.waste_listings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  material_name character varying NOT NULL,
  category character varying NOT NULL,
  quantity numeric NOT NULL,
  unit character varying NOT NULL,
  price numeric DEFAULT 0,
  location text,
  image_url text,
  description text,
  created_at timestamp without time zone DEFAULT now(),
  status character varying DEFAULT 'available'::character varying CHECK (status::text = ANY (ARRAY['available'::character varying, 'reserved'::character varying, 'sold'::character varying]::text[])),
  latitude numeric,
  longitude numeric,
  CONSTRAINT waste_listings_pkey PRIMARY KEY (id),
  CONSTRAINT waste_listings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.waste_mapping (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  waste_type character varying NOT NULL,
  recommended_industries text NOT NULL,
  CONSTRAINT waste_mapping_pkey PRIMARY KEY (id)
);