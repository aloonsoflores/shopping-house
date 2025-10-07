import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import SignInScreen from '../screens/SignInScreenEnhanced';
import SignUpScreen from '../screens/SignUpScreenEnhanced';
import HouseSetupScreen from '../screens/HouseSetupScreenEnhanced';
import ProfileScreen from '../screens/ProfileScreenEnhanced';
import SharedListScreen from '../screens/SharedListScreenEnhanced';
import HouseDetailsScreen from '../screens/HouseDetailsScreen';
import ProtectedRoute from '../components/ProtectedRoute';

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  HouseSetup: undefined;
  Profile: undefined;
  SharedList: { houseId: string };
  HouseDetails: { houseId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppStack() {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator
      initialRouteName={user ? "HouseSetup" : "SignIn"}
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.onPrimary,
        headerTitleStyle: { fontWeight: 'bold' },
        animation: 'slide_from_right',
      }}
    >
      {/* Pantalla de Login */}
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: 'Iniciar Sesión',
          headerShown: false,
        }}
      />

      {/* Pantalla de Registro */}
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{
          title: 'Crear Cuenta',
          headerBackTitle: '',
        }}
      />

      {/* Pantalla de Configuración de la Casa */}
      <Stack.Screen
        name="HouseSetup"
        options={{
          title: 'Configuración de la Casa',
          headerShown: false,
        }}
      >
        {props => (
          <ProtectedRoute>
            <HouseSetupScreen {...props} />
          </ProtectedRoute>
        )}
      </Stack.Screen>

      {/* Pantalla de Perfil */}
      <Stack.Screen
        name="Profile"
        options={{
          title: 'Información Personal',
          headerBackTitle: 'Volver',
          headerShown: true,
        }}
      >
        {props => (
          <ProtectedRoute>
            <ProfileScreen />
          </ProtectedRoute>
        )}
      </Stack.Screen>

      {/* Pantalla Lista Compartida */}
      <Stack.Screen
        name="SharedList"
        options={{
          title: 'Lista Compartida',
          headerBackTitle: 'Volver',
          headerShown: true,
        }}
      >
        {props => (
          <ProtectedRoute>
            <SharedListScreen {...props} />
          </ProtectedRoute>
        )}
      </Stack.Screen>

      {/* Pantalla Detalles de Casa */}
      <Stack.Screen
        name="HouseDetails"
        options={{
          title: 'Detalles de la Casa',
          headerBackTitle: 'Volver',
          headerShown: true,
        }}
      >
        {props => (
          <ProtectedRoute>
            <HouseDetailsScreen {...props} />
          </ProtectedRoute>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
