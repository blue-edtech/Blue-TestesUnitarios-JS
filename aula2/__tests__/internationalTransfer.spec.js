import { Account } from '../account.js';
import { internationalTransfer } from '../internationalTransfer.js';

describe("internationalTransfer", () => {
    test("it should charge payer with 5% of tax plus fixed tax of 100 when transfering ana mount between 1000 and 5000", () => {
        const payerAccount = new Account(1, 10000)
        const receiverAccount = new Account(2, 0)

        const updatedAccounts = internationalTransfer(payerAccount, receiverAccount, 1000)

        expect(updatedAccounts).toHaveLength(2);

        expect(updatedAccounts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, balance: 8850 }),
                expect.objectContaining({ id: 2, balance: 1000 })
            ])
        );
    });

    test("it should charge payer with 10% of tax plus fixed tax of 100 when transfering ana mount between 5001 and 9999", () => {
        const payerAccount = new Account(1, 10000)
        const receiverAccount = new Account(2, 0)

        const updatedAccounts = internationalTransfer(payerAccount, receiverAccount, 6000)

        expect(updatedAccounts).toHaveLength(2);

        expect(updatedAccounts).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ id: 1, balance: 3300 }),
                expect.objectContaining({ id: 2, balance: 6000 })
            ])
        );
    });

    test("it should throw an error when payer has insufficient funds for the transfer amount plus taxes", () => {
        const payerAccount = new Account(1, 1100)
        const receiverAccount = new Account(2, 0)

        const updatedAccounts = () => {
            internationalTransfer(payerAccount, receiverAccount, 1000);
        };

        expect(updatedAccounts).toThrow(Error('Insufficient funds'));
    });

    test('it should throw an error when transfer amount is less than 1000', () => {
        const payerAccount = new Account(1, 10000);
        const receiverAccount = new Account(2, 0);

        const updatedAccounts = () => {
            internationalTransfer(payerAccount, receiverAccount, 999);
        };

        expect(updatedAccounts).toThrow(Error('Transfer amount is invalid: 999'));
    });


    test('it should throw an error when transfer amount is more than 99999', () => {
        const payerAccount = new Account(1, 100000);
        const receiverAccount = new Account(2, 0);

        const updatedAccounts = () => {
            internationalTransfer(payerAccount, receiverAccount, 99999 + 1);
        };

        expect(updatedAccounts).toThrow(Error('Transfer amount is invalid: 100000'));
    });

    test('it should charge a 5% of transfer amount plus fixed tax of 100 for transfer amounts between 1000 and 5000', () => {
        const payerAccount = new Account(1, 100000);
        const receiverAccount = new Account(2, 0);

        const updatedAccounts = () => {
            internationalTransfer(payerAccount, receiverAccount, 99999 + 1);
        };

        expect(updatedAccounts).toThrow(Error('Transfer amount is invalid: 100000'));
    });


});