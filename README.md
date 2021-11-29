# Testes Unitários com Javascript e Jest

Testes unitários são testes que validam pequenas unidades lógicas e regras de negócio da sua aplicação de forma simples e automatizada. É uma prática essencial para todo e qualquer sistema pois garantem que seu código está sendo construído com qualidade e proporciona uma segurança mínima e necessária para a evolução e melhoria contínua da sua aplicação. Além disso, quando bem construídos, funcionam como uma espécie de documentação viva das suas regras de negócio: é muito natural recorrer aos testes unitários para entender o que alguns trechos de código estão fazendo ao invés de gastar energia entendendo linha a linha de uma dada função.

## Código com testes X Código sem testes

Em um primeiro momento, pode parecer que escrever testes unitários pode desacelerar a entrega das suas funcionalidades. Porém hoje, no mercado, as empresas mais relevantes tem se preocupado ainda mais com essa prática porque essa perda de velocidade inicial é uma ilusão e o preço de não aplicar práticas como testes unitários se torna muito caro em um médio prazo. Como no grático abaixo:

![Código com testes x Código sem testes](images/image1.png)

A linha vermelha indica a quantidade de funcionalidades entregues nos primeiros dias ou poucas semanas de projeto. Observe que, de fato, temos uma entrega de valor mais alta do que a linha verde, que representa um código escrito utilizando boas práticas como a de escrever testes unitários. Porém, com o tempo, um código sem testes torna-se rapidamente o que chamamos de código legado: conceito dado para um código onde torna-se muito difícil e custoso sua manutenção e criação de novas funcionalidades. Isso se dá porque, sem testes para garantir o funcionamento correto do seu software, qualquer novo código escrito pode impactar o que já foi entregue e, por não haverem testes automatizados, esses erros são percebidos tarde demais.

Por outro lado, a linha verde pode demorar um pouco mais inicialmente por causa da construção de testes, mas graças a eles geramos um software mais sustentável, onde a manutenção e evolução tornam-se mais rápidas e garantem uma quantidade muito menor de bugs e comportamentos inesperados.

Logo, tenham em mente que a criação de testes unitários é imprescindível para qualquer que seja a aplicação. Hoje, raramente se vê empresas maduras de tecnologia criando software sem esse tipo de testes.

## Configuração do projeto

Vamos utilizar javascript puro e uma biblioteca chamada jest para os testes unitários. Nossa primeira missão vai ser construir uma calculadora com as operações de somar, diminuir, multiplicar e dividir. 

Na pasta onde você vai criar o projeto, execute o comando
```bash
npm init -y
```
Ele vai automaticamente criar um projeto javascript com o mesmo nome da pasta onde você rodou esse comando.

Para instalar o jest, execute:
```bash
npm i jest --save-dev
```
O argumento --save-dev é para deixar claro que essa biblioteca não faz parte do seu código de produção e será utilizada somente nos ambientes de desenvolvimento. Assim, seu artefato final fica menos pesado pois qualquer biblioteca instalada com esse argumento é removida.

Agora, precisamos configurar um comando que, quando executado, vai rodar todos os seus testes unitários e verificar se há algum erro com a sua lógica. Para isso, no arquivo `package.json` substitua o valor da chave `test` para `jest` ao invés do padrão criado inicialmente:

```javascript
"scripts": {
    "test": "jest"
},
```

Por padrão, o Jest executa os testes dentro da pasta `__tests__`. Então, vamos cria-la:

```bash
mkdir __tests__
```

## Construinto nossos primeiros testes unitários
Vamos construir então, em um novo arquivo chamado `calculator.js` a função de soma de dois valores. Vamos considerar que a calculadora aceita somente números inteiros.
```javascript
function sum(a, b) {
    return a + b;
}
```
E agora, vamos construir um teste unitário para essa função. Um ponto importante é a nomenclatura desses testes: por eles serem uma documentação viva da sua aplicação, ter um padrão de nomenclatura claro é muito importante para entendimento futuro tanto seu quanto do seu time.

Crie um arquivo, dentro da pasta `__tests__`, chamado `calculator.spec.js`. Dentro dele, vamos criar nosso primeiro teste:
```javascript
import { sum } from '../calculator.js';

describe("calculator sum", () => {
  test("it should sum two positive values", () => {

    const result = sum(2, 2);

    expect(result).toBe(4);

  });
});
```
Para melhor organização dos nossos testes, utilizamos a keyword `describe` para mostrar qual função estamos testando naquele conjunto de testes e a keyword `test` para explicitar de fato o que está sendo testado e o comportamento esperado.

Agora, executando o comando `npm test`, vamos verificar que nosso teste passou e podemos seguir em frente.

OBS: Caso você esteja tendo problemas como esse:
```
 Jest encountered an unexpected token

    Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

    Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.
    ...
```
Siga o seguinte tutorial: https://newbedev.com/jest-syntaxerror-cannot-use-import-statement-outside-a-module]

Vamos agora criar um segundo caso de teste, por exemplo, somando um número negativo. É muito importante pensarmos em cenários diferentes do padrão para deixar nossa aplicação ainda mais robusta a nível de testes automatizados. Dentro do mesmo describe e logo abaixo do primeiro fechamento de chaves e parenteses `})` vamos escrever o segundo teste:

```javascript
test("it should sum numbers with a negative value", () => {
  const result = sum(2, -2);
  
  expect(result).toBe(0);
});
```

## E quando um teste falha?
Vamos adicionar a função de subtrair na nossa calculadora e, por um descuido (proposital), errar a lógica da função. Então, no arquivo `calculator.js`

```javascript
export function subtract(a, b) {
    return a + b;
}
```

E o teste, em um outro describe, no `calculator.spec.js`, abaixo do segundo fechamento de chaves e parenteses `})`. Não se esqueça de adicionar no import, no topo do arquivo de teste, a função `subtract` ao lado de `sum` separado por uma `,`

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

Agora, Vamos imaginar que trabalhamos num banco e temos que desenvolver a funcionalidade de transferência bancária (PIX?).
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

Note que o retorno da função é a lista das contas envolvidas na transferência com seus novos saldos pois, futuramente, isso será armazenado em um banco de dados de forma atômica. Agora vamos aos testes:

Como explicado anteriormente, vamos criar o arquivo na pasta `__tests__` com o nome `transfer.spec.js` e pensar em um caso bastante simples:

```javascript
import { Account } from '../account.js';
import { transfer } from '../transfer.js';

describe("transfer", () => {
  test("it should transfer 500 from an account with 1000 to another with 0", () => {
    //criação do cenário
    const payerAccount = new Account(1, 1000)
    const receiverAccount = new Account(2, 0)

    //execução do que está sendo testado
    const updatedAccounts = transfer(payerAccount, receiverAccount, 500)

    //asserts
    expect(updatedAccounts.length).toBe(2);

    expect(updatedAccounts[0].id).toBe(1);
    expect(updatedAccounts[0].balance).toBe(500);

    expect(updatedAccounts[1].id).toBe(2);
    expect(updatedAccounts[1].balance).toBe(500);

  });
});
```

Testes unitários, por padrão, são estruturados da seguinte forma (os comentários que estão sendo utilizados somente para fins didádicos. Não são obrigatórios):
1 - Criação do cenário de teste que prepara o terreno e simula uma situação real. No nosso caso, era como se estivessemos, em nosso banco de dados, duas contas com ID 1 e 2 e quantidade R$1000 e R$0.
2 - Execução da função que está sendo testada
3 - "Asserts": checagem dos resultados

Como projetamos que a função retornaria um vetor com as duas contas, a primeira coisa que temos que checar é se esse vetor tem o tamanho esperado

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

Por estarmos tratando de vetores (arrays), existem outras formas mais legíveis e práticas de fazermos as checagens de resultados (asserts). principalmente porque não necessariamente podemos garantir a ordem dos elementos deste array. Por exemplo:
```javascript

  expect(updatedAccounts).toHaveLength(2);

  expect(updatedAccounts).toEqual(
    expect.arrayContaining([
      expect.objectContaining({id: 2, balance: 500},
      expect.objectContaining({id: 1, balance: 500}))
    ])
  );
```
Podemos rodar os testes somente do arquivo `transfer.spec.js` com o comando
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
        expect.objectContaining({id: 2, balance: 650},
        expect.objectContaining({id: 1, balance: 50}))
      ])
    );

  });
```

Existem diversas formas de realizar asserts com o jest e todas são bastante úteis e situacionais. Vamos dar uma olhada na documentação do jest que, por sinal, é bastante rica, e entender os tipos de asserts disponíveis pela biblioteca:
https://jestjs.io/pt-BR/docs/expect.

Quando tiverem tempo, dediquem-se a ler com calma essa documentação. Ela é bastante didática e quando aplicada corretamente, deixam seus testes unitários descritivos, legíveis e eficientes.

## Casos de borda

Casos de borda são cenários que extrapolam o previsível e o que consideramos "básico". É sempre preciso pensar fora da caixa e entender que podem acontecer comportamentos inesperados com nossas funções dependendo do seu comportamento e dos parâmetros que ela recebe. Por exemplo: Faz sentido uma conta ter um valor negativo de saldo? Ou transferir um valor negativo de uma conta para outra? A forma que nossa função se comporta nesses casos deve estar explícita tanto nas regras de negócio descritas na aplicação quanto nos testes unitários. Por exemplo:

```javascript
export function transfer(payer, receiver, transferAmount) {
  if (transferAmount > 0) {
      payer.balance = payer.balance - transferAmount
      receiver.balance = receiver.balance + transferAmount
      return [payer, receiver]    
  } else {
      throw new Error(`Invalid transfer amount: ${transferAmount}`);
  }
  
}
```

E este seria o teste unitário para esse caso de borda:

```javascript
    test('it should throw an error when transfer amount is negative', () => {

      const payerAccount = new Account(1, 1000)
      const receiverAccount = new Account(2, 1000)

      const updatedAccounts = () => {
        transfer(payerAccount, receiverAccount, -10)
      };

      expect(updatedAccounts).toThrow(Error('Invalid transfer amount: -10'));

  });
```

E acabamos de chegar em outro caso de borda bastante comum em diversas aplicações: será que faz sentido transferirmos o valor 0 de uma conta para outra? Pensando que estamos consruindo um banco, seria um processsamento desnecessário pois não fará qualquer diferença para nenhuma das contas. Logo, é muito interessante criarmos um teste para garantir que nossa função também gere um erro caso receba o parâmetro 0 de valor de transferência.

```javascript
  test('it should throw an error when transfer amount is 0', () => {

    const payerAccount = new Account(1, 1000)
    const receiverAccount = new Account(2, 1000)

    const updatedAccounts = () => {
      transfer(payerAccount, receiverAccount, 0)
    };

    expect(updatedAccounts).toThrow(Error('Invalid transfer amount: 0'));

  });
```

Como na lógica da nossa função decidimos optar pela condicional `if amount > 0`, o teste vai passar e vai garantir que não haverá processamento de transferência de valor 0. Mas se optassemos por um `>=` (maior ou igual), o teste falharia, pois é uma regra da aplicação não realizar transferências de valor 0.

## Test Driven Development (TDD)
TDD, ou desenvolvimento orientado a testes, é uma prática de qualidade de código vista com muito bons olhos no mercado. Ela, através de testes unitários, contribui para a criação de um código mais limpo, legível e sustentável. A ideia é, antes de qualquer coisa, criar um teste unitário de alguma regra de negócio específica e assistir ele falhar propositalmente para aí você começar a desenvolver sua função baseada nesse teste. Vamos exemplificar para facilitar:

Vamos imaginar que chegou uma nova demanda de negócio na nossa aplicação bancária e agora será cobrada uma taxa de 100 "dinheiros" (não vamos nos apegar a valores monetários aqui) para o pagante realizar uma transferência. Sem encostar no nosso código de produção (nome dado a parte do código fonte sem os testes), vamos primeiro criar um teste com essa nova regra de negócio. E vamos fazer isso e um arquivo de testes separados para fins didáticos: crie o arquivo `transferWithTax.spec.js` dentro da pasta `___tests___`

```javascript
import { Account } from '../account.js';
import { transferWithTax } from '../transferWithTax.js';

describe('transferWithTax', () => {

  test('it should charge 100 from the payer account with 1000 for a 500 transfer to a receiver account with 0', () => {

    const payerAccount = new Account(1, 1000)
    const receiverAccount = new Account(2, 0)

    const updatedAccounts = transferWithTax(payerAccount, receiverAccount, 500)

    expect(updatedAccounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({id: 1, balance: 400}),
        expect.objectContaining({id: 2, balance: 500})

      ])
    );

  });
});
```

Vamos criar um novo arquivo `transferWithTax.js`, e uma nova função, `transferWithTax`, e retornar `undefined` apenas para conseguir rodar os testes sem erros de compilação.

```javascript
import { Account } from "./account"

export function transferWithTax(payer, receiver, transferAmount) {
    return undefined  
}
```

Com o comando `npm tes __tests__/transferWithTax.spec.js` percebemos que o teste falhou e é essa a primeira parte do TDD! Criar um micro-objetivo (teste unitário) que falhe. A próxima etapa agora é fazer esse teste passar. Deixe TUDO de lado e preocupe-se unicamente em fazer esse teste passar, da forma que for, sem se preocupar com legibilidade, design ou boas práticas (pode confiar). Podem ignorar outras regras de negócio, casos de borda= e complexidades.
Sendo bem pragmático e seguindo o TDD "by the book" (no dia a dia, não necessariamente precisamos fazer desse jeito), podemos fazer o teste passar da seguinte forma:

```javascript
export function transferWithTax(payer, receiver, transferAmount) {
    return [new Account(1, 400), new Account(2, 500)]
}
```

Sim, isso mesmo, retornamos exatamente o que o teste espera. O TDD serve para você reduzir o seu problema em micro objetivos que, quando totalmente concluídos, resolvem o problema como um todo.
Agora, nós vamos para a terceira parte do TDD: a refatoração. Já que temos nossa suite de testes verde (passando), temos segurança para melhorar a legibilidade e o design do nosso código que, com certeza, tem muito a melhorar. Então, vamos para o arquivo `transferWithTax.js` melhorar nosso algoritmo para torná-lo mais legível.

```javascript
export function transferWithTax(payer, receiver, transferAmount) {
    const payerBalance = 400
    const payerAccountId = 1
    const payerAccount = new Account(payerAccountId, payerBalance)


    const receiverBalance = 500
    const receiverAccountId = 2
    const receiverAccount = new Account(receiverAccountId, payerBalance)
    

    return [payerAccount, receiverAccount]
}
```

Nessa refatoração, melhoramos a legiblidade do código removendo um code smell (padrão ruim de código) chamado "magic number" ou números mágicos, que são números escritos sem contexto no meio do código. Ao declararmos eles a variáveis com nomes descritivos, fica mais fácil entender o que cada um desses números significa. Mas observe que, propositalmente, há um erro nessa refatoração. Vamos rodar nossos testes com `npm tes __tests__/transferWithTax.spec.js`?

```
Expected: ArrayContaining [ObjectContaining {"balance": 500, "id": 1}, ObjectContaining {"balance": 400, "id": 2}]
Received: [{"balance": 500, "id": 1}, {"balance": 500, "id": 1}]
```

Esse é o relatório que o jest nos trouxe. A conta recebedora da transferência deveria estar com 400 "dinheiros", mas nossa função retornou que ela está com 500. Algo deu errado na nossa refatoração, conseguem descobrir o que é?
<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

Na linha 11, trocamos uma variável de lugar. Ao invés de a conta receber o saldo do recebedor, ela estava recebendo a do pagador. (Erros de copiar e colar são os mais comuns na área de programação e vocês vão lembrar muito disso!)

```javascript
const receiverAccount = new Account(receiverAccountId, receiverBalance)
```

Feita a alteração, rodamos os testes novamente com `npm test __tests__/transferWithTax.spec.js` e... sucesso!

A etapa de refatoração é muito importante pois, como já falamos anteriormente, nosso código evolui e muda o tempo todo. Nunca refatore um código se a suite de testes estiver vermelha (não estiverem passando) pois dessa forma não existe garantia que sua refatoração não introduziu bugs e comportamentos inesperados.

E assim fechamos o ciclo do TDD e voltamos para a primeira etapa da prática: escrever um teste válido que falhe ao ser executado, como na imagem:<br /><br />

![Ciclo do TDD](images/tdd.png)

Então retornamos ao ínicio e vamos escrever mais um teste para nossa funcionalidade

```javascript

test('it should charge 100 from the payer account with 2000 for a 100 transfer to a receiver account with 1000', () => {

    const payerAccount = new Account(1, 2000)
    const receiverAccount = new Account(2, 1000)

    const updatedAccounts = transferWithTax(payerAccount, receiverAccount, 100)

    expect(updatedAccounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({id: 1, balance: 1800}),
        expect.objectContaining({id: 2, balance: 1100})

      ])
    );

});

```

Ao rodar os testes com `npm test __tests__/transferWithTax.spec.js` vemos que, pelo relatório, o teste falha obviamente porque nosso algoritmo não está completo. Nosso novo objetivo agora é fazer esse teste passar, e agora podemos começar a dar passos maiores e adicionar mais lógica na nossa função:

```javascript
  export function transferWithTax(payer, receiver, transferAmount) {
    const payerAccountAfterTransfer = new Account(payer.id, payer.balance - transferAmount - 100)
    const receiverAccountAfterTransfer = new Account(receiver.id, receiver.balance + transferAmount)

    return [payerAccountAfterTransfer, receiverAccountAfterTransfer]
  }
```

E, rodando os testes novamente com `npm test __tests__/transferWithTax.spec.js`, podemos ver que acertamos no nosso algoritmo. E aí pulamos para a terceira etapa do TDD, a refatoração. O que podemos melhorar nesse código?

```javascript
export function transferWithTax(payer, receiver, transferAmount) {
    const payerAccountAfterTransfer = new Account(payer.id, chargeTaxForTransfer(payer.balance, transferAmount))
    const receiverAccountAfterTransfer = new Account(receiver.id, receiver.balance + transferAmount)

    return [payerAccountAfterTransfer, receiverAccountAfterTransfer]
}

function chargeTaxForTransfer(balance, transferAmount) {
    const tax = 100;
    return balance - transferAmount - tax
}
```

Nessa refatoração, extraimos para uma função privada com nome mais descritivo e legível a cobrança da taxa, além de declarar essa taxa a uma variável com um nome mais declarativo. E, rodando nossos testes com `npm test __tests__/transferWithTax.spec.js`, observamos que nossa refatoração deu certo: deixou o código mais limpo, com mais facilidade de manutenção, mais legível e continua com o comportamento esperado pelo negócio.

O TDD é uma prática que, inicialmente, parece exagero. Mas ajuda muito no design da sua solução. Inclusive, eu, enquanto escrevia esse código e esses testes, errei várias vezes e foram os testes que me ajudaram a perceber os meus erros. E essa prática vai muito mais além disso: um bom livro para se aprofundar é o Test Driven Development by Example, do Kent Back (https://www.amazon.com.br/Test-Driven-Development-Kent-Beck/dp/0321146530/ref=asc_df_0321146530/?tag=googleshopp00-20&linkCode=df0&hvadid=379787788238&hvpos=&hvnetw=g&hvrand=5412242682766184565&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=1001566&hvtargid=pla-448095042394&psc=1).

## Desafio

Agora é com vocês! Além de construir tudo o que fizemos aqui, tentem agora agregar uma nova funcionalidade ao nosso banco utilizando tudo que aprendemos até aqui, inclusive o TDD!

A nova funcionalidade é a seguinte: nosso banco cresceu, e agora faz transferências internacionais. Mas para que ela seja feita, existem algumas regras:
- Não é possível transferir menos que 1000 "dinheiros".
- Não é possível transferir mais que 9999 "dinheiros",
- Existe uma taxa fixa de 100 "dinheiros" para cada transferência
- Se a transferência for entre 1000 e 5000, existe uma taxa 5% do valor a ser transferido, além da taxa fixa
- Se a transferência for acima de 5001 "dinheiros", a taxa é de 10%, além da taxa fixa.


Tentem ao máximo escrever um código legível, com variáveis e funções descritivas além de, obviamente, utilizar o TDD com testes unitários. E isso é para o bem de vocês, pois é sobre esse código que vamos agregar ainda mais funcionalidades nas próximas aulas!


