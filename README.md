# Requisitos para a aplicação Ana Gaming

É necessário seguir todos os passos abaixo para que a aplicação funcione corretamente.

### Primeiro Passo

Criar uma pasta para este projeto e clonar o repositório

```
mkdir ana-gaming
cd ana-gaming
git clone https://github.com/Guilhermennf/ana-gaming.git .
```

### Segundo passo

Instalar as dependências

```
npm install
```

### Terceiro passo

Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
NEXTAUTH_SECRET=sua_secret_aqui
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=seu_github_id_aqui
GITHUB_SECRET=seu_github_secret_aqui
NEXT_PUBLIC_ODDS_API_KEY=sua_odds_api_key_aqui
```

- Para obter o GITHUB_ID e GITHUB_SECRET, acesse [GitHub Developer Settings](https://github.com/settings/developers) e crie uma nova aplicação OAuth
- Para obter a NEXT_PUBLIC_ODDS_API_KEY, registre-se em [The Odds API](https://the-odds-api.com/)

### Quarto passo

Iniciar a aplicação

```
npm run dev
```

Link do deploy: [Ana Gaming](https://ana-gaming.vercel.app/)
