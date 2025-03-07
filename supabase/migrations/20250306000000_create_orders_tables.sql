-- Create orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  total_amount numeric(10,2) not null,
  payment_intent_id text unique not null,
  payment_status text not null,
  shipping_address jsonb not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- Create order items table
create table public.order_items (
  id uuid primary
