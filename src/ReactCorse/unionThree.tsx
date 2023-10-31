// _____Redux (Redux Toolkit)______
//единый state менеджер
//У redux есть множество минусов, очень массивным с огромных числом дополнительный действий

//---------------------
//Создание хранилища

//store.ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {}
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispath = typeof store.dispatch;

//main.tsx
import { Provider } from 'react-redux';
import { store } from './store/store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

//----------------------
//