# CRM WhatsApp Trello Extension

Extensão do Chrome que adiciona um painel lateral ao WhatsApp Web para criar cards no Trello a partir de conversas existentes. O painel permite salvar as credenciais da API e gerar cards com resumo e mensagens recentes da conversa ativa.

## Recursos

- Painel lateral fixo injetado no WhatsApp Web com React + Tailwind CSS 3.
- Formulário integrado para configurar API Key, Token e List ID do Trello.
- Criação de cards no Trello com título, resumo e histórico de mensagens recentes.
- Armazenamento seguro de credenciais usando `chrome.storage.sync`.
- Opções dedicadas em `chrome://extensions` para editar credenciais.

## Pré-requisitos

- Node.js 18 LTS (recomendado **Node 20+** para evitar avisos do Undici).
- npm 8+.

## Instalação

```bash
npm install
```

## Scripts disponíveis

```bash
npm run dev      # Inicia Vite com recarregamento e build em modo watch
npm run build    # Gera artefatos de produção em ./dist
npm run preview  # Servidor para pré-visualizar a build gerada
npm run lint     # Analisa o código com ESLint
```

> Os scripts usam um polyfill simples para o objeto global `File`, necessário ao executar Vite em ambientes Node 18.

## Como executar em modo desenvolvimento

1. Execute `npm run dev` para gerar builds de desenvolvimento.
2. Abra `chrome://extensions` em um navegador baseado em Chromium.
3. Ative o **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação** e selecione a pasta `dist` gerada pelo comando acima.
5. Abra [https://web.whatsapp.com](https://web.whatsapp.com) e verifique o painel lateral.

## Build de produção

```bash
npm run build
```

Carregue a pasta `dist` em `chrome://extensions` seguindo os mesmos passos do modo desenvolvimento.

## Estrutura do projeto

```
src/
├── background/        # Service worker responsável pela comunicação com o Trello
├── content-script/    # Painel lateral e assets Tailwind injetados no WhatsApp Web
├── options/           # Página de configurações acessível via chrome://extensions
└── shared/            # Serviços reutilizáveis (storage, Trello client, parser)
```

## Próximos passos sugeridos

- Permitir seleção dinâmica de boards/listas diretamente do Trello.
- Exibir status dos cards criados e link direto para o Trello.
- Sincronizar histórico de cards criados por contato.

## Licença

Distribuído sob a licença MIT.
