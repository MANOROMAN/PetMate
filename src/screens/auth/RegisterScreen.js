import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../../services/authService';
import { useDispatch } from 'react-redux';
import { setUser, setLoading, setError } from '../../store/authSlice';

const RegisterScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

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
    dispatch(setLoading(true));
    try {
      const user = await registerUser(
        values.email, 
        values.password, 
        values.name, 
        values.userType
      );
      
      // Redux state'i güncelle
      dispatch(setUser(user));
      
      Alert.alert(
        'Kayıt Başarılı', 
        'Hesabınız oluşturuldu. Lütfen profilinizi tamamlayın.',
        [{ 
          text: 'Tamam', 
          onPress: () => navigation.replace('ProfileCreate') 
        }]
      );
    } catch (error) {
      // Hata mesajını anlaşılır şekilde göster
      let errorMessage = 'Kayıt yapılırken bir hata oluştu';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Bu email adresi zaten kullanılıyor';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Geçersiz email adresi';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Zayıf şifre. Lütfen daha güçlü bir şifre seçin';
      }
      
      Alert.alert('Kayıt Hatası', errorMessage);
      dispatch(setError(errorMessage));
    }
    setIsLoading(false);
    dispatch(setLoading(false));
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
                <Text 
                  style={[
                    styles.userTypeButtonText,
                    values.userType === 'petOwner' && styles.selectedUserTypeButtonText
                  ]}
                >
                  Hayvan Sahibi
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  values.userType === 'veterinarian' && styles.selectedUserType
                ]}
                onPress={() => setFieldValue('userType', 'veterinarian')}
              >
                <Text 
                  style={[
                    styles.userTypeButtonText,
                    values.userType === 'veterinarian' && styles.selectedUserTypeButtonText
                  ]}
                >
                  Veteriner
                </Text>
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
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.registerButtonText}>Kayıt Ol</Text>
              )}
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
  selectedUserTypeButtonText: {
    color: 'white',
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