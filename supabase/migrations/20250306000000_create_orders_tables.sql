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
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) not null,
  product_id uuid references public.products(id) not null,
  quantity integer not null,
  price numeric(10,2) not null,
  product_name text not null,
  variant jsonb,
  created_at timestamp with time zone default now() not null
);

-- Add RLS policies
alter table public.orders enable row level security;

create policy "Users can view their own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can insert their own orders" on public.orders
  for insert with check (auth.uid() = user_id);

alter table public.order_items enable row level security;

create policy "Users can view their own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can insert their own order items" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Add function to track order changes
create or replace function public.handle_updated_at()
returns trigger as $
begin
  new.updated_at = now();
  return new;
end;
$ language plpgsql;

-- Add trigger to update timestamps
create trigger set_updated_at
before update on public.orders
for each row execute procedure public.handle_updated_at();
