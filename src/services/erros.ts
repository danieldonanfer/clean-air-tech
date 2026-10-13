/** Erro de regra de negócio: a mensagem já está pronta para a tela mostrar. */
export class ErroDeRegra extends Error {
  /** Código estável vindo da API (ex.: CREDENCIAIS_INVALIDAS), quando houver. */
  readonly codigo?: string;
  /** Mensagem por campo, quando a API devolve VALIDACAO. */
  readonly campos?: Record<string, string>;

  constructor(mensagem: string, detalhes?: { codigo?: string; campos?: Record<string, string> }) {
    super(mensagem);
    this.name = 'ErroDeRegra';
    this.codigo = detalhes?.codigo;
    this.campos = detalhes?.campos;
  }
}
