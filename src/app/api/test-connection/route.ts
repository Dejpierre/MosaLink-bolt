import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Test the connection by making a simple query
    const { data, error } = await supabase.from('accounts').select('count').limit(1);
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database connection failed', 
        error: error.message 
      }, { status: 500 });
    }
    
    // Get auth status
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Auth connection failed', 
        error: authError.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Connection successful',
      isAuthenticated: !!authData.session,
      data
    });
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Connection test failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}