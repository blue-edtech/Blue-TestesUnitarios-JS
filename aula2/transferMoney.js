import { Account } from "./account";
import { getAccount } from "./accounts";
import { validateAmountLimit, validatePayerAmount } from "./validations";

export function transferMoney(payerId, receiverId, transferAmount) {
    try {
        validateAmountLimit(transferAmount);
    } catch (amountLimitInvalidError) {
        console.log(amountLimitInvalidError.message);
    }

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

function calculateTax(amount) {
    const fixedTax = 100;
    if (amount <= 5000) {
        return amount * 0.05 + fixedTax;
    }
    return amount * 0.1 + fixedTax;
}
