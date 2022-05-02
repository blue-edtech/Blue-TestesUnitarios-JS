# Aula 4 - Testando aplicações com mocks e stubs

{% embed url="https://youtu.be/4rc0zXCicNw" %}

Nenhuma aplicação de mercado será tão simples quando à calculadora ou ao banco que estamos criando nas nossas aulas. Elas, com certeza, terão que acessar bancos de dados e outros serviços para consultar ou executar comandos relacionadoss às suas funcionalidades. Exemplo: na nossa função de transferência do banco, provavelmente teríamos que buscar as informações das contas em um serviço externo e escrever num banco de dados os novos saldos de cada um.

Os testes unitários, por serem os mais baratos e básicos de todos, é desaconselhado criar um banco de dados ou um serviço externo localmente somente para eles. Por esses e outros motivos, utilizamos os chamados **mocks e stubs**.

Vamos reescrever o código de transferência internacional extraindo a responsabilidade de buscar dados de uma conta para um outro módulo (um possível arquivo de acesso a banco de dados ou de acesso a alguma API externa). Estou criano nossa nova lógica de transferência no arquivo `transferMoney.js`

```javascript
import { Account } from "./account";
import { getAccount } from "./accounts";

export function transferMoney(payerId, receiverId, transferAmount) {
    validateAmountLimit(transferAmount)

    const tax = calculateTax(transferAmount)

    const payer = getAccount(payerId)
    const receiver = getAccount(receiverId)

    validatePayerAmount(payer, transferAmount, tax)

    const updatedPayerAccount = new Account(payerId, payer.balance - transferAmount - tax)
    const updatedReceiverAccount = new Account(receiverId, receiver.balance + transferAmount)

    return [updatedPayerAccount, updatedReceiverAccount]

}
```

E também criamos o arquivo `accounts.js` na mesma pasta, retornando um método `getAccount(id)` retornando `undefined`.

```javascript
export function getAccount(id) {
    return undefined
}
```

Essa seria nossa função de acesso ao banco de dados, mas como estamos testando unitariamente, não queremos que nosso teste entre em outros módulos e funções. Queremos testar somente a função `transferMoney`. Por isso chamamos de teste unitário: a ideia é testar uma unidade lógica e não testar a integração de todos os nossos módulos e funções. Para isso vamos então entender o que são os **stubs**.

**Importante ❗❗:** A palavra `mock` popularizou-se mais que a palavra `stub`. Então é comum hoje, no mercado, usar o nome mock para tudo (inclusive o próprio jest não trabalha com a palavra stub)

## Stubs (ou "mocks")

São formas de você simular retornos de funções existentes de acordo com certos parâmetros. Vamos fazer um teste, primeiro, sem utilizar o stubs da nossa transferência:

```javascript
import { transferMoney } from '../transferMoney.js';

describe("transferMoney", () => {
    test("it should charge payer with 5% of tax plus fixed tax of 100 when transfering an amount between 1000 and 5000", () => {
        const payerId = 1
        const receiverId = 2

        const updatedAccounts = transferMoney(payerId, receiverId, 1000)

        expect(updatedAccounts).toHaveLength(2);

        expect(updatedAccounts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, balance: 8850 }),
                expect.objectContaining({ id: 2, balance: 1000 })
            ])
        );
    });
});
```

Ao rodar esse teste com o comando `npm test __tests__/transferMoney.spec.js`, observe o que diz o relatório de erros:

```shell
TypeError: Cannot read property 'balance' of `undefined`
```

Isso acontece porque, de fato, nosso teste unitário entrou dentro da função getAccount e, como no momento estamos retornando undefined, ele não conseguiu seguir com sua execução. Em um exemplo real de banco de dados, receberíamos um erro de conexão com o banco pois, provavelmente, não teríamos um banco de dados configurado (e nem é o objetivo ter quando falamos de testes unitários)

Agora vamos criar um **stub (ou mock)** dentro dos nossos testes utilizando o próprio jest para simular a chamada da função `getAccount(id)`.

Primeiro, você precisa mudar a forma que está importando o recém criado módulo `accounts.js` no `transferMoney.spec.js`:

```javascript
import * as accounts from "../accounts";
```

E agora ao teste:

```javascript
test("it should charge payer with 5% of tax plus fixed tax of 100 when transfering ana mount between 1000 and 5000", () => {

        const payerId = 1
        const receiverId = 2

        accounts.getAccount = jest.fn()
            .mockReturnValueOnce(new Account(payerId, 10000))
            .mockReturnValueOnce(new Account(receiverId, 0))

        const updatedAccounts = transferMoney(payerId, receiverId, 1000)

        expect(updatedAccounts).toHaveLength(2);

        expect(updatedAccounts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, balance: 8850 }),
                expect.objectContaining({ id: 2, balance: 1000 })
            ])
        );
    });
```

Destaque para o bloco de código:

```javascript
const payerId = 1
const receiverId = 2

accounts.getAccount = jest.fn()
    .mockReturnValueOnce(new Account(payerId, 10000))
    .mockReturnValueOnce(new Account(receiverId, 0))
```

A primeira linha usa o `jest.fn()` para criar o mock. A segunda linha `.mockReturnValueOnce(new Account(payerId, 10000))` está mockando _apenas uma vez_ a função `getAccount(id)`. A terceira linha, cria mais um mock para a função, agora retornando a conta do recebedor. Repare que a ordem dos mocks faz toda diferença, caso ela seja trocada, o teste não passaria pois ele devolveria a conta do recebedor primeiro.

**Importante ❗❗:** Desenvolvendo o teste com mocks, isolamos completamente a lógica do método `getAccount` e a principal vantagem disso é que, se por um acaso, um bug for introduzido no método `getAccount`, ele não vai interferir nos testes _unitários_ do módulo `transferMoney.js`. Esse bug afetaria somente os testes do próprio módulo `accounts`

## Outros tipos de mock

Existem muitas formas de se testar comn mock, cada uma com sua particularidade. Dê uma olhada na documentação https://jestjs.io/pt-BR/docs/mock-functions e veja quais são essas outras possibilidades.

Por hora, vamos focar nas mais utilizadas, como o `mockImplementation`. Poderíamos mudar os nossos mocks para o código abaixo e obter o mesmo resultado nos testes.

```javascript
accounts.getAccount = jest.fn()
    .mockImplementationOnce((id) => new Account(id, 10000))
    .mockImplementationOnce((id) => new Account(id, 0))
```

O `mockImplementationOnce` muda a implementação da função completamente. É como se a minha função `getAccount` agora tenha se tornado a função que coloco como parâmetro desse mock. Às vezes precisamos que o mock não apenas retorne um valor, mas também execute algum trecho de código. E é para isso que serve essa forma de mockar.

**Importante ❗❗:** Tanto o `mockReturnValueOnce` como o `mockImplementationOnce` mockam apenas _uma chamada_ para aquela função. Isto é, se houvesse uma terceira chamada ao `getAccount`, o fluxo de código iria para a implementação real da função. Em muitas situações, podemos eliminar o sufixo `Once` e usar simplesmente `mockReturnValue` ou `mockImplementation`. Dessa forma ele cria um mock que sempre vai retornar aquele valor, independente do número de chamadas. No nosso caso, como temos duas chamadas diferentes para o `getAccount`, precisamos usar o sufixo `Once`.
