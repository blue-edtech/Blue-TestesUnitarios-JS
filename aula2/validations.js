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
