import { RecoilRoot } from 'recoil';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import { router } from './router';

type Props = {};

function App({}: Props) {
  return (
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  );
}

export default App;
