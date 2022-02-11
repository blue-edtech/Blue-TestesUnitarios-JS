# Aula 6 - Quando usar ou não usar mocks?

{% embed url="https://youtu.be/BEF0o1id-vY" %}

E isso pode ser útil em diversas situações, como por exemplo quando precisamos validar a data atual. Se não utilizarmos um mock, o teste falharia no dia seguinte pois o retorno de `Date.now()` já seria outro. Vamos criar um teste de exemplo:

```javascript
    test("it should test a mock of current date", () => {
        Date.now = jest.fn().mockReturnValue("2017-01-01")

        expect(Date.now()).toBe("2017-01-01")
    });
```

## Conclusão e discussão sobre Testes "Mockistas" x Testes "Classistas"

Testes "mockistas" são testes que mockam as funções externas (como vimos nos exemplos) e o "classista" é quando não utilizamos mocks e deixamos o teste adentrar na lógica das outras funções. Ambos tem seu lado positivo e negativo e cabe ao seu julgamento quando usar o quê. Um teste mockista, em aplicações de larga escala, embora isolem unidades lógicas para termos a certeza exata do que está sendo testada, dificultam muito muito a evolução de um código quando utilizados sem critério. Isso acontece porque nos testes mockistas você precisa conhecer a implementação do que está sendo testado (Exemplo: no teste de `transferMoney`, eu preciso saber que a função acessa `getAccount` duas vezes. Se os parâmetros da função `getAccount` mudam, por exemplo, o teste mockista quebra). Todavia, o `getAccount` está simulando uma chamada a um banco de dados e, nesses casos para testes unitários, o uso de mocks é encorajado.

Mas no caso de `validations`, utilizar mocks torna-se um pouco mais questionável. Utilizando mocks ganhamos mais facilidade para testar pois tiramos os métodos de validação do meio de um fluxo complexo de código. Porém, os testes mockistas de `transferMoney` precisam conhecer o nome das funções de `validations` e seus parâmetros que, caso mudem por algum motivo, quebram esses testes a nível de compilação. E alterar testes funcionando que não tem relação com seu novo código é algo que queremos evitar o máximo possível, por mais que as mudanças sejam simples.

Finalmente, a questão de usar muitos mocks ou não fica bastante a critério dos padrões de código da aplicação ou do seu time. Minha opinião é que, como diversas outras, mocks são uma estratégia que podem ser usadas em diversas situações e não deve ser considerado uma bala de prata que vai facilitar a criação de todos os seus testes unitários. Embora agregue redundâncias, muitas vezes criar um teste mockista custa muito mais tempo do que um classista, além das desvantagens mencionadas que ele traz naturalmente.
