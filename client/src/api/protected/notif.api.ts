'use client';
import axios from '@/configs/axios-instance-client';
import { handleRequest } from '@/configs/api.helper';
import { GetAllList } from '@/interfaces/shared-api.interface';

export async function getAllNotificationList(): Promise<GetAllList> {
  return handleRequest(axios.get('/notifications/get-all-notif-list'));
}