# Testes Unitários com Javascript e Jest

Testes unitários são testes que validam pequenas unidades lógicas e regras de negócio da sua aplicação de forma simples e automatizada.

São uma prática essencial para todo e qualquer sistema, pois garantem que seu código está sendo construído com qualidade, e proporcionam uma segurança mínima e necessária para a evolução e melhoria contínua da sua aplicação.

Além disso, quando bem construídos, funcionam como uma espécie de documentação viva das suas regras de negócio: é muito natural recorrer aos testes unitários para entender o que alguns trechos de código estão fazendo, ao invés de gastar energia tentando entender linha a linha de uma função específica.

## Código com testes X Código sem testes

Em um primeiro momento, pode parecer que escrever testes unitários pode desacelerar a entrega das suas funcionalidades. Porém, atualmente, as empresas mais relevantes tem se preocupado ainda mais com essa prática, justamente pelo fato de que não aplicar práticas como testes unitários aumenta muito o custo do projeto em um médio prazo, como no gráfico a seguir:

![Código com testes x Código sem testes](images/image1.png)

A linha vermelha indica a quantidade de funcionalidades entregues nos primeiros dias ou poucas semanas de projeto. Observe que, de fato, temos uma entrega de valor mais alta do que a linha verde, que representa um código escrito utilizando boas práticas como a de escrever testes unitários.

Porém, com o tempo, um código sem testes torna-se rapidamente o que chamamos de código legado.

> **Código legado:** conceito dado para um código onde torna-se muito difícil e custoso sua manutenção e criação de novas funcionalidades.

Isso se dá porque, sem testes para garantir o funcionamento correto do seu software, qualquer novo código escrito pode impactar o que já foi entregue e, por não haverem testes automatizados, esses erros são percebidos tarde demais.

Por outro lado, a linha verde pode subir um pouco mais lenta de início por causa da construção de testes, mas, graças a eles, geramos um software mais sustentável, em que a manutenção e evolução tornam-se mais rápidas e garantem uma quantidade muito menor de bugs e comportamentos inesperados.

Logo, tenham em mente que a criação de testes unitários é imprescindível para qualquer que seja a aplicação. Hoje, raramente vemos empresas maduras de tecnologia criando software sem esse tipo de testes.

## Configuração do projeto

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

## Construindo nossos primeiros testes unitários
Em um novo arquivo chamado `calculator.js`, vamos construir a função de soma de dois valores. Para facilitar este exemplo, consideraremos que a calculadora aceita somente números inteiros.
```javascript
function sum(a, b) {
    return a + b;
}
```
### Primeiro caso de teste

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

- `describe` serve para mostrar qual função estamos testando naquele conjunto de testes;
- `test` serve para explicitar de fato o que está sendo testado e o comportamento esperado.

Agora, executando o comando `npm test`, vamos verificar que nosso teste passou e podemos seguir em frente.

### Erro ao executar o Jest

Em alguns casos, é possível aparecer o seguinte erro:
```
 Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.
    ...
```
Se estiver acontecendo com você, siga o seguinte tutorial para resolvê-lo:

https://newbedev.com/jest-syntaxerror-cannot-use-import-statement-outside-a-module]

### Segundo caso de teste

Agora, vamos criar um segundo caso de teste somando um número negativo.

É muito importante pensarmos em cenários diferentes do padrão, deixando nossa aplicação ainda mais robusta a nível de testes automatizados.

Dentro do mesmo `describe` e, logo abaixo do primeiro fechamento de chaves e parênteses `})`, vamos escrever o segundo teste:

```javascript
test("it should sum numbers with a negative value", () => {
  const result = sum(2, -2);
  
  expect(result).toBe(0);
});
```

## E quando um teste falha?
Vamos adicionar a função de subtrair na nossa calculadora e, por um descuido (proposital), errar a lógica da função.

Então, no arquivo `calculator.js`.

```javascript
export function subtract(a, b) {
    return a + b;
}
```

E o teste, em um outro `describe`, no `calculator.spec.js`, abaixo do segundo fechamento de chaves e parenteses `})`.

>  **Importante ❗❗:** Não se esqueça de adicionar no import, no topo do arquivo de teste, a função `subtract` ao lado de `sum` separado por uma `,`

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
Observe que, no terminal, o Jest exibe um relatório bem preciso do que está errado:

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

## Vamos complicar um pouco mais

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

Note que o retorno da função é a lista das contas envolvidas na transferência, com seus novos saldos, pois, futuramente, isso será armazenado em um banco de dados de forma atômica.

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
   - No nosso caso, era como se tivéssemos, em nosso banco de dados, duas contas com `ID` `1` e `2` e valores `R$1000` e `R$0`.
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
        expect.objectContaining(
            { id: 2, balance: 500 },
            expect.objectContaining({ id: 1, balance: 500 })
        )
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
            expect.objectContaining(
                { id: 2, balance: 500 },
                expect.objectContaining({ id: 1, balance: 500 })
            )
        ])
    );
});
```

Existem diversas formas de realizar `asserts` com o `jest`, sendo que todas são bastante úteis e situacionais.

Vamos dar uma olhada na documentação do `jest` que, por sinal, é bastante rica, e entender os tipos de `asserts` disponíveis pela biblioteca:

https://jestjs.io/pt-BR/docs/expect

Quando tiverem tempo, dediquem-se a ler com calma essa documentação. Ela é bastante didática e, quando aplicada corretamente, deixam seus testes unitários descritivos, legíveis e eficientes.

## Casos de borda

Casos de borda são cenários que extrapolam o previsível e o que consideramos "básico".

É sempre preciso pensar fora da caixa e entender que podem acontecer comportamentos inesperados com nossas funções dependendo do seu comportamento e dos parâmetros que ela recebe. Por exemplo:

- Faz sentido uma conta ter um valor negativo de saldo?
- Ou transferir um valor negativo de uma conta para outra?

A forma que nossa função se comporta nesses casos deve estar explícita tanto nas regras de negócio descritas na aplicação, quanto nos testes unitários. Por exemplo:

```javascript
export function transfer(payer, receiver, transferAmount) {
  if (transferAmount > 0) {
      payer.balance = payer.balance - transferAmount;
      receiver.balance = receiver.balance + transferAmount;

      return [payer, receiver];
  } else {
      throw new Error(`Invalid transfer amount: ${transferAmount}`);
  }
}
```

E este seria o teste unitário para esse caso de borda:

```javascript
test('it should throw an error when transfer amount is negative', () => {
    const payerAccount = new Account(1, 1000);
    const receiverAccount = new Account(2, 1000);

    const updatedAccounts = () => {
        transfer(payerAccount, receiverAccount, -10);
    };

    expect(updatedAccounts).toThrow(Error('Invalid transfer amount: -10'));
});
```

E acabamos de chegar em outro caso de borda bastante comum em diversas aplicações:

>  **Será que faz sentido transferirmos o valor 0 de uma conta para outra?**

Pensando que estamos construindo um banco, seria um processamento desnecessário, pois não fará qualquer diferença para nenhuma das contas.

Logo, é muito interessante criarmos um teste para garantir que nossa função também gere um erro caso receba o parâmetro `0` de valor de transferência.

```javascript
test('it should throw an error when transfer amount is 0', () => {
    const payerAccount = new Account(1, 1000);
    const receiverAccount = new Account(2, 1000);

    const updatedAccounts = () => {
        transfer(payerAccount, receiverAccount, 0);
    };

    expect(updatedAccounts).toThrow(Error('Invalid transfer amount: 0'));
});
```

Como na lógica da nossa função decidimos optar pela condicional `if amount > 0`, o teste vai passar e vai garantir que não haverá processamento de transferência de valor `0`.

Mas, se optássemos por um `>=` (maior ou igual), o teste falharia, pois é uma regra da aplicação não realizar transferências de valor `0`.

## Test Driven Development (TDD)
TDD, ou desenvolvimento orientado a testes, é uma prática de qualidade de código vista com muito bons olhos no mercado. Ela, através de testes unitários, contribui para a criação de um código mais limpo, legível e sustentável.

A ideia é, antes de qualquer coisa, criar um teste unitário de alguma regra de negócio específica e assistir ele falhar propositalmente. Na sequência, você irá começar a desenvolver sua função baseada nesse teste.

### Exemplo de TDD

Vamos exemplificar para facilitar:

Imagine que chegou uma nova demanda de negócio na nossa aplicação bancária e agora será cobrada uma taxa de 100 "dinheiros" (não vamos nos apegar a valores monetários aqui) para o pagante realizar uma transferência.

Sem encostar no nosso código de produção (nome dado a parte do código fonte sem os testes), vamos primeiro criar um teste com essa nova regra de negócio.

Para fins didáticos, vamos separar esse novo teste em um outro arquivo.

Primeiro, crie o arquivo `transferWithTax.spec.js` dentro da pasta `__tests__`, com o seguinte conteúdo:

```javascript
import { Account } from '../account.js';
import { transferWithTax } from '../transferWithTax.js';

describe('transferWithTax', () => {
    test('it should charge 100 from the payer account with 1000 for a 500 transfer to a receiver account with 0', () => {
        const payerAccount = new Account(1, 1000);
        const receiverAccount = new Account(2, 0);

        const updatedAccounts = transferWithTax(payerAccount, receiverAccount, 500);

        expect(updatedAccounts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({id: 1, balance: 400}),
                expect.objectContaining({id: 2, balance: 500}),
            ])
        );
    });
});
```

Vamos criar um novo arquivo `transferWithTax.js`, e uma nova função, `transferWithTax`, que retornará `undefined` apenas para conseguir rodar os testes sem erros de compilação.

```javascript
import { Account } from "./account";

export function transferWithTax(payer, receiver, transferAmount) {
    return undefined;
}
```

Agora, para rodar os testes, execute:

```bash
npm test __tests__/transferWithTax.spec.js
```

Ao executar o comando, percebemos que o teste falhou e é essa a primeira parte do TDD: **criar um micro-objetivo (teste unitário) que falhe**.

#### Fazendo o teste passar

A próxima etapa agora é fazer esse teste passar:

- Deixe TUDO de lado e preocupe-se unicamente em fazer esse teste passar, da forma que for, sem se preocupar com legibilidade, design ou boas práticas (pode confiar).
- Podem ignorar outras regras de negócio, casos de borda e complexidades.

Sendo bem pragmático e seguindo o TDD "by the book" (no dia a dia, não necessariamente precisamos fazer desse jeito), podemos fazer o teste passar da seguinte forma:

```javascript
export function transferWithTax(payer, receiver, transferAmount) {
    return [new Account(1, 400), new Account(2, 500)];
}
```

Sim, isso mesmo, retornamos exatamente o que o teste espera.

O TDD serve para você reduzir o seu problema em micro objetivos que, quando totalmente concluídos, resolvem o problema como um todo.

#### Refatoração

Agora, nós vamos para a terceira parte do TDD: **a refatoração**.

Já que temos nossa suite de testes verde (passando), temos segurança para melhorar a legibilidade e o design do nosso código que, com certeza, tem muito a melhorar. Então, voltamos ao arquivo `transferWithTax.js,` para melhorar nosso algoritmo e torná-lo mais legível.

```javascript
export function transferWithTax(payer, receiver, transferAmount) {
    const payerBalance = 400;
    const payerAccountId = 1;
    const payerAccount = new Account(payerAccountId, payerBalance);

    const receiverBalance = 500;
    const receiverAccountId = 2;
    const receiverAccount = new Account(receiverAccountId, payerBalance);

    return [payerAccount, receiverAccount];
}
```

Nessa refatoração, melhoramos a legiblidade do código removendo um code smell (padrão ruim de código) chamado `magic number` (números mágicos), que são números escritos sem contexto no meio do código.

Ao declararmos eles a variáveis com nomes descritivos, fica mais fácil entender o que cada um desses números significa.

No entanto, propositalmente, inserimos um erro nessa refatoração.

Rode os testes com o seguinte comando:

```bash
`npm test __tests__/transferWithTax.spec.js
```

E temos o seguinte resultado:

```
Expected: ArrayContaining [ObjectContaining {"balance": 500, "id": 1}, ObjectContaining {"balance": 400, "id": 2}]
Received: [{"balance": 500, "id": 1}, {"balance": 500, "id": 1}]
```

Esse é o relatório que o `jest` nos trouxe:

A conta recebedora da transferência deveria estar com 400 "dinheiros", mas nossa função retornou que ela está com 500.

#### Corrigindo possíveis erros

Algo deu errado na nossa refatoração, conseguem descobrir o que é?

Na linha 11, trocamos uma variável de lugar. Ao invés de a conta receber o saldo do recebedor, ela estava recebendo a do pagador (erros de copiar e colar são os mais comuns na área de programação e vocês vão lembrar muito disso!).

```javascript
const receiverAccount = new Account(receiverAccountId, receiverBalance);
```

Feita a alteração, rodamos os testes novamente com:

```bash
npm test __tests__/transferWithTax.spec.js
```

E... sucesso! 🍀👌

A etapa de refatoração é muito importante, pois, como já falamos anteriormente, nosso código evolui e muda o tempo todo.

> **DICA ❗❗:** Nunca refatore um código se a suíte de testes estiver vermelha (não estiverem passando), pois dessa forma não existe garantia que sua refatoração não introduziu bugs e comportamentos inesperados.

E, assim, fechamos o ciclo do TDD e iniciamos a primeira etapa da prática: escrever um teste válido que falhe ao ser executado, como na imagem:



![Ciclo do TDD](images/tdd.png)

#### Escrevendo um novo caso de teste

Agora, retornamos ao início e escrevemos mais um teste para nossa funcionalidade:

```javascript
test('it should charge 100 from the payer account with 2000 for a 100 transfer to a receiver account with 1000', () => {
    const payerAccount = new Account(1, 2000);
    const receiverAccount = new Account(2, 1000);

    const updatedAccounts = transferWithTax(payerAccount, receiverAccount, 100);

    expect(updatedAccounts).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ id: 1, balance: 1800 }),
            expect.objectContaining({ id: 2, balance: 1100 }),
        ]);
    );
});
```

Execute os testes:

```bash
npm test __tests__/transferWithTax.spec.js
```

Ao rodar os testes, vemos que, pelo relatório, o teste falha (obviamente), pois nosso algoritmo não está completo.

O novo objetivo agora é fazer esse teste passar, sendo que podemos começar a dar passos maiores e adicionar mais lógica na nossa função:

```javascript
export function transferWithTax(payer, receiver, transferAmount) {
    const payerAccountAfterTransfer = new Account(payer.id, payer.balance - transferAmount - 100);
    const receiverAccountAfterTransfer = new Account(receiver.id, receiver.balance + transferAmount);

    return [payerAccountAfterTransfer, receiverAccountAfterTransfer];
}
```

Rodando os testes novamente com o mesmo comando, podemos ver que acertamos no nosso algoritmo.

Para finalizar, pulamos para a terceira etapa do TDD, **a refatoração**.

O que podemos melhorar nesse código?

```javascript
export function transferWithTax(payer, receiver, transferAmount) {
    const payerAccountAfterTransfer = new Account(payer.id, chargeTaxForTransfer(payer.balance, transferAmount));
    const receiverAccountAfterTransfer = new Account(receiver.id, receiver.balance + transferAmount);

    return [payerAccountAfterTransfer, receiverAccountAfterTransfer];
}

function chargeTaxForTransfer(balance, transferAmount) {
    const tax = 100;
    return balance - transferAmount - tax;
}
```

Nessa refatoração, extraímos parte da lógica para uma função com nome mais descritivo e legível a cobrança da taxa, além de declarar essa taxa a uma variável com um nome mais declarativo.

Rodando nossos testes com o mesmo comando, observamos que nossa refatoração deu certo: deixou o código mais limpo, com mais facilidade de manutenção, mais legível e continua com o comportamento esperado pelo negócio.

O TDD é uma prática que, inicialmente, parece exagero. Entretanto, ajuda muito no design da sua solução.

Inclusive, eu, enquanto escrevia esse código e esses testes, errei várias vezes e foram os testes que me ajudaram a perceber os meus erros.

Essa prática vai muito mais além disso: um bom livro para se aprofundar é o [Test Driven Development by Example, do Kent Back](https://www.oreilly.com/library/view/test-driven-development/0321146530/).

## Desafio

Agora é com vocês! 🥳

Além de construir tudo o que fizemos aqui, tentem agregar uma nova funcionalidade ao nosso banco, utilizando tudo que aprendemos, inclusive o TDD!

A nova funcionalidade é a seguinte:

**Nosso banco cresceu e agora faz transferências internacionais.**

Porém, para que ela seja feita, existem algumas regras:

- Não é possível transferir menos que `1000` "dinheiros";
- Não é possível transferir mais que `9999` "dinheiros";
- Existe uma taxa fixa de `100` "dinheiros" para cada transferência;
- Se a transferência for entre `1000` e `5000`, existe uma taxa `5%` do valor a ser transferido, além da taxa fixa;
- Se a transferência for acima de `5001` "dinheiros", a taxa é de `10%`, além da taxa fixa.

Tentem escrever um código legível, com variáveis e funções descritivas, além de, obviamente, utilizar o TDD com testes unitários.

Isso é para o bem de vocês, pois é sobre esse código que vamos agregar ainda mais funcionalidades nas próximas aulas!

