import { Account } from '../account.js';
import { transfer } from '../transfer.js';

describe("transfer", () => {
    test("it should transfer 500 from an account with 1000 to another with 0", () => {
        // Criação do cenário (setup)
        const payerAccount = new Account(1, 1000)
        const receiverAccount = new Account(2, 0)

        // Execução do que está sendo testado
        const updatedAccounts = transfer(payerAccount, receiverAccount, 500)

        // Asserts
        expect(updatedAccounts).toHaveLength(2);

        expect(updatedAccounts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 2, balance: 500 }),
                expect.objectContaining({ id: 1, balance: 500 })
            ])
        );
    });

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

    test('it should throw an error when transfer amount is negative', () => {
        const payerAccount = new Account(1, 1000);
        const receiverAccount = new Account(2, 1000);

        const updatedAccounts = () => {
            transfer(payerAccount, receiverAccount, -10);
        };

        expect(updatedAccounts).toThrow(Error('Invalid transfer amount: -10'));
    });

    test('it should throw an error when transfer amount is 0', () => {
        const payerAccount = new Account(1, 1000);
        const receiverAccount = new Account(2, 1000);

        const updatedAccounts = () => {
            transfer(payerAccount, receiverAccount, 0);
        };

        expect(updatedAccounts).toThrow(Error('Invalid transfer amount: 0'));
    });

});