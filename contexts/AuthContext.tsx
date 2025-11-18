import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { Platform } from 'react-native';

interface AuthContextType {
  user: SupabaseUser | null;
  signUp: (email: string, password: string, fullName: string) => Promise<{ data: any; error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ data: any; error: AuthError | null }>;
  sendResetCode: (email: string) => Promise<{ data: any; error: AuthError | null }>;
  verifyResetCode: (email: string, code: string) => Promise<{ data: any; error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signUp: async () => ({ data: null, error: null }),
  signIn: async () => ({ data: null, error: null }),
  signOut: async () => {},
  resetPassword: async () => ({ data: null, error: null }),
  sendResetCode: async () => ({ data: null, error: null }),
  verifyResetCode: async () => ({ data: null, error: null }),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    // Obtener sesión al arrancar
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    })();

    // Suscripción a cambios de auth (supabase-js v2)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.session?.user) setUser(data.session.user);
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const redirectTo =
      Platform.OS === 'web'
        ? 'http://localhost:3000/reset-password'
        : 'shoppinghouse://reset-password';

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { data, error };
  };
  
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;

  const sendResetCode = async (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
  
    const { error: insertError } = await supabase
      .from('password_reset_codes')
      .insert({ email, code });
  
    if (insertError) {
      return {
        data: null,
        error: { message: insertError.message, name: 'PostgrestError' } as AuthError,
      };
    }

    // Llamar a la Edge Function
    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-reset-code`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      }
    );
  
    if (!response.ok) {
      const error = await response.json();
      return {
        data: null,
        error: { message: error.error || "Error enviando el correo", name: "FunctionError" } as AuthError,
      };
    }
  
    return { data: { code }, error: null };
  };
  
  const verifyResetCode = async (email: string, code: string) => {
    const { data, error } = await supabase
      .from('password_reset_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .maybeSingle();
  
    if (error || !data) {
      return {
        data: null,
        error: { message: error?.message || 'Código inválido o expirado', name: 'PostgrestError' } as AuthError,
      };
    }
  
    await supabase.from('password_reset_codes').update({ used: true }).eq('id', data.id);
  
    return { data, error: null };
  };  

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, resetPassword, sendResetCode, verifyResetCode }}>
      {children}
    </AuthContext.Provider>
  );
};
