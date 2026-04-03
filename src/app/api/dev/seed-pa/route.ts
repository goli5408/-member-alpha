/**
 * DEV-ONLY route — creates a test Peer Ambassador account.
 * Returns 403 in production.
 *
 * Usage:
 *   curl -X POST http://localhost:3000/api/dev/seed-pa
 *
 * The Supabase `handle_new_user` trigger will fire on auth.users
 * INSERT and create a `profiles` row with role = 'peer_ambassador'.
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const TEST_PA = {
  email:       "test-pa@soulseated.dev",
  password:    "TestPA123!",
  displayName: "Alex Rivera",
  pronouns:    "they/them",
};

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev only." }, { status: 403 });
  }

  const admin = createAdminClient();

  // Check if account already exists
  const { data: existing } = await admin.auth.admin.listUsers();
  const alreadyExists = existing?.users.some(u => u.email === TEST_PA.email);

  if (alreadyExists) {
    return NextResponse.json({
      message: "Account already exists.",
      email:    TEST_PA.email,
      password: TEST_PA.password,
    });
  }

  const { data, error } = await admin.auth.admin.createUser({
    email:         TEST_PA.email,
    password:      TEST_PA.password,
    email_confirm: true,           // skip email verification in dev
    user_metadata: {
      user_type:    "peer_ambassador",
      display_name: TEST_PA.displayName,
      pronouns:     TEST_PA.pronouns,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    message:  "✅ Test PA account created.",
    id:       data.user?.id,
    email:    TEST_PA.email,
    password: TEST_PA.password,
    name:     TEST_PA.displayName,
    portal:   "http://localhost:3000/pa/dashboard",
  });
}
