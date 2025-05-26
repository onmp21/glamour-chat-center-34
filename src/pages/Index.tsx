
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { ChannelProvider } from '@/contexts/ChannelContext';
import { MainLayout } from '@/components/MainLayout';

const Index = () => {
  return (
    <AuthProvider>
      <ChatProvider>
        <ChannelProvider>
          <MainLayout />
        </ChannelProvider>
      </ChatProvider>
    </AuthProvider>
  );
};

export default Index;
