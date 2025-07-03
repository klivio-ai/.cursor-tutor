-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['revenue'::text, 'expense'::text])),
  color text,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reference text,
  description text NOT NULL,
  amount numeric NOT NULL,
  vendor text NOT NULL,
  status text NOT NULL,
  paid boolean DEFAULT false,
  notes text,
  property_id uuid,
  category_id uuid NOT NULL,
  due_date date,
  date date NOT NULL,
  file_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid,
  CONSTRAINT expenses_pkey PRIMARY KEY (id),
  CONSTRAINT expenses_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id),
  CONSTRAINT expenses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  tenant_id uuid,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  payment_date date NOT NULL,
  method text,
  notes text,
  user_id uuid DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT payments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id),
  CONSTRAINT payments_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.properties (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text,
  address text NOT NULL,
  type text,
  tenant_id uuid,
  monthly_rent numeric NOT NULL CHECK (monthly_rent > 0::numeric),
  payment_status text NOT NULL DEFAULT 'Pending'::text CHECK (payment_status = ANY (ARRAY['Paid'::text, 'Pending'::text, 'Overdue'::text])),
  next_due_date date,
  user_id uuid DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  rental_price numeric,
  current_value numeric,
  CONSTRAINT properties_pkey PRIMARY KEY (id),
  CONSTRAINT properties_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT properties_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id)
);
CREATE TABLE public.revenues (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reference text,
  description text NOT NULL,
  amount numeric NOT NULL,
  source text NOT NULL,
  status text NOT NULL,
  paid boolean DEFAULT false,
  notes text,
  property_id uuid,
  category_id uuid NOT NULL,
  date date NOT NULL,
  file_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  user_id uuid,
  CONSTRAINT revenues_pkey PRIMARY KEY (id),
  CONSTRAINT revenues_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id),
  CONSTRAINT revenues_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT revenues_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.tenants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE,
  phone_number text,
  user_id uuid DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT tenants_pkey PRIMARY KEY (id),
  CONSTRAINT tenants_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
