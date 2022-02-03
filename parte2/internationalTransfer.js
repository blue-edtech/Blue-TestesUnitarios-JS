import { Account } from "./account";

export function internationalTransfer(payer, receiver, transferAmount) {
    validateAmountLimit(transferAmount);

    const tax = calculateTax(transferAmount);

    validatePayerAmount(payer, transferAmount, tax);

    const updatedPayerAccount = new Account(
        payer.id,
        payer.balance - transferAmount - tax
    );
    const updatedReceiverAccount = new Account(
        receiver.id,
        receiver.balance + transferAmount
    );

    return [updatedPayerAccount, updatedReceiverAccount];
}

function validateAmountLimit(transferAmount) {
    if (transferAmount < 1000 || transferAmount > 9999) {
        throw new Error(`Transfer amount is invalid: ${transferAmount}`);
    }
}

function validatePayerAmount(payer, transferAmount, tax) {
    if (payer.balance < transferAmount + tax) {
        throw new Error(`Insufficient funds`);
    }
}

function calculateTax(amount) {
    const fixedTax = 100;
    if (amount <= 5000) {
        return amount * 0.05 + fixedTax;
    }
    return amount * 0.1 + fixedTax;
}
