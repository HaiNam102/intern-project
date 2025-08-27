import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Shelf, RealtimeShelfOsaRate, RealtimeShelfDetail, ShelfWebSocketMessage } from '../services/types';

const WEBSOCKET_URL = 'http://localhost:8085/ws';
const SUBSCRIPTION_TOPIC = '/topic/shelf-updates';

export const useShelfWebSocket = () => {
    const [shelves, setShelves] = useState<Map<string, Shelf>>(new Map());
    const [osaRateData, setOsaRateData] = useState<Map<string, RealtimeShelfOsaRate[]>>(new Map());
    const [shelfDetails, setShelfDetails] = useState<Map<string, RealtimeShelfDetail>>(new Map());
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(WEBSOCKET_URL),
            reconnectDelay: 5000,
            onConnect: () => {
                setIsConnected(true);
                client.subscribe(SUBSCRIPTION_TOPIC, (message) => {
                    const data: ShelfWebSocketMessage = JSON.parse(message.body);
                    console.log('Received WebSocket message:', data);
                    switch (data.type) {
                        // case 'Shelf':
                        //     setShelves(prev => new Map(prev).set(data.shelfId, data));
                        //     break;
                        case 'RealtimeShelfOsaRate':
                            setOsaRateData(prev => {
                                const newData = new Map(prev);
                                const currentData = newData.get(data.shelfId) || [];
                                // Keep only the last 20 data points for performance
                                const updatedData = [...currentData, data].slice(-20);
                                newData.set(data.shelfId, updatedData);
                                return newData;
                            });
                            break;
                        case 'RealtimeShelfDetail':
                            setShelfDetails(prev => new Map(prev).set(data.shelfId, data));
                            break;
                    }
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, []);

    return { shelves, osaRateData, shelfDetails, isConnected };
};
