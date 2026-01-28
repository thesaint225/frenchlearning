/**
 * Script to create a student user in Supabase Auth if it doesn't exist
 * Run with: npx tsx scripts/create-student-user.ts
 *
 * This script requires SUPABASE_SERVICE_ROLE_KEY in .env.local for admin operations
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load environment variables
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const envVars: Record<string, string> = {};

    envFile.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '');
          envVars[key.trim()] = value.trim();
        }
      }
    });

    Object.assign(process.env, envVars);
  } catch (error) {
    console.warn('Could not load .env.local, using process.env directly');
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

// Use service role key if available, otherwise use anon key
const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Create admin client if service role key is available
const supabaseAdmin = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

const STUDENT_ID = '00000000-0000-0000-0000-000000000001';
const STUDENT_EMAIL = 'student@learnfrench.com';
const STUDENT_PASSWORD = 'Student123!@#';

async function checkUserExists(userId: string): Promise<boolean> {
  try {
    // Try to get user by ID using admin API
    if (supabaseAdmin) {
      const { data, error } =
        await supabaseAdmin.auth.admin.getUserById(userId);
      if (
        error &&
        (error.message.includes('User not found') ||
          error.message.includes('not found'))
      ) {
        return false;
      }
      return !!data?.user;
    } else {
      // Without service role, try to sign in to check if user exists
      const { data, error } = await supabase.auth.signInWithPassword({
        email: STUDENT_EMAIL,
        password: STUDENT_PASSWORD,
      });
      if (error && error.message.includes('Invalid login credentials')) {
        return false;
      }
      return !!data?.user;
    }
  } catch (error) {
    return false;
  }
}

async function createStudentUser() {
  console.log('Checking if student user exists...\n');

  const userExists = await checkUserExists(STUDENT_ID);

  if (userExists) {
    console.log(`✓ Student user already exists`);

    // Get the actual user ID
    if (supabaseAdmin) {
      const { data } = await supabaseAdmin.auth.admin.getUserById(STUDENT_ID);
      if (data?.user) {
        console.log(`  ID: ${data.user.id}`);
        console.log(`  Email: ${data.user.email}`);
        console.log(`  Created: ${data.user.created_at}`);
        return data.user.id;
      }
    }

    // Try to get user by email via sign in
    const { data } = await supabase.auth.signInWithPassword({
      email: STUDENT_EMAIL,
      password: STUDENT_PASSWORD,
    });
    if (data?.user) {
      console.log(`  ID: ${data.user.id}`);
      console.log(`  Email: ${data.user.email}`);
      return data.user.id;
    }

    return STUDENT_ID;
  }

  console.log('Student user does not exist. Creating new user...\n');

  if (!supabaseAdmin) {
    console.log(
      'No service role key found. Attempting to create user via signUp...\n',
    );

    try {
      // Try to create user via signUp (requires email confirmation unless disabled)
      const { data, error } = await supabase.auth.signUp({
        email: STUDENT_EMAIL,
        password: STUDENT_PASSWORD,
        options: {
          data: {
            role: 'student',
            name: 'Test Student',
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          console.log(
            'User with this email already exists. Attempting to sign in...\n',
          );
          const { data: signInData, error: signInError } =
            await supabase.auth.signInWithPassword({
              email: STUDENT_EMAIL,
              password: STUDENT_PASSWORD,
            });

          if (signInError) {
            console.error('Error signing in:', signInError.message);
            console.error('\nThe user exists but password might be different.');
            console.error(
              'Please use the service role key for admin operations.',
            );
            process.exit(1);
          }

          if (signInData?.user) {
            console.log(`✓ Found existing user (ID: ${signInData.user.id})`);
            return signInData.user.id;
          }
        } else {
          console.error('Error creating user:', error.message);
          console.error(
            '\nPlease add SUPABASE_SERVICE_ROLE_KEY to .env.local for admin user creation.',
          );
          process.exit(1);
        }
      }

      if (data?.user) {
        console.log(`✓ Successfully created student user via signUp:`);
        console.log(`  ID: ${data.user.id}`);
        console.log(`  Email: ${data.user.email}`);
        console.log(`  Note: Email confirmation may be required.\n`);
        return data.user.id;
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      console.error(
        '\nPlease add SUPABASE_SERVICE_ROLE_KEY to .env.local for reliable user creation.',
      );
      process.exit(1);
    }
  }

  try {
    // Create user using admin API (requires service role key)
    const { data, error } = await supabaseAdmin!.auth.admin.createUser({
      email: STUDENT_EMAIL,
      password: STUDENT_PASSWORD,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'student',
        name: 'Test Student',
      },
    });

    if (error) {
      // If user already exists with this email, try to get it
      if (
        error.message.includes('already registered') ||
        error.message.includes('already exists')
      ) {
        console.log(
          'User with this email already exists. Attempting to retrieve...\n',
        );

        // Try to get user by email using admin API
        const { data: userList } = await supabaseAdmin!.auth.admin.listUsers();
        const existingUser = userList?.users.find(
          (u) => u.email === STUDENT_EMAIL,
        );

        if (existingUser) {
          console.log(`✓ Found existing user (ID: ${existingUser.id})`);
          return existingUser.id;
        }

        // Fallback: try sign in
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: STUDENT_EMAIL,
            password: STUDENT_PASSWORD,
          });

        if (signInError) {
          console.error('Error signing in:', signInError.message);
          console.error('\nThe user exists but password might be different.');
          console.error(
            'Please reset the password in Supabase dashboard or use a different email.',
          );
          process.exit(1);
        }

        if (signInData?.user) {
          console.log(`✓ Found existing user (ID: ${signInData.user.id})`);
          return signInData.user.id;
        }
      } else {
        console.error('Error creating user:', error.message);
        process.exit(1);
      }
    }

    if (data?.user) {
      console.log(`✓ Successfully created student user:`);
      console.log(`  ID: ${data.user.id}`);
      console.log(`  Email: ${data.user.email}`);
      console.log(
        `  Email confirmed: ${data.user.email_confirmed_at ? 'Yes' : 'No'}\n`,
      );
      return data.user.id;
    }

    console.error('Failed to create user: No user data returned');
    process.exit(1);
  } catch (error) {
    console.error('Unexpected error creating user:', error);
    process.exit(1);
  }
}

async function createEnrollment(studentId: string) {
  console.log('Creating student enrollment in class...\n');

  // Get the class ID
  const TEACHER_ID = '5be95487-e1e3-4857-a260-a21b3ef0960a';
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('teacher_id', TEACHER_ID)
    .limit(1);

  if (classError || !classes || classes.length === 0) {
    console.error(
      'No class found. Please run insert-dummy-assignments.ts first.',
    );
    process.exit(1);
  }

  const classId = classes[0].id;

  // Check if enrollment already exists
  const { data: existingEnrollment, error: fetchError } = await supabase
    .from('enrollments')
    .select('*')
    .eq('class_id', classId)
    .eq('student_id', studentId)
    .limit(1);

  if (fetchError && !fetchError.message.includes('does not exist')) {
    console.error('Error checking enrollment:', fetchError.message);
    process.exit(1);
  }

  if (existingEnrollment && existingEnrollment.length > 0) {
    console.log(
      `✓ Student already enrolled (Enrollment ID: ${existingEnrollment[0].id})\n`,
    );
    return existingEnrollment[0].id;
  }

  // Create enrollment
  const { data: newEnrollment, error: createError } = await supabase
    .from('enrollments')
    .insert({
      class_id: classId,
      student_id: studentId,
      status: 'active',
      enrollment_method: 'manual',
    })
    .select()
    .single();

  if (createError) {
    console.error('Error creating enrollment:', createError.message);
    process.exit(1);
  }

  console.log(`✓ Successfully created enrollment (ID: ${newEnrollment.id})\n`);
  return newEnrollment.id;
}

async function main() {
  // Step 1: Create or get student user
  const studentId = await createStudentUser();

  // Step 2: Create enrollment
  await createEnrollment(studentId);

  console.log('✓ All done! Student user is ready.');
  console.log(`\nStudent ID: ${studentId}`);
  console.log(`Email: ${STUDENT_EMAIL}`);
  console.log(`Password: ${STUDENT_PASSWORD}`);
  console.log(
    '\nYou can now use this student account to test the student dashboard.',
  );
}

main()
  .then(() => {
    console.log('\n✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });
