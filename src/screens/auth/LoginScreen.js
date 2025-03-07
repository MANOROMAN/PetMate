import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Alert 
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../services/authService';

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Geçersiz email adresi')
      .required('Email gerekli'),
    password: Yup.string()
      .min(6, 'Şifre en az 6 karakter olmalı')
      .required('Şifre gerekli')
  });

  const handleLogin = async (values) => {
    setIsLoading(true);
    try {
      const user = await loginUser(values.email, values.password);
      // Başarılı giriş sonrası işlemler
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Giriş Hatası', error.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/logo.png')} 
        style={styles.logo} 
      />
      <Text style={styles.title}>PetMate'e Hoş Geldin</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ 
          handleChange, 
          handleBlur, 
          handleSubmit, 
          values, 
          errors, 
          touched 
        }) => (
          <View style={styles.formContainer}>
            <TextInput
              style={[
                styles.input, 
                touched.email && errors.email && styles.inputError
              ]}
              placeholder="E-posta Adresi"
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              style={[
                styles.input, 
                touched.password && errors.password && styles.inputError
              ]}
              placeholder="Şifre"
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              secureTextEntry
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <View style={styles.footerContainer}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerText}>Hesap Oluştur</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  formContainer: {
    width: '100%'
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20
  },
  forgotPasswordText: {
    color: '#4CAF50'
  },
  registerText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  }
});

export default LoginScreen;
```

6. Ana Navigasyon (`src/navigation/AppNavigator.js`):

<antArtifact identifier="app-navigator" type="application/vnd.ant.code" language="javascript" title="Ana Navigasyon">
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

// Import Ekranları
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import MainScreen from '../screens/main/MainScreen';
import ProfileCreateScreen from '../screens/main/ProfileCreateScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (initializing) setInitializing(false);
    });

    // Aboneliği temizle
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: 'white'
        }}
      >
        {user ? (
          // Kullanıcı giriş yapmışsa
          <>
            <Stack.Screen 
              name="Main" 
              component={MainScreen} 
              options={{ title: 'PetMate' }}
            />
            <Stack.Screen 
              name="ProfileCreate" 
              component={ProfileCreateScreen} 
              options={{ title: 'Profil Oluştur' }}
            />
          </>
        ) : (
          // Kullanıcı giriş yapmamışsa
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Kayıt Ol' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

7. `App.js` Güncelleme:

<antArtifact identifier="app-js" type="application/vnd.ant.code" language="javascript" title="Ana Uygulama Bileşeni">
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}