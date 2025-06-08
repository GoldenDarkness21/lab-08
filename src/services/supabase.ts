import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://shyyeillaituopgtntgh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNoeXllaWxsYWl0dW9wZ3RudGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMTc5NjEsImV4cCI6MjA2NDc5Mzk2MX0.FxW3_S9OJSvqp6GiUJbF7AQkZWZ5dU1SiPvtu8gCxdE';

export const BUCKET_NAME = 'memes';

export const supabase = createClient(supabaseUrl, supabaseKey);