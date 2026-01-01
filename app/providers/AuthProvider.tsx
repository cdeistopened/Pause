import React from "react";
import { ClerkProvider, ClerkLoaded, useAuth } from "@clerk/clerk-expo";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import * as SecureStore from "expo-secure-store";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

// Dark theme colors matching the app
const COLORS = {
  background: '#0A0E1A',
  surface: '#162235',
  primary: '#d4a954',
  textPrimary: '#F0F4F8',
  textSecondary: '#8A9BB5',
};

// Check if Convex URL is properly configured
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const isConvexConfigured = convexUrl && convexUrl.startsWith('https://');

// Only create Convex client if URL is configured
const convex = isConvexConfigured ? new ConvexReactClient(convexUrl) : null;

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("SecureStore getToken error:", error);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("SecureStore saveToken error:", error);
    }
  },
  async deleteToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("SecureStore deleteToken error:", error);
    }
  },
};

function ConvexProviderWithAuth({ children }: { children: React.ReactNode }) {
  // If Convex is not configured, show a setup message
  if (!convex) {
    return (
      <View style={styles.setupContainer}>
        <View style={styles.setupCard}>
          <Text style={styles.setupTitle}>Setup Required</Text>
          <Text style={styles.setupText}>
            To use this app, you need to configure Convex and Clerk.
          </Text>
          <Text style={styles.setupText}>
            Please follow the setup instructions in SETUP.md
          </Text>
          <Text style={styles.setupStep}>
            1. Set up your Convex project{'\n'}
            2. Set up your Clerk application{'\n'}
            3. Add environment variables to .env.local
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // If Clerk is not configured, show setup message
  if (!publishableKey) {
    return (
      <View style={styles.setupContainer}>
        <View style={styles.setupCard}>
          <Text style={styles.setupTitle}>Setup Required</Text>
          <Text style={styles.setupText}>
            To use this app, you need to configure Convex and Clerk.
          </Text>
          <Text style={styles.setupText}>
            Please follow the setup instructions in SETUP.md
          </Text>
          <Text style={styles.setupStep}>
            1. Set up your Convex project{'\n'}
            2. Set up your Clerk application{'\n'}
            3. Add environment variables to .env.local
          </Text>
        </View>
      </View>
    );
  }
  
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ConvexProviderWithAuth>
          {children}
        </ConvexProviderWithAuth>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

export default AuthProvider;

const styles = StyleSheet.create({
  setupContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  setupCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 32,
    maxWidth: 400,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  setupTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  setupText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 24,
    textAlign: 'center',
  },
  setupStep: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});