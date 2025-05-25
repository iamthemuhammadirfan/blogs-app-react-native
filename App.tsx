/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {BlogProvider} from './src/context/BlogContext';
import HomeScreen from './src/screens/HomeScreen';

function App(): React.JSX.Element {
  return (
    <BlogProvider>
      <HomeScreen />
    </BlogProvider>
  );
}

export default App;
