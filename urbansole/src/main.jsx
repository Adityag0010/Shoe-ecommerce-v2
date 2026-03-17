import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"; // Use react-router-dom
import { Suspense, lazy } from "react";
import { HelmetProvider } from "react-helmet-async";
import ErrorPage from './components/ErrorPage.jsx';

const AboutUs = lazy(() => import('./components/FooterNav/AboutUs.jsx'));
const ContactUs = lazy(() => import('./components/FooterNav/ContactUs.jsx'));
const BrandsLogoPage = lazy(() => import('./components/FooterNav/BrandsFooter.jsx'));
const Registration = lazy(() => import('./components/Registration/Registration.jsx'));
const ShoeDetail = lazy(() => import('./components/shoeDetail.jsx'));
const HelpCenter = lazy(() => import('./components/FooterNav/HelpCenter.jsx'));
const DummyFooterNavpage = lazy(() => import('./components/FooterNav/DummyNavpage.jsx'));
const AllShoePage = lazy(() => import('./components/allShoePage.jsx'));
const ProfilePage = lazy(() => import('./components/userProfilePage/Userprofile'));
const AdminPanelApp = lazy(() => import('./components/Admin/AdminPanel.jsx'));
const Home = lazy(() => import('./components/home-page/home-page'));
const LoginPage = lazy(() => import('./components/Registration/Login.jsx'));
const CartPage = lazy(() => import('./components/Cart/cart.jsx'));
const Checkout = lazy(() => import('./components/Checkout/checkout.jsx'));
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51S7kEwCuLYao8YIpCH25OI99AmSYXjXo2IGONh16L6cXsVzrh1KQSJacgVVAruytqMqI1K5dNPj9fkOaNT8igidM000UEOYn95');


const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'collections/:queryType',
        element: <AllShoePage />
      },
      {
        path: 'about',
        element: <AboutUs />
      },
      {
        path: 'contact',
        element: <ContactUs />
      },
      {
        path: 'brandsLogo',
        element: <BrandsLogoPage />
      },
      {
        path: 'register',
        element: <Registration />
      }, {
        path: 'shoe/:id',
        element: <ShoeDetail />
      }, {
        path: 'support',
        element: <HelpCenter />
      },
      {
        path: 'Pages/:pageName',
        element: <DummyFooterNavpage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />
      }, {
        path: 'login',
        element: <LoginPage/>
      },
      {
        path: 'admin',
        element: <AdminPanelApp />
      },
      {
        path: 'cart',
        element : <CartPage/>
      },{
        path: 'checkout/:orderId',
        element: (
                    <Elements stripe={stripePromise}>
                        <Checkout/>
                    </Elements>
                ),
      }
    ],
    errorElement: <ErrorPage />
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div></div>}>
        <RouterProvider router={AppRouter} />
      </Suspense>
    </HelmetProvider>
  </StrictMode>,
)