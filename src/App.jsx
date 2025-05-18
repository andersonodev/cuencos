
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from './context/AuthContext';
import { queryClient } from './lib/queryClient';

// Pages
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
import MyTicketsPage from './pages/MyTicketsPage';
import FavoritesPage from './pages/FavoritesPage';
import LogoutPage from './pages/LogoutPage';
import NotFound from './pages/NotFound';
import TicketSelectionPage from './pages/TicketSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import ChangeEmailPage from './pages/ChangeEmailPage';

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events/:id" element={<EventDetailsPage />} />
              <Route path="/events/:id/buy" element={<TicketSelectionPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/email" element={<ChangeEmailPage />} />
              <Route path="/my-tickets" element={<MyTicketsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/logout" element={<LogoutPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
