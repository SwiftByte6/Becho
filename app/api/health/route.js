import { supabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const results = {}   // ← removed ": any"

  // TEST 1 — Can we READ from Supabase?
  const { data: readData, error: readError } = await supabase
    .from('waste_mapping')
    .select('*')
    .limit(1)

  results.read = readError
    ? { status: '❌ FAILED', error: readError.message }
    : { status: '✅ SUCCESS', data: readData }

  // TEST 2 — Can we INSERT into Supabase?
  const { data: insertData, error: insertError } = await supabase
    .from('users')
    .insert({
      name: 'Test User',
      email: `test_${Date.now()}@test.com`,
      password: 'test123',
      company_name: 'Test Company',
      industry_type: 'Testing',
      location: 'Mumbai'
    })
    .select()
    .single()

  results.insert = insertError
    ? { status: '❌ FAILED', error: insertError.message }
    : { status: '✅ SUCCESS', data: insertData }

  // TEST 3 — Can we DELETE the test row we just inserted?
  if (insertData?.id) {
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', insertData.id)

    results.cleanup = deleteError
      ? { status: '❌ FAILED', error: deleteError.message }
      : { status: '✅ Test row deleted cleanly' }
  }

  const allPassed = !readError && !insertError

  results.verdict = allPassed
    ? '🟢 Supabase fully connected — READ & INSERT working!'
    : '🔴 Something is wrong — check individual results above'

  return NextResponse.json(results, { status: allPassed ? 200 : 500 })
}