import { authApi } from '../authApi';
import { authMock } from '../authMock';
import { definirToken } from '../http';

jest.mock('../config', () => ({ API_URL: 'https://api.teste', modoApi: true }));
jest.mock('../latencia', () => ({ espera: async () => {} }));

const USUARIO_DA_API = {
  nome: 'Daniel Moraes',
  apelido: 'Daniel',
  email: 'daniel@email.com',
  telefone: '+5541999998888',
  funcao: 'Cliente',
  idioma: 'Português (Brasil)',
  membroDesde: 'outubro de 2026',
  objetivo: 'Monitoramento de ar e poluentes',
};

const fetchMock = jest.fn();
function responder(status: number, corpo?: unknown) {
  fetchMock.mockResolvedValueOnce({
    ok: status < 300,
    status,
    json: async () => corpo,
  } as Response);
}
const corpoEnviado = (i = 0) => JSON.parse(fetchMock.mock.calls[i][1].body);

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  definirToken(null);
});

describe('authApi', () => {
  it('login: devolve a sessão com o telefone formatado para exibição', async () => {
    responder(200, { token: 't0k3n', usuario: USUARIO_DA_API });
    const sessao = await authApi.entrar('  Daniel@Email.com ', 'Senha@123');

    expect(corpoEnviado()).toEqual({ email: 'Daniel@Email.com', senha: 'Senha@123' });
    expect(sessao.token).toBe('t0k3n');
    expect(sessao.usuario.telefone).toBe('+55 (41) 99999-8888');
    expect(sessao.usuario.nome).toBe('Daniel Moraes');
  });

  it('cadastro: envia a CHAVE do objetivo e omite o telefone vazio', async () => {
    responder(201, { token: 't', usuario: USUARIO_DA_API });
    await authApi.cadastrar({
      nome: ' Daniel Moraes ',
      email: 'daniel@email.com',
      telefone: '',
      senha: 'Senha@123',
      objetivo: 'alergia',
      aceitouTermos: true,
    });

    const corpo = corpoEnviado();
    expect(corpo.objetivo).toBe('alergia');
    expect(corpo.nome).toBe('Daniel Moraes');
    expect(corpo).not.toHaveProperty('telefone');
    expect(corpo.aceitouTermos).toBe(true);
  });

  it('cadastro: com telefone, envia como o usuário digitou (a API normaliza)', async () => {
    responder(201, { token: 't', usuario: USUARIO_DA_API });
    await authApi.cadastrar({
      nome: 'Daniel Moraes',
      email: 'daniel@email.com',
      telefone: '(41) 99999-8888',
      senha: 'Senha@123',
      objetivo: 'ar',
      aceitouTermos: true,
    });
    expect(corpoEnviado().telefone).toBe('(41) 99999-8888');
  });

  it('recuperação: o pedido não traz código (ele sai por e-mail) e usa a validade da API', async () => {
    responder(202, { expiraEmSegundos: 300 });
    const pedido = await authApi.pedirCodigo(' a@b.com ');

    expect(pedido).toEqual({ email: 'a@b.com', expiraEmSegundos: 300 });
    expect(pedido.codigoParaDemonstracao).toBeUndefined();
  });

  it('recuperação: conferir e redefinir mandam e-mail, código e senha', async () => {
    responder(204);
    await authApi.conferirCodigo('a@b.com', ' 123456 ');
    responder(204);
    await authApi.redefinirSenha('a@b.com', '123456', 'Nova@1234');

    expect(corpoEnviado(0)).toEqual({ email: 'a@b.com', codigo: '123456' });
    expect(corpoEnviado(1)).toEqual({ email: 'a@b.com', codigo: '123456', senha: 'Nova@1234' });
    expect(fetchMock.mock.calls[1][0]).toBe('https://api.teste/v1/auth/recuperacao/redefinir');
  });

  it('código errado: a mensagem da API chega à tela', async () => {
    responder(400, {
      erro: { codigo: 'CODIGO_INVALIDO', mensagem: 'Código inválido ou expirado.' },
    });
    await expect(authApi.conferirCodigo('a@b.com', '000000')).rejects.toThrow(
      'Código inválido ou expirado.',
    );
  });

  it('restaurar: devolve o usuário com o token válido e null quando a sessão caiu', async () => {
    definirToken('valido');
    responder(200, { usuario: USUARIO_DA_API });
    expect((await authApi.restaurar())?.email).toBe('daniel@email.com');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer valido');

    responder(401, {
      erro: { codigo: 'SESSAO_INVALIDA', mensagem: 'Sua sessão expirou. Entre novamente.' },
    });
    expect(await authApi.restaurar()).toBeNull();
  });

  it('restaurar: com a API fora do ar, o erro sobe (não vira "sessão inválida")', async () => {
    definirToken('valido');
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    await expect(authApi.restaurar()).rejects.toThrow(/Não foi possível conectar/);
  });

  it('sair: chama o logout com o token', async () => {
    definirToken('valido');
    responder(204);
    await authApi.sair();
    expect(fetchMock.mock.calls[0][0]).toBe('https://api.teste/v1/auth/logout');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer valido');
  });
});

describe('authMock (modo demonstração)', () => {
  it('não revela se o e-mail existe: e-mail desconhecido não dá erro nem código', async () => {
    const pedido = await authMock.pedirCodigo('ninguem@email.com');
    expect(pedido.codigoParaDemonstracao).toBeUndefined();
    expect(pedido.expiraEmSegundos).toBe(300);
  });

  it('a conta de demonstração recebe o código e consegue redefinir a senha', async () => {
    const pedido = await authMock.pedirCodigo('ana.silva@email.com');
    expect(pedido.codigoParaDemonstracao).toMatch(/^\d{6}$/);
    await authMock.conferirCodigo('ana.silva@email.com', pedido.codigoParaDemonstracao!);
    await authMock.redefinirSenha(
      'ana.silva@email.com',
      pedido.codigoParaDemonstracao!,
      'Nova@1234',
    );
    const sessao = await authMock.entrar('ana.silva@email.com', 'Nova@1234');
    expect(sessao.usuario.email).toBe('ana.silva@email.com');
  });

  it('cadastro: o objetivo escolhido vira o texto de exibição', async () => {
    const sessao = await authMock.cadastrar({
      nome: 'Maria Souza',
      email: 'maria@email.com',
      telefone: '',
      senha: 'Senha@123',
      objetivo: 'conforto',
      aceitouTermos: true,
    });
    expect(sessao.usuario.objetivo).toBe('Conforto e automação');
  });
});
