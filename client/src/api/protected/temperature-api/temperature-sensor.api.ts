'use client';

import axios from '@/configs/axios-instance-client';
import { TemperatureData } from './temperature-sensor.interface';
import { handleRequest } from '@/configs/api.helper';

export async function startTemperatureSimulation(): Promise<any> {
  return handleRequest(axios.post('/sensors/temperature/start'));
}


export async function stopTemperatureSimulation(): Promise<any> {
  return handleRequest(axios.post('/sensors/temperature/stop'));
}
