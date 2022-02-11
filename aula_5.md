# Aula 5 - Explorando os mocks mais a fundo

Todavia, nosso teste ainda pode melhorar. Lembra que precisamos manter nosso código resiliente? Isto é, não permitir que alterações de código introduzam bugs e passem ilesos na nossa suite de testes unitários. Vamos fazer um teste! faça a seguinte alteração na sua nova função `transferMoney.js`:

```javascript
    const payer = getAccount(5)
    const receiver = getAccount(3)
```
Este código alterado está errado pois não considera os parâmetros enviados para a função na hora de buscar pelas contas do banco. Isto é, se esse código for lançado para as pessoas usuárias, qualquer transferência que elas fizerem sairão da conta de ID 5 para a conta de ID 3. Isso é algo que, definitivamente, nossos testes deveriam pegar. Execute-os e veja que todos passam.

Isso acontece porque não estamos especificando os parâmetros que devemos passar para as funções mockadas e elas retornam o que queremos independente desses parâmetros. Antes de partir para a solução desse problema, vamos entender mais um tipo de mock que talvez possa nos ajudar.

## Mocks para verificar chamadas
É muito comum precisarmos testar que estamos invocando funções e não necessariamente elas vão retornar algo. Para exemplificar esse cenário, vamos extrair nossas funções de validação (que, no meu caso, chamei de `validateAmountLimit` e `validatePayerAmount`) para um outro arquivo `validations.js`

```javascript
export function validateAmountLimit(transferAmount) {
    if (transferAmount < 1000 || transferAmount > 9999) {
        throw new Error(`Transfer amount is invalid: ${transferAmount}`);
    }
}

export function validatePayerAmount(payer, transferAmount, tax) {
    if (payerBalance < transferAmount + tax) {
        throw new Error(`Insufficient funds`);
    }
}
```

Agora, removemos as funções do arquivo `transferMoney.js` e importamos as funções de validação de `validations.js`
```javascript
import { Account } from "./account";
import { getAccount } from "./accounts";
import { validateAmountLimit, validatePayerAmount } from "./validations";

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

Nesse cenário, queremos testar unitariamente a função `transferMoney` e não necessariamente fazer nosso código entrar dentro das funções de validação. Ao mesmo tempo, precisamos nos assegurar que essas validações são pelo menos invocadas com os parâmetros corretos. Para isso existe o `expect(mock).toHaveBeenCalledWith(arg1, arg2, ...)`. Logo, no nosso caso, fazemos assim:

```javascript
    test("it should validate payer balance and transfer amount", () => {

        const payerId = 1
        const receiverId = 2
        const transferAmount = 1000
        const payerInitialBalance = 10000
        const expectedTax = 150

        accounts.getAccount = jest.fn()
            .mockReturnValueOnce(new Account(payerId, 10000))
            .mockReturnValueOnce(new Account(receiverId, 0))

        validations.validateAmountLimit = jest.fn();
        validations.validatePayerAmount = jest.fn();

        transferMoney(payerId, receiverId, transferAmount)

        expect(validations.validateAmountLimit).toHaveBeenCalledWith(transferAmount);
        expect(validations.validatePayerAmount).toHaveBeenCalledWith(payerInitialBalance, transferAmount, expectedTax);


    });
```

As últimas linhas estão verificando se as funções "mockadas" estão sendo chamadas com os parâmetros certos. Caso a função mockada não tenha parâmetros ou eles, para o escopo do seu teste, são irrelevantes, podemos chamar simplesmenteo método `.toHaveBeenCalled()`. Dessa forma, ele não vai se importar com os parâmetros passados para a função, mesmo que ela tenha argumentos.

Olhando a documentação https://jestjs.io/pt-BR/docs/expect (novamente), podemos explorar outras diversas formas de construir esse tipo de teste, cada uma específica para determinados cenários. (Por exemplo, o `toHaveBeenCalledTimes(times)` que serve para verificar a quantidade de vezes que uma função foi chamada.)

Com esse novo aprendizado, você conseguiria corrigir o problema que identificamos há alguns parágrafos atrás? Como garantir que a função `getAccount` esteja sendo chamada com os parâmetros corretos?

```javascript
accounts.getAccount = jest.fn()
    .mockReturnValueOnce(new Account(payerId, 10000))
    .mockReturnValueOnce(new Account(receiverId, 0))

    const updatedAccounts = transferMoney(payerId, receiverId, 1000)

    expect(accounts.getAccount).toHaveBeenCalledWith(payerId)
    expect(accounts.getAccount).toHaveBeenCalledWith(receiverId)
    expect(updatedAccounts).toHaveLength(2);
```

Agora execute os testes ainda sem consertar os parâmetros do `getAccount` e veja os testes falharem!

**Importante ❗❗:** Agora que estamos mockando as funções de validação, elas não estão sendo testadas. Pare tudo o que você estiver fazendo parar extrair os testes de validação do `transferMoney.spec.js` para um novo arquivo `validations.spec.json`. Dessa forma seus testes ficam mais centralizados e fáceis de serem construídos.

## beforeEach e afterEach

Podemos observar que no nosso arquivo de testes `transferMoney.spec.js` temos um código que se repete nos dois testes. Isso é muito comum quando desenvolvemos aplicações com mais cenários testáveis e, para manter um código mais legível, existem os blocos `beforeEach` e `afterEach` que podem ser usados dentro de um `describe`: o que estiver dentro desses blocos será executado uma vez antes de cada teste e uma vez no final de cada teste (respectivamente). Um exemplo com o nosso teste:

```javascript
describe("transferMoney", () => {
    beforeEach(() => {
        accounts.getAccount = jest.fn()
            .mockImplementationOnce((payerId) => new Account(payerId, 10000))
            .mockImplementationOnce((receiverId) => new Account(receiverId, 0))
    })
    afterEach(() => {
        accounts.getAccount.mockClear()
    })
    test("it should charge payer with 5% of tax plus fixed tax of 100 when transfering ana mount between 1000 and 5000", () => {

        const updatedAccounts = transferMoney(payerId, receiverId, 1000)

        expect(updatedAccounts).toHaveLength(2);

        expect(updatedAccounts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, balance: 8850 }),
                expect.objectContaining({ id: 2, balance: 1000 })
            ])
        );
    });
    test("it should validate payer balance and transfer amount", () => {

        const payerId = 1
        const receiverId = 2
        const transferAmount = 1000
        const payerInitialBalance = 10000

        validations.validateAmountLimit = jest.fn();
        validations.validatePayerAmount = jest.fn();

        transferMoney(payerId, receiverId, transferAmount)

        expect(validations.validateAmountLimit).toHaveBeenCalledWith(transferAmount);
        expect(validations.validatePayerAmount).toHaveBeenCalledWith(payerInitialBalance, transferAmount, 150);


    });
});
```

No `beforeEach`, mockamos as contas que se repetem nos testes e no `afterEach` limpamos o mock para que ele não afete o outros próximos testes (nesse caso, não afetaria, mas é uma boa prática). Outros blocos também importantes que devem ser considerados é o `beforeAll` e `afterAll`: ao invés de executados a cada teste dentro do `describe`, eles vão executar apenas uma vez por suite de testes, no início e no final respectivamente.

## Como mockar error?
No nosso novo arquivo `validations.js` lançamos erros caso os parâmetros não sigam certas regras. Outro ponto que é muito importante de ser testado é *como minha função vai reagir se receber um erro?*
Para isso, vamos criar uma nova regra de negócio e, caso alguma função de `validations` lance um erro para `transferMoney`, devemos imprimir no console a mensagem contida dentro do erro. (Isso é para fins didáticos. Usar console.log não é uma boa prática em aplicações reais)

Vamos, primeiramente, ver como criar esse teste, usando o já conhecido `mockImplementation` para substituir a implementação da função de validação para lançar um erro qualquer.

```javascript
    test("it should log in console when amount limit is invalid", () => {

        console.log = jest.fn();

        const payerId = 1
        const receiverId = 2
        const transferAmount = 1000

        validations.validateAmountLimit = jest.fn().mockImplementation(() => { throw new Error("erro") })
        validations.validatePayerAmount = jest.fn();

        transferMoney(payerId, receiverId, transferAmount)

        expect(console.log).toHaveBeenCalledWith("erro");

    });
```

Ao perceber que esse teste falhou, vamos implementar este bloco de código na nossa função `transferMoney`:

```javascript
    try {
        validateAmountLimit(transferAmount)
    } catch (amountLimitInvalidError) {
        console.log(amountLimitInvalidError.message)
    }
```

E pronto! Os testes agora devem estar passando e adicionamos mais um comportamento na nossa aplicação. Testar a reação aos erros é bastante esquecido mas igualmente importante.

## Mais uma forma de mockar: spyOn

Uma última forma que o jest permite criar mocks é criando um "espião" para a função ou módulo que você quer testar. A maior diferença é que o `spyOn` não altera a implementação do que ele estiver "mockando" (a não ser que você queira).
Um exemplo com nosso teste de validação, utilizando spyOn, ficaria da seguinte forma (sugiro replicar o teste para não perder o que já foi feito):

```javascript
    test("it should validate payer balance and transfer amount (spy test)", () => {

        const payerId = 1
        const receiverId = 2
        const transferAmount = 1000
        const payerInitialBalance = 10000

        const validateAmountLimitSpy = jest.spyOn(validations, "validateAmountLimit");
        const validatePayerAmountSpy = jest.spyOn(validations, "validatePayerAmount");

        transferMoney(payerId, receiverId, transferAmount)

        expect(validateAmountLimitSpy).toHaveBeenCalledWith(transferAmount);
        expect(validatePayerAmountSpy).toHaveBeenCalledWith(payerInitialBalance, transferAmount, 150);

    });
```

Nesse teste, o código vai executar a implementação real dos métodos de validação e, por isso, é melhor utilizarmos o sufixo `spy` para este tipo de """"mock"""". O `spyOn` só é considerado um mock pois podemos verificar se a uma certa função foi chamada e são nessas condições que ele deve ser utilizado: quando você, por algum motivo, precisa verificar chamadas de função, mas não quer deixar de executar a implementação real das funções "espionadas".

## Mockando funções do javascript
Outra facilidade que o jest oferece é você poder mockar chamadas do próprio javascript. Não sei se vocês repararam, mas fizemos isso no nosso teste de comportamento de parâmetros inválidos com o `console.log`:

```javascript
    test("it should log in console when amount limit is invalid", () => {

        console.log = jest.fn();

        const payerId = 1
        const receiverId = 2
        const transferAmount = 1000

        validations.validateAmountLimit = jest.fn().mockImplementation(() => { throw new Error("erro") })
        validations.validatePayerAmount = jest.fn();

        transferMoney(payerId, receiverId, transferAmount)

        expect(console.log).toHaveBeenCalledWith("erro");

    });
```