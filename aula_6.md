E isso pode ser útil em diversas situações, como por exemplo quando precisamos validar a data atual. Se não utilizarmos um mock, o teste falharia no dia seguinte pois o retorno de `Date.now()` já seria outro. Vamos criar um teste de exemplo:

```javascript
    test("it should test a mock of current date", () => {
        Date.now = jest.fn().mockReturnValue("2017-01-01")

        expect(Date.now()).toBe("2017-01-01")
    });
```

## Conclusão e discussão sobre Testes "Mockistas" x Testes "Classistas"

Testes "mockistas" são testes que mockam as funções externas (como vimos nos exemplos) e o "classista" é quando não utilizamos mocks e deixamos o teste adentrar na lógica das outras funções. Ambos tem seu lado positivo e negativo e cabe ao seu julgamento quando usar o quê.
Um teste mockista, em aplicações de larga escala, embora isolem unidades lógicas para termos a certeza exata do que está sendo testada, dificultam muito muito a evolução de um código quando utilizados sem critério. Isso acontece porque nos testes mockistas você precisa conhecer a implementação do que está sendo testado (Exemplo: no teste de `transferMoney`, eu preciso saber que a função acessa `getAccount` duas vezes. Se os parâmetros da função `getAccount` mudam, por exemplo, o teste mockista quebra). Todavia, o `getAccount` está simulando uma chamada a um banco de dados e, nesses casos para testes unitários, o uso de mocks é encorajado.

Mas no caso de `validations`, utilizar mocks torna-se um pouco mais questionável. Utilizando mocks ganhamos mais facilidade para testar pois tiramos os métodos de validação do meio de um fluxo complexo de código. Porém, os testes mockistas de `transferMoney` precisam conhecer o nome das funções de `validations` e seus parâmetros que, caso mudem por algum motivo, quebram esses testes a nível de compilação. E alterar testes funcionando que não tem relação com seu novo código é algo que queremos evitar o máximo possível, por mais que as mudanças sejam simples.

Finalmente, a questão de usar muitos mocks ou não fica bastante a critério dos padrões de código da aplicação ou do seu time. Minha opinião é que, como diversas outras, mocks são uma estratégia que podem ser usadas em diversas situações e não deve ser considerado uma bala de prata que vai facilitar a criação de todos os seus testes unitários. Embora agregue redundâncias, muitas vezes criar um teste mockista custa muito mais tempo do que um classista, além das desvantagens mencionadas que ele traz naturalmente.

## Desafio
 Nosso desafio agora é criar uma loja virtual em um novo projeto com algumas regras de negócio. Essa loja conta com um banco de dados (que pode ser representado por mocks) que contém o identificador de cada produto (id), seu nome, seu preço e sua quantidade em estoque.
 Além disso, a loja está em promoção! 
 Levando dois produtos, vc ganha 10% de desconto. Caso leve 3 ou mais, o desconto passa para 20% e esse é o máximo que o desconto pode chegar.
 Além da soma dos preços dos produtos com desconto, a loja também cobra frete nas compras abaixo de R$100,00.
 Para calcular o frete, você pode utilizar essa API pública: https://viacep.com.br/ws/30350040/json/ e substituir o valor numérico pelo CEP do cliente. Para qualquer estado fora do sudeste, será cobrado um frete de R$25,00 (mas apenas para compras abaixo de R$100,00). E dentro do sudeste, R$10,00. Mas lembre-se que aqui também vale utilizar mocks para seus testes.
 Sua aplicação então deve calcular o preço final da compra baseando-se em duas variáveis: o CEP do cliente e um vetor com os IDs dos produtos que ele ou ela estão comprando.
 Tentem utilizar o TDD junto com os mocks, refatore bastante quando seus testes estiverem verdes, crie funções e arquivos com poucas responsabilidades para tornar a criação de testes unitários mais fácil.
 Boa sorte!