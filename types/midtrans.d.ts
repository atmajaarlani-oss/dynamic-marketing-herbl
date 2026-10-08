declare module 'midtrans-client' {
  export class Snap {
    constructor(config: { isProduction: boolean; clientKey: string; serverKey?: string })
    createTransaction(payload: unknown): Promise<string>
  }
}
