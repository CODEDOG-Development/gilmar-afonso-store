/** Erro HTTP simulado: o adaptador transforma em AxiosError com o status informado. */
export class MockHttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export interface MockRequest<TBody = unknown> {
  params: Record<string, string>
  query: URLSearchParams
  body: TBody
  headers: Record<string, string>
}

export type MockHandler = (req: MockRequest<never>) => unknown | Promise<unknown>
