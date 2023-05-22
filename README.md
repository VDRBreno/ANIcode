## 📃 Que isso?

Bot para Discord que entrega problemas de código para uma ou mais pessoas.

### Como usar?

> Necessário ter instalado em sua máquina: 
> - [Git][git] para clonar o projeto
> - [Node.js][nodejs] para executar

> Em [Discord Developers][discdevs] crie uma aplicação, transforme-a em um bot e ative as Intents para que o projeto funcione corretamente

```bash
# Tem Git instalado? Se não, baixe o código manualmente
git clone https://github.com/VDRBreno/ANIcode.git

# Entrar na pasta do projeto
cd ./ANIcode

# Instalar as dependências
npm install
```

Abra o arquivo `config.json` dentro da pasta `src` e substitua os valores para as informações do seu bot, essas informações podem ser vistas em [Discord Developers][discdevs] na página de seu bot

```json
{
  "token": "TOKEN_BOT",
  "client_id": "CLIENT_ID_BOT"
}
```

```bash
# Dentro da pasta ANIcode use o comando para executar a aplicação
npm run dev
```

No servidor onde o bot foi adicionado, use 'registerCommands' no chat para registrar os comandos em barra

# Importante

O projeto não contém os problemas, apenas a funcionalidade do bot para realizar as interações com os usuários, é possível adicionar problemas editando o arquivo `problems.json` dentro de `src/utils`

```json
{
  "problems": [
    {
      "id": "79ec8b58-763b-4bee-9b48-6c3c1bcebb02",
      "title": "Extremamente Básico",
      "question": "Leia duas linhas, cada linha contém um número, imprima a soma dos números após 'X = '",
      "examples": [
        {
          "input": "10\n9",
          "output": "X = 19"
        }
      ],
      "testCases": [
        {
          "input": "20\n1",
          "output": "X = 21"
        }
      ],
      "solution": "console.log(`X = ${Number(readline())+Number(readline())}`)"
    }
  ]
}
```

## :rocket: Tecnologias

O bot foi feito com:

- [Discord.js][discordjs]
- [TypeScript][typescript]
- [Node.js][nodejs]

[discordjs]: https://discord.js.org
[typescript]: https://www.typescriptlang.org/
[nodejs]: https://nodejs.org/en/
[git]: https://git-scm.com
[discdevs]: https://discord.com/developers/applications/
