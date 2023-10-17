'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';

type Props = { isPro: boolean; size: any };

const SubscriptionBtn = ({ isPro, size }: Props) => {
  const [loading, setLoading] = useState(false);
  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/stripe');
      window.location.href = response.data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant='outline'
      size={size}
      disabled={loading}
      onClick={handleSubscription}
    >
      {isPro ? 'Manage Subscription' : 'Get Pro'}
    </Button>
  );
};

export default SubscriptionBtn;
