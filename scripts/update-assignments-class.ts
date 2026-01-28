/**
 * Script to update existing assignments to link them to a class
 * Run with: npx tsx scripts/update-assignments-class.ts
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const TEACHER_ID = '5be95487-e1e3-4857-a260-a21b3ef0960a';

async function updateAssignments() {
  // First, get the class ID
  const { data: classes, error: classError } = await supabase
    .from('classes')
    .select('id')
    .eq('teacher_id', TEACHER_ID)
    .limit(1);

  if (classError || !classes || classes.length === 0) {
    console.error(
      'No class found for teacher. Please run insert-dummy-assignments.ts first.',
    );
    process.exit(1);
  }

  const classId = classes[0].id;
  console.log(`Using class ID: ${classId}\n`);

  // Update published assignments that don't have a class_id
  const { data: updated, error } = await supabase
    .from('assignments')
    .update({ class_id: classId })
    .eq('teacher_id', TEACHER_ID)
    .is('class_id', null)
    .eq('status', 'published')
    .select();

  if (error) {
    console.error('Error updating assignments:', error.message);
    process.exit(1);
  }

  console.log(
    `✓ Updated ${updated?.length || 0} published assignments with class_id`,
  );

  if (updated && updated.length > 0) {
    console.log('\nUpdated assignments:');
    updated.forEach((a) => {
      console.log(`  - ${a.title}`);
    });
  }
}

updateAssignments()
  .then(() => {
    console.log('\n✓ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  });
