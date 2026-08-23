import React from 'react';
import { router } from './routers/router';
import { RouterProvider } from 'react-router-dom';


const App: React.FC = () => {
  return <RouterProvider router={router}/>
}

export default App;