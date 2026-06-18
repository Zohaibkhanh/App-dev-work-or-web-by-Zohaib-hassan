# Deployment Guide

This guide will help you deploy your Expense app to Vercel (web) and build an Android APK.

## 🚀 Deploy to Vercel (Web)

### Prerequisites
- A Vercel account (sign up at https://vercel.com)
- Git repository (GitHub, GitLab, or Bitbucket)

### Steps:

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your Git repository
   - Vercel will automatically detect the configuration
   - Click "Deploy"

   Or use Vercel CLI:
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Your app will be live at:** `https://your-project.vercel.app`

---

## 📱 Build Android APK

### Prerequisites
- Expo account (sign up at https://expo.dev)
- EAS CLI installed globally

### Steps:

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure your project:**
   ```bash
   eas build:configure
   ```

4. **Build Android APK (Preview/Testing):**
   ```bash
   eas build --platform android --profile preview
   ```
   This will create an APK file that you can install on your Android device.

5. **Build Android APK (Production):**
   ```bash
   eas build --platform android --profile production
   ```

6. **Download your APK:**
   - After the build completes, you'll get a link to download the APK
   - Or visit https://expo.dev and go to your project's builds section
   - Download the APK file
   - Install it on your Android device

### Alternative: Local Build (Advanced)

If you want to build locally, you need Android Studio and Android SDK:

```bash
# Install Expo CLI
npm install -g expo-cli

# Build locally
eas build --platform android --local
```

---

## 📝 Notes

- **Vercel**: Best for web deployment. Your app will be accessible via browser.
- **EAS Build**: Best for mobile app builds (APK for Android, IPA for iOS).
- The APK file can be installed directly on Android devices without Google Play Store.

---

## 🔧 Troubleshooting

### Vercel Build Fails
- Make sure `vercel.json` is in the root directory
- Check that all dependencies are in `package.json`
- Ensure `yarn` or `npm` is used consistently

### EAS Build Fails
- Make sure you're logged in: `eas login`
- Check that `eas.json` is in the root directory
- Verify `app.json` has the Android package name
- Check build logs at https://expo.dev

---

## 📦 Build Profiles Explained

- **preview**: For testing, creates APK file
- **production**: For release, creates APK or AAB (Android App Bundle)
- **development**: For development builds with Expo Go


