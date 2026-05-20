import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import toast from 'react-hot-toast';

export function useWebSocket(token, onMessageReceived) {
  const [connected, setConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => console.log('STOMP: ', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      setConnected(true);
      console.log('Connected to WebSocket!');
      toast.success('Real-time connection established', { position: 'bottom-right' });
      
      client.subscribe('/user/queue/expenses', (msg) => {
        if (msg.body) {
          const event = JSON.parse(msg.body);
          onMessageReceived(event);
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      toast.error('Real-time connection error', { position: 'bottom-right' });
    };

    client.onDisconnect = () => {
      setConnected(false);
      console.log('Disconnected from WebSocket');
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [token, onMessageReceived]);

  return { connected };
}
