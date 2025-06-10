import { useState, useEffect } from 'react';
import { getAllMessages, getMessageCount, getMessageAtIndex } from '@/services/contract';
import { Message, UIMessage, ContractResponse } from '@/types';

/**
 * Custom hook to fetch and manage messages from the billboard contract
 * @returns Object containing messages, loading state, error, and refetch function
 */
export function useMessages(): ContractResponse<UIMessage[]> {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(undefined);
      
      const result = await getAllMessages();
      
      // Transform messages and add index
      const uiMessages: UIMessage[] = result.map((msg, index) => ({
        ...msg,
        index,
        // For Phase 1, we'll consider the most recent message as featured
        isFeatured: index === result.length - 1
      }));
      
      setMessages(uiMessages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    data: messages,
    loading,
    error,
    refetch: fetchMessages
  };
}

/**
 * Custom hook to fetch a specific message by index
 * @param index Message index
 * @returns Object containing the message, loading state, error, and refetch function
 */
export function useMessageByIndex(index: number): ContractResponse<UIMessage> {
  const [message, setMessage] = useState<UIMessage | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchMessage = async () => {
    try {
      setLoading(true);
      setError(undefined);
      
      const result = await getMessageAtIndex(index);
      
      setMessage({
        ...result,
        index
      });
    } catch (err) {
      console.error(`Error fetching message at index ${index}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessage();
  }, [index]);

  return {
    data: message,
    loading,
    error,
    refetch: fetchMessage
  };
}

/**
 * Custom hook to fetch the featured message (most recent in Phase 1)
 * @returns Object containing the featured message, loading state, error, and refetch function
 */
export function useFeaturedMessage(): ContractResponse<UIMessage> {
  const [message, setMessage] = useState<UIMessage | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchFeaturedMessage = async () => {
    try {
      setLoading(true);
      setError(undefined);
      
      // Get the message count to determine the index of the most recent message
      const count = await getMessageCount();
      
      if (count === 0) {
        setMessage(undefined);
        setLoading(false);
        return;
      }
      
      // Get the most recent message (index = count - 1)
      const result = await getMessageAtIndex(count - 1);
      
      setMessage({
        ...result,
        index: count - 1,
        isFeatured: true
      });
    } catch (err) {
      console.error('Error fetching featured message:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedMessage();
  }, []);

  return {
    data: message,
    loading,
    error,
    refetch: fetchFeaturedMessage
  };
}