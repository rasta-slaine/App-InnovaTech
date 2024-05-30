

import { Stack } from 'expo-router';
import 'react-native-reanimated';


import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

import queryClient from '@/api/queryClient';


export default function RootLayout() {
  
  return (
    <QueryClientProvider client={queryClient}>
          <Stack
            screenOptions={{
              headerStyle:{
                backgroundColor:"#121212"
              },
              headerTintColor:"#fff",
              statusBarColor:"#111"
            }}
            
          >
        
            <Stack.Screen name='index' options={{headerShown:false}}/>
          </Stack>
    </QueryClientProvider>
  )
}
