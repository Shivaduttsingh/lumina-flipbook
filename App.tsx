
import React from 'react';
import ViewerLayout from './components/ViewerLayout';
import FlipBookViewer from './components/FlipBookViewer';

const App: React.FC = () => {
  return (
    <ViewerLayout>
      <FlipBookViewer />
    </ViewerLayout>
  );
};

export default App;
