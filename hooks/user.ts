'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export const useUserClient = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const supabaseClient = createClient();

  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUserId();
  }, [supabaseClient]);

  return { userId };
};
