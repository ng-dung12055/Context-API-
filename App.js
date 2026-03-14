import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppProvider, useAppContext } from "./AppContext";

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const getOnlyDigits = (text) => {
  return text.replace(/\D/g, "");
};

const formatPhoneNumber = (text) => {
  const digits = getOnlyDigits(text).slice(0, 10);

  if (digits.length <= 3) return digits;

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)} ${digits.slice(3)}`;
  }

  if (digits.length <= 8) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
    6,
    8
  )} ${digits.slice(8, 10)}`;
};

const isValidPhone = (text) => {
  const digits = getOnlyDigits(text);
  return /^0\d{9}$/.test(digits);
};

function AuthHeader({ title, subtitle, description }) {
  return (
    <View style={styles.authHeader}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

function PhoneField({ phone, error, onChangeText }) {
  return (
    <View>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={onChangeText}
        maxLength={13}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function AuthLink({ label, actionLabel, onPress }) {
  return (
    <View style={styles.linkRow}>
      <Text style={styles.linkLabel}>{label}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.linkText}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

function SignInScreen({ navigation }) {
  const { signIn } = useAppContext();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePhone = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);

    if (formatted.length === 0) {
      setError("");
      return;
    }

    if (!isValidPhone(formatted)) {
      setError("Số điện thoại không đúng định dạng");
      return;
    }

    setError("");
  };

  const handleSignIn = () => {
    if (!isValidPhone(phone)) {
      Alert.alert("Thông báo", "Số điện thoại không đúng định dạng");
      return;
    }

    if (password.trim().length < 6) {
      Alert.alert("Thông báo", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    signIn(phone);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <AuthHeader
            title="Đăng nhập"
            subtitle="Chào mừng quay lại"
            description="Nhập số điện thoại và mật khẩu để tiếp tục sử dụng ứng dụng"
          />

          <PhoneField phone={phone} error={error} onChangeText={handleChangePhone} />

          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.inlineLinkButton}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.inlineLinkText}>Quên mật khẩu?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <AuthLink
            label="Chưa có tài khoản?"
            actionLabel="Đăng ký"
            onPress={() => navigation.navigate("SignUp")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SignUpScreen({ navigation }) {
  const { signUp } = useAppContext();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleChangePhone = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);

    if (formatted.length === 0) {
      setError("");
      return;
    }

    if (!isValidPhone(formatted)) {
      setError("Số điện thoại không đúng định dạng");
      return;
    }

    setError("");
  };

  const handleSignUp = () => {
    if (fullName.trim().length < 3) {
      Alert.alert("Thông báo", "Họ tên phải có ít nhất 3 ký tự");
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert("Thông báo", "Số điện thoại không đúng định dạng");
      return;
    }

    if (password.trim().length < 6) {
      Alert.alert("Thông báo", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    signUp(phone);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <AuthHeader
            title="Đăng ký"
            subtitle="Tạo tài khoản mới"
            description="Điền thông tin để tạo tài khoản và truy cập vào luồng chính của ứng dụng"
          />

          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên"
            value={fullName}
            onChangeText={setFullName}
          />

          <PhoneField phone={phone} error={error} onChangeText={handleChangePhone} />

          <TextInput
            style={styles.input}
            placeholder="Tạo mật khẩu"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>

          <AuthLink
            label="Đã có tài khoản?"
            actionLabel="Đăng nhập"
            onPress={() => navigation.navigate("SignIn")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ForgotPasswordScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleChangePhone = (text) => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);

    if (formatted.length === 0) {
      setError("");
      return;
    }

    if (!isValidPhone(formatted)) {
      setError("Số điện thoại không đúng định dạng");
      return;
    }

    setError("");
  };

  const handleResetPassword = () => {
    if (!isValidPhone(phone)) {
      Alert.alert("Thông báo", "Vui lòng nhập số điện thoại hợp lệ");
      return;
    }

    Alert.alert(
      "Thành công",
      `Mã xác nhận đã được gửi đến số điện thoại ${phone}`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <AuthHeader
          title="Quên mật khẩu"
          subtitle="Khôi phục tài khoản"
          description="Nhập số điện thoại để nhận mã xác nhận và đặt lại mật khẩu"
        />

        <PhoneField phone={phone} error={error} onChangeText={handleChangePhone} />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Gửi mã xác nhận</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function HomeScreen() {
  const { userPhone } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.homeTitle}>Trang chủ</Text>
        <Text style={styles.homeDescription}>
          Bạn đã đăng nhập thành công bằng số điện thoại:
        </Text>
        <Text style={styles.homePhone}>{userPhone}</Text>
      </View>
    </SafeAreaView>
  );
}

function ProfileScreen() {
  const { userPhone, signOut } = useAppContext();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mainContent}>
        <Text style={styles.homeTitle}>Hồ sơ</Text>
        <Text style={styles.profileText}>Số điện thoại đang đăng nhập:</Text>
        <Text style={styles.homePhone}>{userPhone}</Text>

        <TouchableOpacity style={styles.button} onPress={signOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#6b7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: "Trang chủ" }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: "Hồ sơ" }}
      />
    </Tab.Navigator>
  );
}

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <AuthStack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: "Đăng ký" }}
      />
      <AuthStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: "Quên mật khẩu" }}
      />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainTabs" component={MainTabs} />
    </MainStack.Navigator>
  );
}

function AppNavigator() {
  const { isLoggedIn } = useAppContext();

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },

  authHeader: {
    marginBottom: 28,
  },

  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 18,
  },

  subtitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },

  description: {
    fontSize: 16,
    color: "#6b7280",
    lineHeight: 24,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    height: 54,
    paddingHorizontal: 16,
    fontSize: 17,
    backgroundColor: "#ffffff",
    marginBottom: 14,
  },

  inputError: {
    borderColor: "#ef4444",
  },

  errorText: {
    color: "#ef4444",
    marginTop: -6,
    marginBottom: 12,
    fontSize: 14,
  },

  button: {
    backgroundColor: "#2563eb",
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginTop: 8,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },

  inlineLinkButton: {
    alignSelf: "flex-end",
    marginTop: -4,
    marginBottom: 20,
  },

  inlineLinkText: {
    color: "#2563eb",
    fontSize: 15,
    fontWeight: "600",
  },

  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },

  linkLabel: {
    fontSize: 15,
    color: "#6b7280",
    marginRight: 6,
  },

  linkText: {
    fontSize: 15,
    color: "#2563eb",
    fontWeight: "700",
  },

  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  badge: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },

  homeTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },

  homeDescription: {
    fontSize: 17,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 26,
  },

  homePhone: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2563eb",
    marginBottom: 22,
  },

  profileText: {
    fontSize: 17,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 10,
  },
});
