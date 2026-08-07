import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
    return new Response('Error: Missing webhook secret', { status: 500 });
  }

  // Get headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create new Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification error', { status: 400 });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  const supabase = createAdminClient();

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { email_addresses, first_name, last_name, phone_numbers } = evt.data;

    const email = email_addresses[0]?.email_address;
    const fullName = [first_name, last_name].filter(Boolean).join(' ');
    const phone = phone_numbers[0]?.phone_number || null;

    if (!id || !email) {
      return new Response('Error: Missing essential user data', { status: 400 });
    }

    try {
      // Upsert User
      const { error: userError } = await supabase
        .from('users')
        .upsert({
          id,
          email,
          full_name: fullName,
          mobile_number: phone,
          updated_at: new Date().toISOString()
        });

      if (userError) throw userError;

      // If created, initialize rewards
      if (eventType === 'user.created') {
        const { error: rewardError } = await supabase
          .from('rewards')
          .insert({
            user_id: id,
            current_xp: 0,
            tier: 'silver'
          });
        
        if (rewardError && rewardError.code !== '23505') { // Ignore unique violation if somehow already exists
          throw rewardError;
        }
      }

    } catch (err) {
      console.error('Supabase sync error:', err);
      return new Response('Error syncing to database', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    if (!id) return new Response('Error: Missing user id', { status: 400 });
    
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user from database', { status: 500 });
    }
  }

  return new Response('Webhook received and processed', { status: 200 });
}
