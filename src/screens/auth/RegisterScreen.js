import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const RegisterSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Ad çok kısa')
      .max(50, 'Ad çok uzun')
      .required('Ad gerekli'),
    email: Yup.string()
      .email('Geçersiz email adresi')
      .required('Email gerekli'),
    password: Yup.string()
      .min(6, 'Şifre en az 6 karakter olmalı')
      .matches(/[A-Z]/, 'Şifre en az bir büyük harf içermeli')
      .matches(/[a-z]/, 'Şifre en az bir küçük harf içermeli')
      .matches(/[0-9]/, 'Şifre en az bir sayı içermeli')
      .required('Şifre gerekli'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
      .required('Şifre onayı gerekli'),
    userType: Yup.string().required('Kullanıcı türü seçin')
  });

  const handleRegister = async (values) => {
    setIsLoading(true);
    try {
      const user = await registerUser(
        values.email, 
        values.password, 
        values.name, 
        values.userType
      );
      
      Alert.alert(
        'Kayıt Başarılı', 
        'Hesabınız oluşturuldu. Lütfen profilinizi tamamlayın.',
        [{ 
          text: 'Tamam', 
          onPress: () => navigation.replace('ProfileCreate') 
        }]
      );
    } catch (error) {
      Alert.alert('Kayıt Hatası', error.message);
    }
    setIsLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>PetMate'e Kayıt Ol</Text>

      <Formik
        initialValues={{ 
          name: '', 
          email: '', 
          password: '', 
          confirmPassword: '',
          userType: ''
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ 
          handleChange, 
          handleBlur, 
          handleSubmit, 
          values, 
          errors, 
          touched,
          setFieldValue
        }) => (
          <View style={styles.formContainer}>
            {/* Ad Input */}
            <TextInput
              style={[
                styles.input, 
                touched.name && errors.name && styles.inputError
              ]}
              placeholder="Ad Soyad"
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            {/* Email Input */}
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

            {/* Şifre Input */}
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

            {/* Şifre Onay Input */}
            <TextInput
              style={[
                styles.input, 
                touched.confirmPassword && errors.confirmPassword && styles.inputError
              ]}
              placeholder="Şifre Onayı"
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              value={values.confirmPassword}
              secureTextEntry
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            {/* Kullanıcı Türü Seçimi */}
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  values.userType === 'petOwner' && styles.selectedUserType
                ]}
                onPress={() => setFieldValue('userType', 'petOwner')}
              >
                <Text style={styles.userTypeButtonText}>Hayvan Sahibi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  values.userType === 'veterinarian' && styles.selectedUserType
                ]}
                onPress={() => setFieldValue('userType', 'veterinarian')}
              >
                <Text style={styles.userTypeButtonText}>Veteriner</Text>
              </TouchableOpacity>
            </View>
            {touched.userType && errors.userType && (
              <Text style={styles.errorText}>{errors.userType}</Text>
            )}

            {/* Kayıt Butonu */}
            <TouchableOpacity 
              style={styles.registerButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <View style={styles.loginContainer}>
        <Text>Zaten bir hesabın var mı? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5FCFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
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
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  userTypeButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  selectedUserType: {
    backgroundColor: '#4CAF50'
  },
  userTypeButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20
  },
  loginText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  }
});

export default RegisterScreen;
```

2. Şifremi Unuttum Ekranı (`src/screens/auth/ForgotPasswordScreen.js`):

<antArtifact identifier="forgot-password-screen" type="application/vnd.ant.code" language="javascript" title="Şifremi Unuttum Ekranı">
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '../../services/authService';

const ForgotPasswordScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Geçersiz email adresi')
      .required('Email gerekli')
  });

  const handleResetPassword = async (values) => {
    setIsLoading(true);
    try {
      await resetPassword(values.email);
      Alert.alert(
        'Şifre Sıfırlama', 
        'Şifre sıfırlama bağlantısı email adresinize gönderildi.',
        [{ 
          text: 'Tamam', 
          onPress: () => navigation.navigate('Login') 
        }]
      );
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Şifremi Unuttum</Text>
      <Text style={styles.subtitle}>
        Şifre sıfırlama bağlantısı için email adresinizi girin
      </Text>

      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleResetPassword}
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

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <View style={styles.loginContainer}>
        <Text>Hatırladınız mı? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Giriş Yap</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center'
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
  resetButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 20
  },
  loginText: {
    color: '#4CAF50',
    fontWeight: 'bold'
  }
});

export default ForgotPasswordScreen;
```

3. Redux Store Kurulumu (`src/store/store.js`):

<antArtifact identifier="redux-store" type="application/vnd.ant.code" language="javascript" title="Redux Store Yapılandırması">
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import petReducer from './petSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pets: petReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});