# Testes Unitários com JavaScript e Jest (Parte 2): Testando aplicações com mocks e stubs

{% embed url="https://www.youtube.com/watch?v=rBtxHAcXSGI" %}

Nenhuma aplicação de mercado será tão simples quando a calculadora ou o banco que estamos criando nas nossas aulas.

Com certeza elas terão que acessar bancos de dados e outros serviços para consultar ou executar comandos relacionados às suas funcionalidades.

> **Exemplo:** na nossa função de transferência do banco, provavelmente teríamos que buscar as informações das contas em um serviço externo, e escrever num banco de dados os novos saldos de cada um.

Quando estamos rodando os testes unitários, é desaconselhado ter um banco de dados ou um serviço externo funcionando localmente somente para seus testes. Isso ocorre, pois esses testes devem ser os mais baratos e básicos de todos. Por conta disso, utilizamos os chamados **mocks e stubs**.

Vamos reescrever o código de transferência internacional, extraindo a responsabilidade de buscar dados de uma conta para um outro módulo (um possível arquivo de acesso a banco de dados ou de acesso a alguma API externa).

Criamos essa nossa nova lógica de transferência, no arquivo `transferMoney.js`.

```javascript
import { Account } from "./account";
import { getAccount } from "./accounts";

export function transferMoney(payerId, receiverId, transferAmount) {
    validateAmountLimit(transferAmount);
    console.log(amountLimitInvalidError.message);

    const tax = calculateTax(transferAmount);

    const payer = getAccount(payerId);
    const receiver = getAccount(receiverId);

    validatePayerAmount(payer.balance, transferAmount, tax);

    const updatedPayerAccount = new Account(
        payerId,
        payer.balance - transferAmount - tax
    );

    const updatedReceiverAccount = new Account(
        receiverId,
        receiver.balance + transferAmount
    );

    return [updatedPayerAccount, updatedReceiverAccount];
}
```

E também criamos o arquivo `accounts.js` na mesma pasta, com uma função chamada `getAccount(id)`, retornando `undefined`.

```javascript
export function getAccount(id) {
    return undefined
}
```

A função `getAccount` seria responsável pelo acesso ao banco de dados, porém, como estamos testando unitariamente, não queremos que o teste acesse serviços externos desse tipo.

Nosso objetivo é testar somente a função `transferMoney`. Por isso, chamamos de **teste unitário**: a ideia é testar uma unidade lógica e não a integração de todos os nossos módulos e funções.

O próximo passo é entender o que são os **stubs**.

>  **Importante ❗❗:**
>
> A palavra `mock` popularizou-se mais que a palavra `stub`.
>
> Hoje é muito mais comum usarmos o nome `mock` para tudo (inclusive o próprio jest não trabalha com a palavra stub).

## Stubs (ou mocks)
Os `stubs` são formas de simular retornos de funções existentes, de acordo com certos parâmetros.

Primeiro, vamos fazer um teste sem utilizar o `stubs` da nossa transferência. No arquivo `transferMoney.spec.js`, declararemos o código a seguir:

```javascript
import { transferMoney } from '../transferMoney.js';

describe("transferMoney", () => {
    test("it should charge payer with 5% of tax plus fixed tax of 100 when transfering ana mount between 1000 and 5000", () => {
        const payerId = 1;
        const receiverId = 2;
        
        const updatedAccounts = transferMoney(payerId, receiverId, 1000);

        expect(updatedAccounts).toHaveLength(2);

        expect(updatedAccounts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, balance: 8850 }),
                expect.objectContaining({ id: 2, balance: 1000 }),
            ])
        );
    });
});
```

Rode o teste com o seguinte comando:

```bash
npm test __tests__/transferMoney.spec.js
```

Ao rodar esse teste, observe o que diz o relatório de erros: 

```shell
TypeError: Cannot read property 'balance' of `undefined`
```

Isso acontece porque, de fato, nosso teste unitário entrou dentro da função `getAccount` e, como no momento estamos retornando `undefined`, ele não conseguiu seguir com sua execução.

Em um exemplo real de banco de dados, receberíamos um erro de conexão com o banco, pois, provavelmente, não teríamos um banco de dados configurado (e nem é o objetivo ter quando falamos de testes unitários).

Agora, vamos criar um `stub` (ou `mock`) dentro dos nossos testes utilizando o próprio `jest`, mas simulando a chamada da função `getAccount(id)`.

Primeiro, você precisa mudar a forma que está importando o recém criado módulo `accounts.js` no `transferMoney.spec.js`, da seguinte forma:

```javascript
import * as accounts from "../accounts";
```

E agora, alteramos o teste:
```javascript
test("it should charge payer with 5% of tax plus fixed tax of 100 when transfering ana mount between 1000 and 5000", () => {
    const payerId = 1;
    const receiverId = 2;

    accounts.getAccount = jest.fn()
        .mockReturnValueOnce(new Account(payerId, 10000))
        .mockReturnValueOnce(new Account(receiverId, 0));

    const updatedAccounts = transferMoney(payerId, receiverId, 1000);

    expect(updatedAccounts).toHaveLength(2);

    expect(updatedAccounts).toEqual(
        expect.arrayContaining([
            expect.objectContaining({ id: 1, balance: 8850 }),
            expect.objectContaining({ id: 2, balance: 1000 }),
        ])
    );
});
```

Destaque para o seguinte bloco de código:
```javascript
const payerId = 1;
const receiverId = 2;

accounts.getAccount = jest.fn()
    .mockReturnValueOnce(new Account(payerId, 10000))
    .mockReturnValueOnce(new Account(receiverId, 0));
```

A primeira linha usa o `jest.fn()` para criar o `mock`.

Na segunda linha, a declaração `.mockReturnValueOnce(new Account(payerId, 10000))` está mockando **apenas uma vez** a função `getAccount(id)`.

Já a terceira linha cria mais um `mock` para a função, agora retornando a conta do recebedor.

> **Repare que a ordem dos `mocks` faz toda diferença.**
>
> Caso a gente a troque, o teste não passaria pois ele devolveria a conta do recebedor como se fosse a do pagador.

> **Importante ❗❗:**
>
> Desenvolvendo o teste com mocks, isolamos completamente a lógica do método `getAccount`.
>
> A principal vantagem disso é que, se um bug for introduzido no método `getAccount`, ele não vai interferir nos testes unitários do módulo `transferMoney.js`. Esse bug afetaria somente os testes do próprio módulo `accounts`.

## Outros tipos de mock

Existem muitas formas de representar o mesmo mock, cada uma com sua particularidade.

Dê uma olhada na documentação do `jest` sobre mocks (https://jestjs.io/pt-BR/docs/mock-functions) e veja quais são essas outras possibilidades.

Por hora, vamos entender as mais utilizadas:

### Mocks que alteram as implementações

```javascript
accounts.getAccount = jest.fn()
    .mockImplementationOnce((id) => new Account(id, 10000))
    .mockImplementationOnce((id) => new Account(id, 0))
```

O `mockImplementationOnce` muda a implementação da função completamente.

É como se a função `getAccount` tenha se transformado na função que está sendo passada como parâmetro nesse `mock`.

As vezes, é necessário que o `mock` não retorne um valor específico, mas também execute algum trecho de código. É exatamente para isso que serve essa forma de "mockar".

>  **Importante ❗❗:** Tanto o `mockReturnValueOnce` como o `mockImplementationOnce` podem ser substituídos por `mockReturnValue` ou `mockImplementation`, respectivamente.
>
> Porém, na segunda opção, aquele `mock` vai servir para toda e qualquer chamada. Se criarmos um mock por cima, ele vai substituí-lo.

Todavia, nosso teste ainda pode melhorar. Lembra que precisamos manter nosso código resiliente? Isto é, não permitir que alterações de código (às vezes até não intencionais) introduzam bugs e passem ilesos na nossa suíte de testes unitários.

Vamos fazer um teste: faça a seguinte alteração na sua nova função `transferMoney.js`:

```javascript
const payer = getAccount(5);
const receiver = getAccount(3);
```
Este código alterado está errado, pois não considera os parâmetros enviados para a função na hora de buscar pelas contas do banco. Isto é, se esse código for lançado para todas as pessoas, qualquer transferência que elas forem fazer sairão da conta de ID 5 para a conta de ID 3, sendo um comportamento que, definitivamente, nossos testes deveriam acusar. Execute-os e veja que isso não acontece.

Isso acontece porque não estamos especificando os parâmetros que devemos passar para as funções mockadas, fazendo com que elas retornem o que queremos, independente desses parâmetros. Vamos resolver isso...

### Mocks para verificar chamadas
É muito comum precisarmos validar que determinadas funções estão sendo chamadas, mas não necessariamente validar se elas estão retornando algo.

Para exemplificar esse cenário, vamos extrair as funções `validateAmountLimit` e `validatePayerAmount` para um outro arquivo, o `validations.js`.

```javascript
export function validateAmountLimit(transferAmount) {
    if (transferAmount < 1000 || transferAmount > 9999) {
        throw new Error(`Transfer amount is invalid: ${transferAmount}`);
    }
}

export function validatePayerAmount(payerBalance, transferAmount, tax) {
    if (payerBalance < transferAmount + tax) {
        throw new Error(`Insufficient funds`);
    }
}
```

Agora, removemos as funções do arquivo `transferMoney.js`, e importamos as funções de validação do arquivo `validations.js`.
```javascript
import { Account } from "./account";
import { getAccount } from "./accounts";

export function transferMoney(payerId, receiverId, transferAmount) {
    validateAmountLimit(transferAmount);
    console.log(amountLimitInvalidError.message);

    const tax = calculateTax(transferAmount);

    const payer = getAccount(payerId);
    const receiver = getAccount(receiverId);

    validatePayerAmount(payer.balance, transferAmount, tax);

    const updatedPayerAccount = new Account(
        payerId,
        payer.balance - transferAmount - tax
    );

    const updatedReceiverAccount = new Account(
        receiverId,
        receiver.balance + transferAmount
    );

    return [updatedPayerAccount, updatedReceiverAccount];
}
```

Nesse cenário, queremos testar unitariamente a função `transferMoney`, e não necessariamente fazer nosso código entrar dentro das funções de validação.

Ao mesmo tempo, precisamos nos assegurar que essas validações são pelo menos invocadas com os parâmetros corretos.

Para isso, existe o `expect(mock).toHaveBeenCalledWith()`.

Vamos criar um segundo teste:

```javascript
test("it should validate payer balance and transfer amount", () => {
    const payerId = 1;
    const receiverId = 2;
    const transferAmount = 1000;
    const payerInitialBalance = 10000;

    accounts.getAccount = jest
        .fn()
        .mockReturnValueOnce(new Account(payerId, 10000))
        .mockReturnValueOnce(new Account(receiverId, 0));

    validations.validateAmountLimit = jest.fn();
    validations.validatePayerAmount = jest.fn();

    transferMoney(payerId, receiverId, transferAmount);

    expect(validations.validateAmountLimit).toHaveBeenCalledWith(
        transferAmount
    );

    expect(validations.validatePayerAmount).toHaveBeenCalledWith(
        payerInitialBalance,
        transferAmount,
        150
    );
});
```

As últimas linhas estão verificando se as funções "mockadas" estão sendo chamadas com os parâmetros certos.

Caso a função mockada não tenha parâmetros ou eles, para o escopo do seu teste, sejam irrelevantes, podemos chamar simplesmente `.toHaveBeenCalled()`. Dessa forma, ele não vai se importar com os parâmetros passados para a função, mesmo que ela tenha argumentos.

Com esse novo aprendizado, você conseguiria corrigir o problema que identificamos há alguns parágrafos atrás? Como garantir que a função `getAccount` está sendo chamada com os parâmetros corretos?

```javascript
accounts.getAccount = jest.fn()
    .mockReturnValueOnce(new Account(payerId, 10000))
    .mockReturnValueOnce(new Account(receiverId, 0));

const updatedAccounts = transferMoney(payerId, receiverId, 1000);

expect(accounts.getAccount).toHaveBeenCalledWith(payerId);
expect(accounts.getAccount).toHaveBeenCalledWith(receiverId);
expect(updatedAccounts).toHaveLength(2);
```

Agora, execute os testes ainda sem consertar os parâmetros do `getAccount` e veja os testes falharem!

> **Importante ❗❗:**
>
> Agora que estamos mockando as funções de validação, elas não estão sendo testadas.
>
> Pare tudo o que você estiver fazendo parar extrair os testes de validação do `transferMoney.spec.js` para um novo arquivo chamado `validations.spec.json`.
>
> Dessa forma, seus testes ficam mais centralizados, facilitando a construção de novos casos.

## `beforeEach` e `afterEach`

Podemos observar que, no nosso arquivo de testes `transferMoney.spec.js`, temos um código que se repete nos dois testes. Isso é muito comum quando desenvolvemos aplicações com mais cenários testáveis.

Para manter um código mais legível, existem os blocos `beforeEach` e `afterEach`, sendo que o código dentro desses blocos será executado uma vez antes de cada teste e uma vez no final de cada teste, respectivamente. Esses blocos devem ser criados dentro de um `describe`. Por exemplo:

```javascript
describe("transferMoney", () => {
    beforeEach(() => {
        accounts.getAccount = jest
            .fn()
            .mockImplementationOnce(payerId => new Account(payerId, 10000))
            .mockImplementationOnce(receiverId => new Account(receiverId, 0));
    });

    afterEach(() => {
        accounts.getAccount.mockClear();
    });

    test("it should charge payer with 5% of tax plus fixed tax of 100 when transfering ana mount between 1000 and 5000", () => {
        const updatedAccounts = transferMoney(payerId, receiverId, 1000);

        expect(updatedAccounts).toHaveLength(2);

        expect(updatedAccounts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, balance: 8850 }),
                expect.objectContaining({ id: 2, balance: 1000 }),
            ])
        );
    });

    test("it should validate payer balance and transfer amount", () => {
        const payerId = 1;
        const receiverId = 2;
        const transferAmount = 1000;
        const payerInitialBalance = 10000;

        validations.validateAmountLimit = jest.fn();
        validations.validatePayerAmount = jest.fn();

        transferMoney(payerId, receiverId, transferAmount);

        expect(validations.validateAmountLimit).toHaveBeenCalledWith(
            transferAmount
        );

        expect(validations.validatePayerAmount).toHaveBeenCalledWith(
            payerInitialBalance,
            transferAmount,
            150
        );
    });
});
```

No `beforeEach`, mockamos as contas que se repetem nos testes.

Já no `afterEach`, limpamos o mock para que ele não afete os próximos testes (nesse caso, não afetaria, mas é uma boa prática).

Outros blocos também importantes que devem ser considerados são o `beforeAll` e o `afterAll`. Em vez de executados a cada teste dentro do `describe`, eles executam apenas uma vez por suíte de testes, no início e no final, respectivamente.

## Como mockar erros?
No nosso novo arquivo `validations.js`, lançamos erros caso os parâmetros não sigam certas regras. Outro ponto que é muito importante de ser testado é **como minha função vai reagir se receber um erro?**

Para isso, vamos criar uma nova regra de negócio e, caso alguma função de `validations` lance um erro para `transferMoney`, devemos imprimir no `console` a mensagem contida dentro do erro (faremos isso apenas para fins didáticos. Usar `console.log` não é uma boa prática em aplicações reais).

Vamos, primeiramente, ver como criar esse teste, usando o já conhecido `mockImplementation` para substituir a implementação da função de validação para lançar um erro qualquer.

```javascript
test("it should log in console when amount limit is invalid", () => {
    console.log = jest.fn();

    const payerId = 1;
    const receiverId = 2;
    const transferAmount = 1000;

    validations.validateAmountLimit = jest.fn().mockImplementation(() => {
        throw new Error("erro");
    });
    validations.validatePayerAmount = jest.fn();

    transferMoney(payerId, receiverId, transferAmount);

    expect(console.log).toHaveBeenCalledWith("erro");
});
```

Ao perceber que esse teste falhou, vamos implementar este bloco de código na nossa função `transferMoney`:

```javascript
try {
    validateAmountLimit(transferAmount);
} catch (amountLimitInvalidError) {
    console.log(amountLimitInvalidError.message);
}
```

E pronto! Os testes agora irão passar, mesmo que adicionamos um novo comportamento para a nossa aplicação. Testar a reação aos erros é bastante esquecido, mas igualmente importante.

## Mais uma forma de mockar: `spyOn`

Uma última forma que o `jest` permite criar mocks é criando um "espião" (`spy`) para a função ou módulo que você quer testar. A maior diferença é que o `spyOn` não altera a implementação do que ele estiver "mockando", a não ser que você queira.

Um exemplo com nosso teste de validação, utilizando `spyOn`, ficaria da seguinte forma (sugiro replicar o teste para não perder o que já foi feito):

```javascript
test("it should validate payer balance and transfer amount (spy test)", () => {
    const payerId = 1;
    const receiverId = 2;
    const transferAmount = 1000;
    const payerInitialBalance = 10000;

    const validateAmountLimitSpy = jest.spyOn(
        validations,
        "validateAmountLimit"
    );

    const validatePayerAmountSpy = jest.spyOn(
        validations,
        "validatePayerAmount"
    );

    transferMoney(payerId, receiverId, transferAmount);

    expect(validateAmountLimitSpy).toHaveBeenCalledWith(transferAmount);
    expect(validatePayerAmountSpy).toHaveBeenCalledWith(
        payerInitialBalance,
        transferAmount,
        150
    );
});
```

Nesse teste, o código vai executar a implementação real dos métodos de validação e, por isso, é melhor utilizarmos o sufixo `spy` para este tipo de "mock".

O `spyOn` só é considerado um mock porque podemos verificar se a uma certa função foi chamada e são nessas condições que ele deve ser utilizado: quando você, por algum motivo, precisa verificar chamadas de função, mas não quer deixar de executar a implementação real das funções "espionadas".

## Mockando funções do javascript
Outra facilidade que o `jest` oferece é você poder mockar chamadas do próprio javascript. Não sei se vocês repararam, mas fizemos isso no nosso teste de comportamento de parâmetros inválidos com o `console.log`:

```javascript
test("it should log in console when amount limit is invalid", () => {
    console.log = jest.fn();

    const payerId = 1;
    const receiverId = 2;
    const transferAmount = 1000;

    validations.validateAmountLimit = jest.fn().mockImplementation(() => {
        throw new Error("erro");
    });
    validations.validatePayerAmount = jest.fn();

    transferMoney(payerId, receiverId, transferAmount);

    expect(console.log).toHaveBeenCalledWith("erro");
});
```

Isso pode ser útil em diversas situações, como por exemplo quando precisamos validar a data atual. Se não utilizarmos um mock, o teste falharia no dia seguinte pois o retorno de `Date.now()` já seria outro.

Vamos criar um teste de exemplo:

```javascript
test("it should test a mock of current date", () => {
    Date.now = jest.fn().mockReturnValue("2000-01-01");

    expect(Date.now()).toBe("2000-01-01");
});
```

## Conclusão e discussão sobre Testes "Mockistas" x Testes "Classistas"

Testes "mockistas" são testes que mockam as funções externas (como vimos nos exemplos) e o "classista" é quando não utilizamos mocks e deixamos o teste adentrar na lógica das outras funções. Ambos tem seu lado positivo e negativo e cabe ao seu julgamento quando usar o quê.

Um teste mockista, em aplicações de larga escala, embora isolem unidades lógicas para termos a certeza exata do que está sendo testada, dificultam muito muito a evolução de um código quando utilizados sem critério. Isso acontece porque nos testes mockistas você precisa conhecer a implementação do que está sendo testado.

> **Exemplo:** no teste de `transferMoney`, é necessário saber que a função acessa `getAccount` duas vezes. Se os parâmetros da função `getAccount` mudam, por exemplo, o teste mockista quebra.
>
> Todavia, o `getAccount` está simulando uma chamada a um banco de dados e, nesses casos para testes unitários, o uso de mocks é encorajado.

Já no caso de `validations`, utilizar mocks torna-se um pouco mais questionável. Utilizando mocks ganhamos mais facilidade para testar, pois tiramos os métodos de validação do meio de um fluxo complexo de código. Porém, os testes mockistas de `transferMoney` precisam conhecer o nome das funções de `validations` e seus parâmetros que, caso mudem por algum motivo, quebram esses testes a nível de compilação.

> **Importante ❗❗:**
>
> Alterar testes funcionando que não tem relação com seu novo código é algo que queremos evitar o máximo possível, por mais que as mudanças sejam simples.

Finalmente, a questão de usar muitos mocks ou não, fica bastante a critério dos padrões de código da aplicação ou do seu time.

Minha opinião é que, como diversas outras, mocks são uma estratégia que podem ser usadas em diversas situações e não deve ser considerado uma bala de prata que vai facilitar a criação de todos os seus testes unitários.

Embora agregue redundâncias, muitas vezes criar um teste mockista custa muito mais tempo do que um classista, além das desvantagens mencionadas que ele traz naturalmente.

> Bala de prata (do inglês *silver bullet*) é um termo muito comum utilizado, principalmente na programação e é uma metáfora para designar uma solução simples que resolve um problema complexo. Quando falamos que uma solução não deve ser considerada bala de prata, queremos dizer que ela não deve ser usada para todos os problemas que encontrar, precisamos analisar as condições antes de ter certeza que aquela é a solução que estamos buscando.

## Desafio
Nosso desafio agora é criar uma loja virtual em um novo projeto com algumas regras de negócio.

Essa loja conta com um banco de dados (pode ser representado por mocks), contendo produtos, estruturados da seguinte forma: `id`, `nome`, `preco` e `quantidade_estoque`.

**Além disso, a loja está em promoção!**

Levando dois produtos, vc ganha **10%** de desconto. Caso leve 3 ou mais, o desconto passa para 20% e esse é o máximo que o desconto pode chegar.

Além da soma dos preços dos produtos com desconto, a loja também cobra frente nas compras abaixo de **R$100,00**.

Para calcular o frete, você pode utilizar a seguinte API pública

> https://viacep.com.br/ws/30350040/json/

**Dica:** Para buscar novos CEPs, substitua o valor numérico da URL pelo CEP do cliente.

Para qualquer país fora do sudeste, será cobrado um frete de **R$25,00** (lembrando que apenas para compras abaixo de R$100,00).

Lembre-se que também vale utilizar mocks para seus testes que fazem chamadas para a API.

Sua aplicação deve calcular o preço final da compra baseando-se em duas variáveis:

- o CEP do cliente
- um `array` com os `ids` dos produtos que estão sendo comprados.

> **DICAS DE OURO 🥇🥇**
>
> - Tentem utilizar o TDD junto com os mocks
> - Refatore bastante quando seus testes estiverem verdes
> - Crie funções e arquivos com poucas responsabilidades para tornar a criação de testes unitários mais fácil

## Conclusão

Ufa! Por essa aula ficamos por aqui! 😃

Espero que você tenha curtido esse conteúdo que foi preparado com muito carinho 💦 e que o desafio proposto ajude a fixar esses conceitos tão importantes que são os **testes unitários**!

**Boa sorte!** 💙💙💙