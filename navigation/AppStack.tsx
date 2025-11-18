import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import SignInScreen from '../screens/SignInScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import VerifyCodeScreen from '../screens/VerifyCodeScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HouseSetupScreen from '../screens/HouseSetupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SharedListScreen from '../screens/SharedListScreen';
import HouseDetailsScreen from '../screens/HouseDetailsScreen';
import ProtectedRoute from '../components/ProtectedRoute';

export type RootStackParamList = {
  SignIn: undefined;
  ForgotPassword: undefined;
  VerifyCode: undefined;
  ResetPassword: undefined;
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

      {/* Pantalla de Recuperar Contraseña */}
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          title: 'Recuperar Contraseña',
          headerBackTitle: '',
        }}
      />

      {/* Pantalla de Verificar Código */}
      <Stack.Screen
        name="VerifyCode"
        component={VerifyCodeScreen}
        options={{
          title: 'Verificar Código',
          headerBackTitle: '',
        }}
      />

      {/* Pantalla de Resetear Contraseña */}
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          title: 'Resetear Contraseña',
          headerBackTitle: '',
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
