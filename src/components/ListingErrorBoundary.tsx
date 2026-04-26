import { Component, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ListingErrorBoundaryProps {
  children: ReactNode;
  onTryAgain?: () => void;
}

interface ListingErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ListingErrorBoundary extends Component<
  ListingErrorBoundaryProps,
  ListingErrorBoundaryState
> {
  public state: ListingErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  public static getDerivedStateFromError(error: Error): ListingErrorBoundaryState {
    return {
      hasError: true,
      message: error.message,
    };
  }

  public componentDidCatch(error: Error): void {
    console.error('Create listing failed:', error);
  }

  private handleTryAgain = (): void => {
    this.setState({ hasError: false, message: '' });
    this.props.onTryAgain?.();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>Network Error: Please enter listing manually</Text>
          <Text style={styles.fallbackBody}>
            AI generation failed unexpectedly. You can retry or type your listing details by hand.
          </Text>

          {!!this.state.message && <Text style={styles.errorCode}>Error: {this.state.message}</Text>}

          <Pressable style={styles.tryAgainButton} onPress={this.handleTryAgain}>
            <Text style={styles.tryAgainText}>Try AI Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  fallbackContainer: {
    flex: 1,
    margin: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5C2C7',
    backgroundColor: '#FFF5F6',
    padding: 16,
    justifyContent: 'center',
  },
  fallbackTitle: {
    color: '#B00020',
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '900',
  },
  fallbackBody: {
    marginTop: 8,
    color: '#5F2129',
    fontSize: 14,
    lineHeight: 20,
  },
  errorCode: {
    marginTop: 10,
    color: '#7A2F38',
    fontSize: 12,
  },
  tryAgainButton: {
    marginTop: 16,
    borderRadius: 10,
    backgroundColor: '#B00020',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  tryAgainText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
