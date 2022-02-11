# Aula 2 - \[AULA] Vamos configurar a biblioteca e implementar nossos primeiros testes

{% embed url="https://youtu.be/y2IrE2FYl3k" %}

### Configuração do projeto

Vamos utilizar JavaScript puro e uma biblioteca chamada `jest` para os testes unitários.

Nossa primeira missão vai ser construir uma **calculadora** com as operações de `somar`, `subtrair`, `multiplicar` e `dividir`.

Crie uma pasta para o projeto, em algum local de sua preferência.

Abra-a em algum terminal e inicialize o projeto NodeJS, com o comando a seguir, gerando o arquivo `package.json` do novo projeto.

```bash
npm init -y
```

Agora, precisamos instalar a biblioteca `jest`. Para isso, digite o seguinte comando:

```bash
npm i jest --save-dev
```

O argumento `--save-dev` é para deixar claro que essa biblioteca não faz parte do seu código de produção e será utilizada somente nos ambientes de desenvolvimento. Assim, seu artefato final fica mais leve, pois qualquer biblioteca instalada com esse argumento será removida.

Agora, precisamos configurar um comando que, quando executado, vai rodar todos os seus testes unitários e verificar se há algum erro com a sua lógica.

Para isso, no arquivo `package.json`, procure pelo objeto `scripts` e substitua o valor da chave `test` para `jest`, da seguinte forma:

```javascript
"scripts": {
    "test": "jest"
},
```

Por padrão, o Jest executa os testes dentro da pasta `__tests__`.

Crie essa pasta na raiz do seu projeto.

### Construindo nossos primeiros testes unitários

Em um novo arquivo chamado `calculator.js`, vamos construir a função de soma de dois valores. Para facilitar este exemplo, consideraremos que a calculadora aceita somente números inteiros.

```javascript
export function sum(a, b) {
    return a + b;
}
```

#### Primeiro caso de teste

Agora, vamos construir um teste unitário para essa função.

Um ponto importante é a nomenclatura desses testes: por eles serem uma documentação viva da sua aplicação, ter um padrão de nomenclatura claro é muito importante para entendimento futuro tanto seu quanto do seu time.

Crie um arquivo, dentro da pasta `__tests__`, chamado `calculator.spec.js`.

Dentro dele, vamos criar nosso primeiro teste:

```javascript
import { sum } from '../calculator.js';

describe("calculator sum", () => {
  test("it should sum two positive values", () => {
    const result = sum(2, 2);

    expect(result).toBe(4);
  });
});
```

Para melhor organização dos nossos testes, utilizamos duas palavras-chave, `describe` e `test`.

* `describe` serve para mostrar qual função estamos testando naquele conjunto de testes;
* `test` serve para explicitar de fato o que está sendo testado e o comportamento esperado.

Agora, executando o comando `npm test`, vamos verificar que nosso teste passou e podemos seguir em frente.

#### Erro ao executar o Jest

Em alguns casos, é possível aparecer o seguinte erro:

```
 Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.
    ...
```

Se estiver acontecendo com você, siga o seguinte tutorial para resolvê-lo:

https://newbedev.com/jest-syntaxerror-cannot-use-import-statement-outside-a-module]

#### Segundo caso de teste

Agora, vamos criar um segundo caso de teste somando um número negativo.

É muito importante pensarmos em cenários diferentes do padrão, deixando nossa aplicação ainda mais robusta a nível de testes automatizados.

Dentro do mesmo `describe` e, logo abaixo do primeiro fechamento de chaves e parênteses `})`, vamos escrever o segundo teste:

```javascript
test("it should sum numbers with a negative value", () => {
  const result = sum(2, -2);
  
  expect(result).toBe(0);
});
```

### E quando um teste falha?

Vamos adicionar a função de subtrair na nossa calculadora e, por um descuido (proposital), errar a lógica da função.

Então, no arquivo `calculator.js`.

```javascript
export function subtract(a, b) {
    return a + b;
}
```

E o teste, em um outro `describe`, no `calculator.spec.js`, abaixo do segundo fechamento de chaves e parênteses `})`.

> **Importante ❗❗:** Não se esqueça de adicionar no import, no topo do arquivo de teste, a função `subtract` ao lado de `sum` separado por uma `,`

```javascript
import { sum, subtract } from '../calculator.js';
```

E o teste:

```javascript
describe("calculator subtract", () => {
    test("it should subtract two positive values", () => {

    const result = subtract(2, 2);

    expect(result).toBe(0);
  });
});
```

Observe que, no terminal, o `jest` exibe um relatório bem preciso do que está errado:

```
calculator sum
    ✓ it should sum two positive values (2 ms)
    ✓ it should sum numbers with a negative value values
  calculator subtract
    ✕ it should subtract two positive values (2 ms)

  ● calculator subtract › it should subtract two positive values

    expect(received).toEqual(expected) // deep equality

    Expected: 0
    Received: 4
```

Corrija o erro de lógica e rode os testes novamente antes de continuarmos.

### Vamos complicar um pouco mais

Agora, vamos imaginar que trabalhamos num banco e temos que desenvolver a funcionalidade de transferência bancária.

Para isso, vamos criar na pasta raiz do projeto o arquivo `account.js` que será uma estrutura de dados (ou uma classe ou objeto) para armazenar as informações que precisamos:

```javascript
export class Account {
    constructor(id, balance) {
        this.id = id;
        this.balance = balance;
    }
}
```

E vamos criar um arquivo `transfer.js` responsável por realizar transferência entre duas contas.

```javascript
export function transfer(payer, receiver, transferAmount) {
    payer.balance = payer.balance - transferAmount
    receiver.balance = receiver.balance + transferAmount
    return [payer, receiver]
}
```

Note que o retorno da função é a lista das contas envolvidas na transferência, com seus novos saldos.

Agora, vamos aos testes:

Como explicado anteriormente, vamos criar o arquivo na pasta `__tests__` com o nome `transfer.spec.js` e pensar em um caso bastante simples:

```javascript
import { Account } from '../account.js';
import { transfer } from '../transfer.js';

describe("transfer", () => {
  test("it should transfer 500 from an account with 1000 to another with 0", () => {
    // Criação do cenário
    const payerAccount = new Account(1, 1000)
    const receiverAccount = new Account(2, 0)

    // Execução do que está sendo testado
    const updatedAccounts = transfer(payerAccount, receiverAccount, 500)

    // Asserts
    expect(updatedAccounts.length).toBe(2);

    expect(updatedAccounts[0].id).toBe(1);
    expect(updatedAccounts[0].balance).toBe(500);

    expect(updatedAccounts[1].id).toBe(2);
    expect(updatedAccounts[1].balance).toBe(500);
  });
});
```

Testes unitários, por padrão, são estruturados da seguinte forma:

1. **Criação do cenário de teste:** prepara o terreno e simula uma situação real.
   * No nosso caso, era como se tivéssemos, em nosso banco de dados, duas contas com `ID` `1` e `2` e valores `R$1000` e `R$0`.
2. **Execução da função que está sendo testada**
3. **Asserts**: checagem dos resultados

> **OBS:** os comentários que estão sendo utilizados somente para fins didáticos e não são obrigatórios

Como projetamos que a função retornaria um `array` com as duas contas, a primeira coisa que temos que checar é se esse `array` tem o tamanho esperado.

```javascript
expect(updatedAccounts.length).toBe(2);
```

Em seguida, verificamos se as contas estão com seus saldos ajustados após a transferência, tendo como referência o ID único daquela conta

```javascript
expect(updatedAccounts[0].id).toBe(1);
expect(updatedAccounts[0].balance).toBe(500);

expect(updatedAccounts[1].id).toBe(2);
expect(updatedAccounts[1].balance).toBe(500);
```

Por estarmos tratando de `arrays`, existem outras formas mais legíveis e práticas de fazermos as checagens de resultados (`asserts`), principalmente porque não necessariamente podemos garantir a ordem dos elementos deste `array`. Por exemplo:

```javascript
    expect(updatedAccounts).toHaveLength(2);

    expect(updatedAccounts).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ id: 2, balance: 500 }),
            expect.objectContaining({ id: 1, balance: 500 })
        ])
    );
```

Podemos rodar os testes somente do arquivo `transfer.spec.js`, com o comando:

```bash
npm test __tests__/transfer.spec.js
```

Vamos construir mais um teste para garantir que nossa lógica funciona como esperado.

```javascript
test("it should transfer 50 from an account with 100 to another with 600", () => {
    const payerAccount = new Account(1, 100)
    const receiverAccount = new Account(2, 600)

    const updatedAccounts = transfer(payerAccount, receiverAccount, 50)

    expect(updatedAccounts).toHaveLength(2);

    expect(updatedAccounts).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ id: 2, balance: 650 }),
            expect.objectContaining({ id: 1, balance: 50 })
        ])
    );
});
```

Existem diversas formas de realizar `asserts` com o `jest`, sendo que todas são bastante úteis e situacionais.

Vamos dar uma olhada na documentação do `jest` que, por sinal, é bastante rica, e entender os tipos de `asserts` disponíveis pela biblioteca:

https://jestjs.io/pt-BR/docs/expect

Quando tiverem tempo, dediquem-se a ler com calma essa documentação. Ela é bastante didática e, quando aplicada corretamente, deixam seus testes unitários descritivos, legíveis e eficientes.
