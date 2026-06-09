import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase admin client. NEVER import this module into a Client
// Component — it relies on the service-role key, which must never reach the browser.
//
// This site shares a Supabase project with the sister site puntacana-excursions.com.
// To avoid collisions we write to PREFIXED tables in the public schema:
//   - private_excursions_bookings
//   - private_excursions_form_submissions

let cachedClient: SupabaseClient | null | undefined;

function getClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    console.error("[supabase] missing config — persistence disabled");
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedClient;
}

export interface BookingInsert {
  paypal_order_id: string;
  excursion_id?: string;
  excursion_title?: string;
  locale?: string;
  customer_name?: string;
  email?: string;
  phone?: string;
  hotel?: string;
  tour_date?: string;
  time_slot?: string;
  adults?: number;
  children?: number;
  deposit_paid?: number;
  currency?: string;
  total_price?: number;
  remaining_balance?: number;
  status?: string;
}

export interface FormSubmissionInsert {
  type: "contact" | "inquiry";
  locale?: string;
  name?: string;
  email?: string;
  phone?: string;
  hotel?: string;
  excursion?: string;
  message?: string;
}

// Best-effort, never-throwing. A missing or broken Supabase config must never
// break a booking — the caller proceeds to email regardless.
export async function recordBooking(b: BookingInsert): Promise<void> {
  const supabase = getClient();
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from("private_excursions_bookings")
      .upsert(b, { onConflict: "paypal_order_id" });
    if (error) console.error("[supabase] recordBooking error", error);
  } catch (err) {
    console.error("[supabase] recordBooking threw", err);
  }
}

// Best-effort, never-throwing. A missing or broken Supabase config must never
// break a form submission — the caller proceeds to email regardless.
export async function recordFormSubmission(
  s: FormSubmissionInsert,
): Promise<void> {
  const supabase = getClient();
  if (!supabase) return;
  try {
    const { error } = await supabase
      .from("private_excursions_form_submissions")
      .insert(s);
    if (error) console.error("[supabase] recordFormSubmission error", error);
  } catch (err) {
    console.error("[supabase] recordFormSubmission threw", err);
  }
}
