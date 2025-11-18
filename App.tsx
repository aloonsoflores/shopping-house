import * as Linking from 'expo-linking';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AppStack from './navigation/AppStack';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  
  const prefix = Linking.createURL('/');

  const linking = {
    prefixes: [prefix, 'shoppinghouse://'],
    config: {
      screens: {
        ResetPassword: 'reset-password',
      },
    },
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <AppStack />
        </NavigationContainer>
      </AuthProvider>
    </ThemeProvider>
  );
}
