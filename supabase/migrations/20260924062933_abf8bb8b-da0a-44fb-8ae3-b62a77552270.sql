CREATE TYPE public.app_role AS ENUM ('user', 'admin', 'super_admin');
CREATE TYPE public.job_status AS ENUM ('draft', 'active', 'paused', 'closed');
CREATE TYPE public.application_status AS ENUM ('applied', 'under_review', 'shortlisted', 'interview', 'selected', 'rejected');

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  phone text,
  avatar_path text,
  preferred_language text NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en','mr','hi','gu','kn','te','ta','bn')),
  headline text,
  location text,
  bio text,
  skills text[] NOT NULL DEFAULT '{}',
  salary_expectation numeric(12,2),
  preferred_job_type text,
  profile_completion integer NOT NULL DEFAULT 20 CHECK (profile_completion BETWEEN 0 AND 100),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles own read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles own insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles own update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles own read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, preferred_language)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'full_name',''), COALESCE(new.raw_user_meta_data->>'preferred_language','en'));
  INSERT INTO public.user_roles (user_id, role) VALUES (new.id, 'user');
  RETURN new;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  industry text,
  location text,
  website text,
  logo_path text,
  employee_count text,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT SELECT ON public.companies TO anon;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "companies public read" ON public.companies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "companies owner insert" ON public.companies FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "companies owner update" ON public.companies FOR UPDATE TO authenticated USING (owner_id = auth.uid() OR public.has_role(auth.uid(),'super_admin')) WITH CHECK (owner_id = auth.uid() OR public.has_role(auth.uid(),'super_admin'));

CREATE TABLE public.job_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  labels jsonb NOT NULL,
  icon text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.job_categories TO anon, authenticated;
GRANT ALL ON public.job_categories TO service_role;
ALTER TABLE public.job_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.job_categories FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  category_id uuid REFERENCES public.job_categories(id),
  title text NOT NULL,
  location text NOT NULL,
  job_type text NOT NULL,
  work_mode text NOT NULL,
  min_salary numeric(12,2),
  max_salary numeric(12,2),
  salary_type text NOT NULL DEFAULT 'monthly',
  experience text,
  education text,
  vacancies integer NOT NULL DEFAULT 1 CHECK (vacancies > 0),
  description text NOT NULL,
  responsibilities text[] NOT NULL DEFAULT '{}',
  requirements text[] NOT NULL DEFAULT '{}',
  skills text[] NOT NULL DEFAULT '{}',
  benefits text[] NOT NULL DEFAULT '{}',
  status public.job_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.jobs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs public active read" ON public.jobs FOR SELECT TO anon USING (status = 'active');
CREATE POLICY "jobs authenticated read" ON public.jobs FOR SELECT TO authenticated USING (status = 'active' OR EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "jobs employer insert" ON public.jobs FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "jobs employer update" ON public.jobs FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "jobs employer delete" ON public.jobs FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));

CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id uuid NOT NULL,
  resume_path text,
  cover_note text,
  status public.application_status NOT NULL DEFAULT 'applied',
  applied_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id, applicant_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "applications candidate read" ON public.applications FOR SELECT TO authenticated USING (applicant_id = auth.uid() OR EXISTS (SELECT 1 FROM public.jobs j JOIN public.companies c ON c.id = j.company_id WHERE j.id = job_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "applications candidate insert" ON public.applications FOR INSERT TO authenticated WITH CHECK (applicant_id = auth.uid() AND public.has_role(auth.uid(),'user'));
CREATE POLICY "applications employer update" ON public.applications FOR UPDATE TO authenticated USING (applicant_id = auth.uid() OR EXISTS (SELECT 1 FROM public.jobs j JOIN public.companies c ON c.id = j.company_id WHERE j.id = job_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "applications candidate delete" ON public.applications FOR DELETE TO authenticated USING (applicant_id = auth.uid());

CREATE TABLE public.employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  employee_code text NOT NULL,
  department text NOT NULL,
  designation text NOT NULL,
  joining_date date NOT NULL,
  base_salary numeric(12,2) NOT NULL CHECK (base_salary >= 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_id, employee_code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.employees TO authenticated;
GRANT ALL ON public.employees TO service_role;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "employees scoped read" ON public.employees FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "employees employer insert" ON public.employees FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "employees employer update" ON public.employees FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.companies c WHERE c.id = company_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));

CREATE TABLE public.salary_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  salary_month date NOT NULL,
  basic numeric(12,2) NOT NULL DEFAULT 0,
  allowances numeric(12,2) NOT NULL DEFAULT 0,
  bonus numeric(12,2) NOT NULL DEFAULT 0,
  deductions numeric(12,2) NOT NULL DEFAULT 0,
  net_salary numeric(12,2) GENERATED ALWAYS AS (basic + allowances + bonus - deductions) STORED,
  payslip_path text,
  status text NOT NULL DEFAULT 'pending',
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(employee_id, salary_month)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.salary_records TO authenticated;
GRANT ALL ON public.salary_records TO service_role;
ALTER TABLE public.salary_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "salary scoped read" ON public.salary_records FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.employees e WHERE e.id = employee_id AND (e.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.companies c WHERE c.id = e.company_id AND c.owner_id = auth.uid()))) OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "salary employer insert" ON public.salary_records FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.employees e JOIN public.companies c ON c.id = e.company_id WHERE e.id = employee_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "salary employer update" ON public.salary_records FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.employees e JOIN public.companies c ON c.id = e.company_id WHERE e.id = employee_id AND c.owner_id = auth.uid()) OR public.has_role(auth.uid(),'super_admin'));

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id uuid NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  destination text,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications own read" ON public.notifications FOR SELECT TO authenticated USING (recipient_id = auth.uid());
CREATE POLICY "notifications own update" ON public.notifications FOR UPDATE TO authenticated USING (recipient_id = auth.uid()) WITH CHECK (recipient_id = auth.uid());
CREATE POLICY "notifications privileged insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "notifications own delete" ON public.notifications FOR DELETE TO authenticated USING (recipient_id = auth.uid());

CREATE INDEX jobs_search_idx ON public.jobs(status, location, job_type, published_at DESC);
CREATE INDEX applications_applicant_idx ON public.applications(applicant_id, status, applied_at DESC);
CREATE INDEX applications_job_idx ON public.applications(job_id, status);
CREATE INDEX notifications_recipient_idx ON public.notifications(recipient_id, is_read, created_at DESC);
CREATE INDEX employees_user_idx ON public.employees(user_id);

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER applications_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER salary_updated_at BEFORE UPDATE ON public.salary_records FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "career documents own read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'career-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "career documents own upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'career-documents' AND (storage.foldername(name))[1] = auth.uid()::text AND lower(storage.extension(name)) IN ('pdf','doc','docx','jpg','jpeg','png'));
CREATE POLICY "career documents own update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'career-documents' AND (storage.foldername(name))[1] = auth.uid()::text) WITH CHECK (bucket_id = 'career-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "career documents own delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'career-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "brand assets own read" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'brand-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "brand assets own upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'brand-assets' AND (storage.foldername(name))[1] = auth.uid()::text AND lower(storage.extension(name)) IN ('jpg','jpeg','png','webp'));
CREATE POLICY "brand assets own update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'brand-assets' AND (storage.foldername(name))[1] = auth.uid()::text) WITH CHECK (bucket_id = 'brand-assets' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "brand assets own delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'brand-assets' AND (storage.foldername(name))[1] = auth.uid()::text);

INSERT INTO public.job_categories (slug, labels, icon) VALUES
('it', '{"en":"Information Technology","mr":"माहिती तंत्रज्ञान","hi":"सूचना प्रौद्योगिकी"}', 'Monitor'),
('healthcare', '{"en":"Healthcare","mr":"आरोग्य सेवा","hi":"स्वास्थ्य सेवा"}', 'HeartPulse'),
('education', '{"en":"Education","mr":"शिक्षण","hi":"शिक्षा"}', 'GraduationCap'),
('construction', '{"en":"Construction","mr":"बांधकाम","hi":"निर्माण"}', 'HardHat'),
('banking', '{"en":"Banking","mr":"बँकिंग","hi":"बैंकिंग"}', 'Landmark'),
('retail', '{"en":"Retail","mr":"किरकोळ","hi":"खुदरा"}', 'Store'),
('manufacturing', '{"en":"Manufacturing","mr":"उत्पादन","hi":"विनिर्माण"}', 'Factory'),
('hospitality', '{"en":"Hospitality","mr":"आतिथ्य","hi":"आतिथ्य"}', 'Hotel'),
('government', '{"en":"Government","mr":"शासकीय","hi":"सरकारी"}', 'Building2'),
('delivery', '{"en":"Delivery","mr":"वितरण","hi":"डिलीवरी"}', 'Bike'),
('other', '{"en":"Other","mr":"इतर","hi":"अन्य"}', 'BriefcaseBusiness');