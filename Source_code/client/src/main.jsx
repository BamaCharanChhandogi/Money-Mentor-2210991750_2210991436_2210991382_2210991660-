import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { store } from './store/store.js'
import { BrowserRouter  } from 'react-router-dom';
import { Provider } from 'react-redux'
import { SocketProvider } from './context/SocketContext.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
    <SocketProvider>
    <App />
    </SocketProvider>
    </BrowserRouter>
  </Provider>
)
