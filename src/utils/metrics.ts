
export type Metric = {
  name: string;
  value: string | number;
  unit: string;
};

export type ComparisonCardProps = {
  title: string;
  data: Metric[];
};

export type MetricsData = {
  vapi: Metric[];
  elevenlabs: Metric[];
};

export const metrics: MetricsData = {
  vapi: [
    { name: 'Latencia de Respuesta', value: '150', unit: 'ms' },
    { name: 'Precisión de Transcripción', value: '98', unit: '%' },
    { name: 'Naturalidad de la Voz (MOS)', value: '4.5', unit: '/ 5' },
    { name: 'Costo por Minuto', value: '0.004', unit: '$' },
  ],
  elevenlabs: [
    { name: 'Latencia de Respuesta', value: '200', unit: 'ms' },
    { name: 'Precisión de Transcripción', value: '97', unit: '%' },
    { name: 'Naturalidad de la Voz (MOS)', value: '4.8', unit: '/ 5' },
    { name: 'Costo por Minuto', value: '0.006', unit: '$' },
  ],
};