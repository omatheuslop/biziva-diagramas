# Biziva Diagramas

Fork completo de [jgraph/drawio](https://github.com/jgraph/drawio). Créditos, histórico e licenças originais preservados; a Biziva não é autora do aplicativo original. Consulte LICENSE e os avisos das dependências, incluindo os termos AGPL quando aplicáveis.

## Melhorias Biziva

Fluxos de atendimento com nós e conexões nativos editáveis, preservação do diagrama e revisão local de decisões e nós isolados.

O assistente usa chave API do próprio visitante, autorização explícita e nenhuma repetição automática de uma geração incerta. A chave não é incluída no código nem em saldo compartilhado. Importação do resultado exige revisão do rascunho. Revisões locais não consomem IA. A edição nativa continua disponível sem cadastro.

## Reconstruir a edição web

Use Node 24. As dependências e versões continuam nos manifests/lockfiles originais. Na raiz:

```sh
O aplicativo web compilado original está em src/main/webapp. Os módulos Biziva são ESM locais; não exigem reconstruir o núcleo Java/Ant para servir esta edição web.
```

## Fontes da hospedagem

`biziva-hosting-source.tar.gz` contém todos os fontes legíveis do servidor de hospedagem, proxy, página de conta, scripts de build e lockfile. Não contém node_modules, builds, credenciais ou a identidade privada de um projeto Sites. O SHA-256 do arquivo está em `biziva-hosting-source.sha256`. Extraia em uma pasta nova com `tar -xzf biziva-hosting-source.tar.gz`, entre em `biziva-hosting`, execute `npm ci --ignore-scripts`, `node prepare-native.mjs` e `npm run build`. Para outra hospedagem configure a integração de autenticação correspondente; `/signin-with-chatgpt` é fornecido pelo Sites. Nunca aceite cabeçalhos de identidade diretamente do visitante. Crie e associe seu próprio projeto Sites ao republicar; não reutilize identidade de outro proprietário.

As funções de colaboração, armazenamento remoto e IA do upstream exigem configuração própria. Nesta publicação o trabalho fica no navegador; o login identifica a sessão e não promete sincronização. 

O login não inclui crédito de IA. Exportações e armazenamento local exigem que o usuário guarde seus arquivos; limpar dados do navegador pode removê-los. Esta melhoria não representa auditoria integral de todas as dependências upstream.
