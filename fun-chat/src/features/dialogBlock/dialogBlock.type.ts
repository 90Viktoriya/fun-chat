import type { MessageResponse } from '../../api/websocket.type';

export type Status = 'read' | 'send' | 'delivered' | '';

export type UpdateCountUnread = (login: string, count: number) => void;

export type MessageMap = Map<string, string[]>;

export type DataMap = Map<string, MessageResponse[]>;
