# Auth0 React Native Security Sample

This is a React Native application demonstrating Auth0 integration for both iOS and Android, featuring:

- **Universal Login** with Email OTP (passwordless) for sign-up and login
- **Native Email OTP** flow for in-app passwordless sign-up/login
- **In-app onboarding**: first-time sign-up can enable Face ID/Touch ID and set a 6-digit PIN
- **Security self-service**: manage biometrics and PIN inside the app after login
- **Ephemeral session** to avoid iOS consent popup
- **User profile** screen showing ID token claims
- **iOS and Android** device support with proper configuration

## Prerequisites

- Node.js >= 18
- React Native development environment set up
- Xcode (for iOS development)
- Android Studio (for Android development)
- CocoaPods
- An Auth0 account

## Setup

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Install iOS dependencies:**
   ```bash
   cd ios && pod install && cd ..
   ```

3. **Configure Auth0:**
   - Copy `auth0-configuration.js.example` to `auth0-configuration.js`
   - Update with your Auth0 credentials:
     ```javascript
     const config = {
       clientId: "YOUR_CLIENT_ID",
       domain: "YOUR_DOMAIN"
     };
     export default config;
     ```

4. **Configure Android:**
   - Open `android/app/build.gradle`
   - Update line 83 with your Auth0 domain:
     ```gradle
     manifestPlaceholders = [auth0Domain: "your-domain.auth0.com", auth0Scheme: "${applicationId}.auth0"]
     ```
   - Replace `YOUR_AUTH0_DOMAIN` with your actual Auth0 domain (e.g., `financeapp.cic-demo-platform.auth0app.com`)

5. **Configure iOS:**
   - Open `ios/Auth0Sample.xcodeproj/project.pbxproj`
   - Update `DEVELOPMENT_TEAM` with your Apple Developer Team ID (search for `DEVELOPMENT_TEAM` and replace `Z52F7L33Y8`)
   - Update `PRODUCT_BUNDLE_IDENTIFIER` if needed

6. **Configure Auth0 Dashboard:**
   Add these URLs to your Auth0 Application settings:
   
   **Allowed Callback URLs:**
   ```
   com.auth0samples.auth0://financeapp.cic-demo-platform.auth0app.com/ios/com.auth0samples/callback,
   com.auth0samples.auth0://financeapp.cic-demo-platform.auth0app.com/android/com.auth0samples/callback
   ```
   
   **Allowed Logout URLs:**
   ```
   com.auth0samples.auth0://financeapp.cic-demo-platform.auth0app.com/ios/com.auth0samples/callback,
   com.auth0samples.auth0://financeapp.cic-demo-platform.auth0app.com/android/com.auth0samples/callback
   ```
   
   *Note: If you use a different Auth0 domain or bundle identifier, update the URLs accordingly.*

## Running the App

**On iOS Simulator:**
```bash
npx react-native run-ios
```

**On iOS Device:**
```bash
npx react-native run-ios --udid YOUR_DEVICE_UDID
```

**On Android Emulator or Device:**
```bash
npx react-native run-android
```

## Features

### Ephemeral Session
The app uses `ephemeralSession: true` to prevent the iOS consent popup ("App wants to use auth0.com to sign in"). This provides a smoother user experience on iOS. On Android, the authentication flow works seamlessly without additional consent prompts.

### Email OTP Passwordless Login
You can sign up or log in with Email OTP either via Universal Login or the native in-app flow:

1. **User enters their email address** - The app collects the user's email
2. **OTP is sent** - Auth0 sends a 6-digit verification code to the email address via the `/passwordless/start` endpoint
3. **User enters OTP** - The user checks their email and enters the code
4. **Token exchange** - The app exchanges the OTP for tokens via the `/oauth/token` endpoint with `grant_type: http://auth0.com/oauth/grant-type/passwordless/otp`

### Biometrics + PIN onboarding
- First-time sign-up: optional onboarding to enable Face ID/Touch ID (if available) and create a 6-digit PIN for app unlock.
- Returning users: if PIN/biometrics are set, the app shows a lock screen and can prompt biometrics first.
- Security screen: toggle biometrics and update the PIN after logging in.

#### Auth0 Dashboard Configuration for Email OTP

To enable Email OTP passwordless login, configure the following in your Auth0 Dashboard:

1. **Enable Passwordless Email Connection:**
   - Go to **Authentication** > **Passwordless**
   - Enable the **Email** toggle
   - Configure email settings (subject, message template, OTP expiry, etc.)

2. **Enable Passwordless OTP Grant Type:**
   - Go to **Applications** > **Your Application** > **Settings**
   - Scroll to **Advanced Settings** > **Grant Types**
   - Enable **Passwordless OTP**

3. **Enable the Email Passwordless Connection for your Application:**
   - Go to **Applications** > **Your Application** > **Connections**
   - Under **Passwordless**, enable **email**

### Profile Screen
After login, the app displays a profile screen showing all user claims from the ID token, including:
- Email
- Name
- Profile picture
- Sub (user ID)
- Email verification status
- Any custom claims

## Tech Stack

- React Native 0.79.2
- React 19.0.0
- react-native-auth0 5.0.0-beta.1
- TypeScript 5.0.4

## License

MIT
