describe('transferWithTax', () => {

  test('it should charge 100 from the payer account for a transfer', () => {

    const payerAccount = new Account(1, 1000)
    const receiverAccount = new Account(2, 0)

    const updatedAccounts = transferWithTax(payerAccount, receiverAccount, 500)

    expect(updatedAccounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({id: 1, balance: 500}),
        expect.objectContaining({id: 2, balance: 400})

      ])
    );

  });
});