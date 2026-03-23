
-- Congress sessions table
CREATE TABLE public.congress_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id uuid NOT NULL,
  tournament_name text,
  chamber_number text,
  session_name text,
  round_number integer DEFAULT 1,
  status text DEFAULT 'setup',
  speaking_order_method text DEFAULT 'volunteer',
  questioning_format text DEFAULT 'direct',
  notes text,
  submitted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.congress_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Judges can insert own sessions" ON public.congress_sessions FOR INSERT TO authenticated WITH CHECK (judge_id = auth.uid());
CREATE POLICY "Judges can read own sessions" ON public.congress_sessions FOR SELECT TO authenticated USING (judge_id = auth.uid());
CREATE POLICY "Judges can update own sessions" ON public.congress_sessions FOR UPDATE TO authenticated USING (judge_id = auth.uid());
CREATE POLICY "Admins can read all sessions" ON public.congress_sessions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Legislation items in a session
CREATE TABLE public.congress_legislation (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.congress_sessions(id) ON DELETE CASCADE,
  title text NOT NULL,
  legislation_type text DEFAULT 'bill',
  vote_outcome text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.congress_legislation ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Session judge can manage legislation" ON public.congress_legislation FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.congress_sessions cs WHERE cs.id = congress_legislation.session_id AND cs.judge_id = auth.uid()));
CREATE POLICY "Admins can read legislation" ON public.congress_legislation FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Students in a congress session
CREATE TABLE public.congress_session_students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.congress_sessions(id) ON DELETE CASCADE,
  competitor_id uuid NOT NULL REFERENCES public.competitors(id),
  is_presiding_officer boolean DEFAULT false,
  po_score numeric,
  po_comments text,
  final_rank integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, competitor_id)
);

ALTER TABLE public.congress_session_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Session judge can manage students" ON public.congress_session_students FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.congress_sessions cs WHERE cs.id = congress_session_students.session_id AND cs.judge_id = auth.uid()));
CREATE POLICY "Admins can read session students" ON public.congress_session_students FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Students can read own session entries" ON public.congress_session_students FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.competitors c WHERE c.id = congress_session_students.competitor_id AND c.user_id = auth.uid()));

-- Individual speeches
CREATE TABLE public.congress_speeches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES public.congress_sessions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.congress_session_students(id) ON DELETE CASCADE,
  legislation_id uuid REFERENCES public.congress_legislation(id),
  side text,
  speech_score integer,
  questioning_score integer,
  notes text,
  speech_order integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.congress_speeches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Session judge can manage speeches" ON public.congress_speeches FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.congress_sessions cs WHERE cs.id = congress_speeches.session_id AND cs.judge_id = auth.uid()));
CREATE POLICY "Admins can read speeches" ON public.congress_speeches FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Students can read own speeches" ON public.congress_speeches FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.congress_session_students css JOIN public.competitors c ON c.id = css.competitor_id WHERE css.id = congress_speeches.student_id AND c.user_id = auth.uid()));
