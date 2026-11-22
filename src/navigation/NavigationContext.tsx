import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

export type ScreenName = 'Home' | 'Conversation';

export type Route =
  | { name: 'Home'; params?: undefined }
  | { name: 'Conversation'; params: { contactId: string } };

type NavigationContextType = {
  currentRoute: Route;
  navigate: (screen: 'Home') => void;
  navigateToConversation: (contactId: string) => void;
  goBack: () => boolean;
  canGoBack: boolean;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stack, setStack] = useState<Route[]>([{ name: 'Home' }]);

  const currentRoute = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  const navigate = useCallback((screen: 'Home') => {
    setStack([{ name: screen }]);
  }, []);

  const navigateToConversation = useCallback((contactId: string) => {
    setStack((prev) => [...prev, { name: 'Conversation', params: { contactId } }]);
  }, []);

  const goBack = useCallback(() => {
    if (stack.length > 1) {
      setStack((prev) => prev.slice(0, prev.length - 1));
      return true;
    }
    return false;
  }, [stack.length]);

  // Intercept Android hardware back button and gesture navigation
  useEffect(() => {
    const handleHardwareBack = () => {
      if (canGoBack) {
        goBack();
        return true; // Handled: do NOT exit the app
      }
      return false; // On Home screen: allow normal exit/minimize
    };

    const backSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleHardwareBack
    );

    return () => {
      backSubscription.remove();
    };
  }, [canGoBack, goBack]);

  return (
    <NavigationContext.Provider
      value={{
        currentRoute,
        navigate,
        navigateToConversation,
        goBack,
        canGoBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
