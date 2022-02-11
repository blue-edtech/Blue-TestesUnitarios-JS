# Desafio 2 - Loja Virtual

Nosso desafio agora é criar uma loja virtual em um novo projeto com algumas regras de negócio. Essa loja conta com um banco de dados (que pode ser representado por mocks) que contém o identificador de cada produto (id), seu nome, seu preço e sua quantidade em estoque.

**Além disso, a loja está em promoção!** 

- Levando dois produtos, vc ganha 10% de desconto. Caso leve 3 ou mais, o desconto passa para 20% e esse é o máximo que o desconto pode chegar.
- Além da soma dos preços dos produtos com desconto, a loja também cobra frete nas compras abaixo de R$100,00.
- Para calcular o frete, você pode utilizar essa API pública: https://viacep.com.br/ws/30350040/json/ e substituir o valor numérico pelo CEP do cliente. Para qualquer estado fora do sudeste, será cobrado um frete de R$25,00 (mas apenas para compras abaixo de R$100,00). E dentro do sudeste, R$10,00. Mas lembre-se que aqui também vale utilizar mocks para seus testes.
- Sua aplicação então deve calcular o preço final da compra baseando-se em duas variáveis: o CEP do cliente e um vetor com os IDs dos produtos que ele ou ela estão comprando.

Tentem utilizar o TDD junto com os mocks, refatore bastante quando seus testes estiverem verdes, crie funções e arquivos com poucas responsabilidades para tornar a criação de testes unitários mais fácil.

Boa sorte! 🍀🍀
