import React from 'react';
import { View, Text } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import './config/ReactotronConfig';
import { store, persistor } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <View>
          <Text>Oi</Text>
        </View>
      </PersistGate>
    </Provider>
  );
}
