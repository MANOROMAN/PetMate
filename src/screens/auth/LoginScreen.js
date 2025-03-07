import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from '../../store/authSlice';

const LoginScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

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
    dispatch(setLoading(true));
    try {
      const user = await loginUser(values.email, values.password);
      
      // Redux state'i güncelle
      dispatch(setUser(user));
      
      // Başarılı giriş sonrası işlemler
      navigation.replace('Main');
    } catch (error) {
      // Hata mesajını anlaşılır şekilde göster
      let errorMessage = 'Giriş yapılırken bir hata oluştu';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Bu email adresine sahip bir kullanıcı bulunamadı';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Hatalı şifre girdiniz';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz email adresi';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Çok fazla başarısız giriş denemesi. Lütfen daha sonra tekrar deneyin';
      }
      
      Alert.alert('Giriş Hatası', errorMessage);
      dispatch(setError(errorMessage));
    }
    setIsLoading(false);
    dispatch(setLoading(false));
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
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              )}
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