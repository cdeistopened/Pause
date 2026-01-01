import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component catches JavaScript errors in child components,
 * logs them, and displays a fallback UI instead of crashing the app.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    // In production, you would send this to an error tracking service
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <AlertTriangle size={48} color="#d4a954" strokeWidth={1.5} />
            </View>

            <Text style={styles.title}>Something went wrong</Text>

            <Text style={styles.message}>
              We encountered an unexpected error. Please try again.
            </Text>

            <Pressable
              style={styles.retryButton}
              onPress={this.handleRetry}
              accessibilityLabel="Try again"
              accessibilityRole="button"
            >
              <RefreshCw size={20} color="#0A0E1A" strokeWidth={2} />
              <Text style={styles.retryText}>Try Again</Text>
            </Pressable>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorText}>
                  {this.state.error.message}
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(212, 169, 84, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0F4F8',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#8A9BB5',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d4a954',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0A0E1A',
  },
  errorDetails: {
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 12,
    width: '100%',
  },
  errorText: {
    fontSize: 12,
    color: '#ff6b6b',
    fontFamily: 'monospace',
  },
});

export default ErrorBoundary;
