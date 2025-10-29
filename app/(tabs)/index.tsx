import { ThemedView } from '@/components/themed-view';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import AddUserScreen from '../../frontend/screens/AddUserScreen';
import AdminScreen from '../../frontend/screens/AdminScreen';
import EditUserScreen from '../../frontend/screens/EditUserScreen';
import LoginScreen from '../../frontend/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ 
            title: 'Đăng nhập',
            headerShown: false  // Hide header for login screen
          }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: 'Quản trị người dùng' }}
        />
        <Stack.Screen
          name="AddUser"
          component={AddUserScreen}
          options={{ title: 'Thêm người dùng' }}
        />
        <Stack.Screen
          name="EditUser"
          component={EditUserScreen}
          options={{ title: 'Sửa người dùng' }}
        />
      </Stack.Navigator>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
