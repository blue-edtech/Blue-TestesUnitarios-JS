# Desafio 1 - Transferências internacionais

Agora é com vocês! 🥳

Além de construir tudo o que fizemos aqui, tentem agregar uma nova funcionalidade ao nosso banco, utilizando tudo que aprendemos, inclusive o TDD!

A nova funcionalidade é a seguinte:

**Nosso banco cresceu e agora faz transferências internacionais.**

Porém, para que ela seja feita, existem algumas regras:

* Não é possível transferir menos que `1000` "dinheiros";
* Não é possível transferir mais que `9999` "dinheiros";
* Não é possível transferir uma quantidade (dinheiro a ser transferido + taxas) maior do que o saldo atual do pagador
* Existe uma taxa fixa de `100` "dinheiros" para cada transferência;
* Se a transferência for entre `1000` e `5000`, existe uma taxa `5%` do valor a ser transferido, além da taxa fixa;
* Se a transferência for acima de `5001` "dinheiros", a taxa é de `10%`, além da taxa fixa.

Tentem escrever um código legível, com variáveis e funções descritivas, além de, obviamente, utilizar o TDD com testes unitários.

Isso é para o bem de vocês, pois é sobre esse código que vamos agregar ainda mais funcionalidades nas próximas aulas!
