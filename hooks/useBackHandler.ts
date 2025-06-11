import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useRouter } from 'expo-router';

interface UseBackHandlerProps {
     onBackPress?: () => boolean | void;
     enabled?: boolean;
}

export const useBackHandler = ({ onBackPress, enabled = true }: UseBackHandlerProps = {}) => {
     const router = useRouter();

     useEffect(() => {
          if (!enabled) return;

          console.log(`🔧 BackHandler: Setting up handler with custom: ${!!onBackPress}`);

          const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
               console.log(`🔙 BackHandler: Back pressed, has custom handler: ${!!onBackPress}`);

               // If custom handler is provided, use it
               if (onBackPress) {
                    console.log("🔙 BackHandler: Executing custom handler");
                    const result = onBackPress();
                    console.log(`🔙 BackHandler: Custom handler returned: ${result}`);
                    // If the custom handler returns true, prevent default behavior
                    return result === true;
               }

               // Default behavior: use Expo Router's navigation stack
               console.log(`🔙 BackHandler: Using default navigation, canGoBack: ${router.canGoBack()}`);
               if (router.canGoBack()) {
                    router.back();
                    return true; // Prevent default back behavior (going to home)
               }

               // If we're at the root screen, allow default behavior (exit app)
               console.log("🔙 BackHandler: At root, allowing default behavior");
               return false;
          });

          return () => {
               console.log("🔧 BackHandler: Cleaning up handler");
               backHandler.remove();
          };
     }, [onBackPress, enabled, router]);
};

export default useBackHandler; 