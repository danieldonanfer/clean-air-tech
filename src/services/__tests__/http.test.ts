import { ErroDeRegra } from '../erros';
import { aoSessaoExpirar, chamar, definirToken } from '../http';

jest.mock('../config', () => ({ API_URL: 'https://api.teste', modoApi: true }));

function resposta(status: number, corpo?: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => {
      if (corpo === undefined) throw new Error('sem corpo');
      return corpo;
    },
  } as Response;
}

const fetchMock = jest.fn();

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  definirToken(null);
  aoSessaoExpirar(null);
});

describe('chamar', () => {
  it('monta a URL, envia JSON e devolve o corpo', async () => {
    fetchMock.mockResolvedValue(resposta(200, { ok: true }));
    const r = await chamar<{ ok: boolean }>('POST', '/v1/x', {
      corpo: { a: 1 },
      autenticado: false,
    });

    expect(r).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.teste/v1/x');
    expect(init.method).toBe('POST');
    expect(init.body).toBe('{"a":1}');
    expect(init.headers['Content-Type']).toBe('application/json');
  });

  it('envia o token como Bearer, e não o envia nas rotas públicas', async () => {
    definirToken('abc');
    fetchMock.mockResolvedValue(resposta(204));
    await chamar('GET', '/v1/auth/eu');
    await chamar('POST', '/v1/auth/login', { corpo: {}, autenticado: false });

    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer abc');
    expect(fetchMock.mock.calls[1][1].headers.Authorization).toBeUndefined();
  });

  it('204 devolve undefined', async () => {
    fetchMock.mockResolvedValue(resposta(204));
    await expect(chamar('POST', '/v1/auth/logout')).resolves.toBeUndefined();
  });

  it('erro da API vira ErroDeRegra com a mensagem pronta, o código e os campos', async () => {
    fetchMock.mockResolvedValue(
      resposta(422, {
        erro: {
          codigo: 'VALIDACAO',
          mensagem: 'Informe um e-mail válido.',
          campos: { email: 'x' },
        },
      }),
    );
    const falha = await chamar('POST', '/v1/auth/cadastro', { corpo: {} }).catch((e) => e);

    expect(falha).toBeInstanceOf(ErroDeRegra);
    expect(falha.message).toBe('Informe um e-mail válido.');
    expect(falha.codigo).toBe('VALIDACAO');
    expect(falha.campos).toEqual({ email: 'x' });
  });

  it('sem internet, mostra uma mensagem em português', async () => {
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));
    await expect(chamar('GET', '/saude')).rejects.toThrow(/Não foi possível conectar/);
  });

  it('resposta que não é da API (ex.: 502 do provedor) não vaza HTML nem stack', async () => {
    fetchMock.mockResolvedValue(resposta(502));
    const falha = await chamar('GET', '/saude').catch((e) => e);
    expect(falha).toBeInstanceOf(ErroDeRegra);
    expect(falha.message).toMatch(/indisponível/);
    expect(falha.codigo).toBe('HTTP_502');
  });

  it('timeout vira mensagem de lentidão', async () => {
    const abortado = Object.assign(new Error('aborted'), { name: 'AbortError' });
    fetchMock.mockRejectedValue(abortado);
    await expect(chamar('GET', '/saude')).rejects.toThrow(/demorou a responder/);
  });

  it('SESSAO_INVALIDA avisa quem escuta, mas só quando o token foi enviado', async () => {
    const aviso = jest.fn();
    aoSessaoExpirar(aviso);
    fetchMock.mockResolvedValue(
      resposta(401, {
        erro: { codigo: 'SESSAO_INVALIDA', mensagem: 'Sua sessão expirou. Entre novamente.' },
      }),
    );

    await chamar('POST', '/v1/auth/login', { corpo: {}, autenticado: false }).catch(() => {});
    expect(aviso).not.toHaveBeenCalled();

    definirToken('vencido');
    await chamar('GET', '/v1/auth/eu').catch(() => {});
    expect(aviso).toHaveBeenCalledTimes(1);
  });
});
