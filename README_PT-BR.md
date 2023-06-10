> Espero que aproveite deste material que eu construí enquanto estudava. E espero que possa compartilhar conosco sua experiência e seu aprendizado, pretendo fazer isto com oturos conteúdos, caso goste ou lhe seja útil nos deixe uma estrela :)

# Sobre este repositório:

## Por quê?

Durante meus estudos sobre este assunto eu senti um pouco de dificuldade para compreender por que programar desta maneira, ou como fazê-lo, e até mesmo o que estava acontecendo. Então isto é uma maneira de simplificar sua vida e tornar seus estudos mais fáceis sobre este design pattern em específico. Mesmo que o código aqui seja muito simples, vai lhe ajudar muito na compreensão deste conceito e lhe dar uma dica sobre como escrever seu próprio exemplo e como aplicar isto naquele projetinho que você está trabalhando.

## Fork/Clone

`$ git clone https://github.com/Sir-Aguiar/DependencyInjection.git`

Ao fazer isto está ajudando outras pessoas em seus estudos, e dando ao mundo mais material para explorar, pelo simples fato de compartilhar sua maneira de programar e sua visão sobre isto

## Autores

- [@sir-aguiar](https://github.com/Sir-Aguiar)

## Code stack

**Linguagem**: Sinta-se livre para usar a linguagem que preferir, mas eu recomendo fortemente o aprendizado deste design pattern com TypeScript. Mas sempre use a linguagem que mais domina, afinal o pattern é mais importante do que código. Uma vez que o aprende, escreva-o como e onde quiser

# Funcionalidade

Este código envia uma notificação para nossos usuários quando alguma nova publicação é lançada

```ts
const notificator = new Notificator();
const post = new Post("Title", notificator);
post.send(); // BANG! Your users finally know you've made a new post
```

Mas vamos dar uma olhada em como ele faz isto, onde ele mora, e de onde ele vem (Se prepare para piadas de tiozão).

# Entidades

Olhe para este código

```ts
class Notificator {
  send() {
    console.log("The notification has been sended");
  }
}
```

Como você pode ver, eu menti, este método não envia uma notificação para nossos usuários. Mas calma aí, vamos fingir que ele envia, juro que não irá se arrepender!

Você pode ver que este código não depende de outros componentes para funcionar, certo? (um componente é qualquer parte de um sistema que se destina a fazer parte de um sistema maior). Ele é completamente desacoplado dos outros componentes, e isto é ótimo! Mas não foca nessa parte agora.

Agora vamos dar uma olhada neste componente:

```ts
import Notificator from "./Notificator";

class Post {
  private notificator: Notificator;
  constructor(public title: string) {
    this.notificator = new Notificator();
  }
  post(): void {
    console.log(`New post has been published: ${this.title}`);
    this.notificator.send();
  }
}
```

Não há nada sintaticamente incorreto com ele, mas consegue ver o quanto o meu Post depende da classe Notificator? TToda vez que eu creio um objeto de Post, eu também crio um objeto de Notificador.

Com o brinde de que meu componente é diretamente dependente de outro para compilar, e isto se chama **_dependência de código fonte_**. Vamos supor que eu queira criar alguns testes ou alguma outra coisa usando a classe Post, mas eu não quero ter nenhum problema com o Notificator, o que não se pode fazer com este código. Este é o problema, vamos ver jeito melhor de escrever esta classe e resolver este problema.

### Usando injeção de dependência

```js
import Notificator from "./Notificator";

class Post {
  constructor(public title: string, private notificator: Notificator) {}
  post(): void {
    console.log(`New post has been published: ${this.title}`);
    this.notificator.send();
  }
}
```

Mas sim, nosso componente continua diretamente dependente da nossa entidade Notificator. Então se você quiser criar uma instância de Post, você precisa de uma instância de Notificator, MAS, e é um GRANDE MAS: Com este novo código você pode criar uma instância de Notificator fora de Post. E ao mesmo tempo esta instância pode ser utilizada para construir o Post, uma vez que o mesmo tem a dependência de um Notificator em seu construtor. E é por isso que chamamos de injeção de dependência... uma dependência... que injetamos.

Nosso componente agora está parcialmente desacoplado dos outros. Você não está mais criando uma instância de Notificator TODAS AS VEZES que criar uma instância de Post, o que pode lhe salvar de um vazamento de memória ou ficar careca enquanto debuga seu código.

E se você quiser testar seu código, e deveria, ainda há um problema, imagina que sua classe Notificator funciona sobre sua base de dados? Você não pode conectar-se ao banco de dados toda vez que quiser rodar seus testes. Não se preocupe, eu te salvo, meu chapa. Vamos ver como resolver este problema também.

## Por que isto acontece?

Porque se você quiser escrever testes unitários, você deve ter componentes unitários, ou seja, componentes desacoplados. Sua classe Post não está completamente desacoplada de Notificator, porque dentro de seu construtor você tem

`private notificator:Notificator`

E isto não significa que você está recebendo um objeto tipado como Notificator ou um cujo tipo bata com a tipagem de Notificator. Isto significa que você está recebendo um objeto a partir da **classe**, uma instância da classe.

## Resolvendo seu problema

### Inversão de dependência

Vamos fingir que dentro do nosso new Notificator().send() eu tenho um código completo para enviar notificações aos meus usuários. Atualmente, para construir nosso objeto de Post eu preciso de uma instância de Notificator, mas por quê? Tá certo, talvez eu queira usar esta funcionalidade dentro da classe, mas eu sou OBRIGADO a usar uma instância desta classe, do contrário não posso compilar? Se eu quero testar meu método new Post().send(), eu preciso enviar uma notificação para todos meus usuários? Não.

Dentro da minha classe Post, eu não estou utilizando toda a classe Notificator ou algum código que pertence especificamente à ela, e nem deveria. Então vamos pegar algumas propriedades que eu preciso dentro de meu componente, e construir minha interface com elas. Neste caso eu só preciso do método _send()_, e não de toda a instância da classe.

```ts
interface NotificatorShape {
  send(): void;
}
```

Agora eu preciso implementar minha interface na minha classe Interface, vamos ver como fazer isto:

### Antes

```js
class Notificator {
  send() {
    console.log("The notification has been sended");
  }
}
```

### Depois

```js
import NotificatorShape from "../@types/Notificator";

class Notificator implements NotificatorShape {
  send() {
    console.log("The notification has been sended");
  }
}
```

### Por que usar _implements_?

Bem, este é o jeito de assegurar e forçar que as propriedades que você precisa vão estar presentes no objeto, e tenha alguma segurança em seu tipo, uma vez que se define o nome e o tipo que é necessário dentro de sua interface.

### Qual é a diferença?

```js
const notificator1: NotificatorShape = {
  send() {},
};
notificator1.send();
```

```js
const notificator2: Notificator = new Notificator();
notificator2.send();
```

Dentro do método _notificator2.send()_ eu tenho toda a implementação da funcionalidade. E nós nem precisamos fingir que _notificator1.send()_ não faz nada, porque na verdade ele não faz.

> Dê uma olhada, ambos são objetos, mas notificator2 é a instância de uma classe, e notificator1 não é;

> E todos concordamos que ambos também têm a propriedade _send()_.

Qual você prefere para usar em seus testes? O primeiro certo (notificator1)? Antes de mergulhar em nossos testes, vamos fazer algumas mudanças dentro da nossa entidade Post, veja:

```js
import NotificatorShape from "../@types/Notificator";

class Post {
  constructor(public title: string, private notificator: NotificatorShape) {}
  post(): void {
    console.log(`New post has been published: ${this.title}`);
    this.notificator.send();
  }
}
```

FINALMENTE! Nossa entidade Post está **_COMPLETAMENTE DESACOPLADA_**.

### O que? Por quê? E como? Você está louco? Parece a mesma coisa para mim

Bem, não é. Deixe-me mostrar que isto não é a mesma coisa de antes.

Imagine que você queira criar um post e enviar uma notificação para todos usuários, você ainda pode fazê-lo, a implementação da funcionalidade é a mesma, e não mudou nada. Olhe como está a implementação do nosso código:

### Antes

```js
const notificator = new Notificator();
const post = new Post("Title", notificator);
post.send(); // BANG! Your users finally know you've made a new post
```

### Depois

```js
const notificator = new Notificator();
const post = new Post("Title", notificator);
post.send(); // BANG! Your users finally know you've made a new post
```

Eu acho que acabei de chorar aqui, consegue imaginar? Refatorar seu código e sua implementação continuar a mesma, e funcionar como deveria funcionar. Cara, isto é o paraíso.

Mas eu disse que iria lhe ensinar a como escrever testes, certo? Então vamos lá, sou um homem de palavra, mas eu já aviso: **Você não _precisa_ mudar uma única letra de seu código fonte agora, o código e o teste rodam independentemente**

### Eu estou tão no paraíso que eu preciso dizer ao meu código "Ei! Me dá um erro para poder brincar"

> Eu disse que você não _precisava_ mudar uma letra sequer, mas você escreveu um código tão bom, que se você só escrever os testes não vai ser tão didático para você perceber o quão importante este pattern que você acabou de aprender é.

# Escrevendo alguns testes

> ### Se você não está familiarizado com Jest ou outro framework para testes, nem esquenta, é bem intuítivo e também bem fácil de se aprender. Aqui nós iremos utilizar o Vitest, somente por preferência, honestamente, a sintaxe é similar à do Jest.

### Importando todas minhas dependências

```js
import { describe, test, expect } from "vitest";
import Post from "../entities/Post";
import NotificatorShape from "../@types/Notificator";
import Notificator from "../entities/Notificator";
```

### Criando minha unidade de teste e dando um bom nome do que esperamos que ele faça

```js
describe("Checking if the post class is working good", () => {});
```

Este primeiro argumento é como o título da unidade, e o segundo é um callbackk que roda toda vez que a unidade é testada.

### Agora vamos criar alguns mocks

> Um mock é tipo "Ei, eu quero que você finja fazer alguma coisa, mas na verdade não o faça, porque se fizer eu to f**\***"

```js
describe("Checking if the post class is working good", () => {
  const notificatorMock: NotificatorShape = { send() {} };
  const post = new Post("Mock title", notificatorMock);
});
```

### Agora nós estamos dizendo a nossa unidade de teste o que ela espera receber.

> Ao testar seu código, você o chama, espera que algo aconteça, e então checa se isto realmente aconteceu. Eu sei que é isto que você faz ao testar na mão.

```js
describe("Checking if the post class is working good", () => {
  const notificatorMock: NotificatorShape = { send() {} };
  const post = new Post("Mock title", notificatorMock);

  test("Should've title", () => {
    expect(post).toHaveProperty("title");
  });

  test("Should've post", () => {
    0;
    expect(post).toHaveProperty("post");
  });
});
```

> A função _expect_ recebe uma função, é meio engraçado. E então ela pega o valor que foi retornado desta função, você tem acesso a mil e uma propriedades que checam a validade deste valor, e caso esta checagem seja true, **PARABÉNS AGORA SEU TESTE ACABOU DE PASSAR**;

> Mas o que eu testei exatamente? Eu falei pro meu teste "Ei, espere que ele tenha a propriedade title", e então eu disse "[...] o método post".

### Agora vem a parte mais estranha, você está dizendo ao seu teste que ele deve esperar que seu código erre.

> Normalmente você passa a maior parte do seu tempo esperando que seu código não dê algum erro, mas você lembra, certo? Eu mudei meu código para que ele dê erro todas as vezes em que for chamado o método _new Notificator().send()_

```js
describe("Checking if the post class is working good", () => {
  const notificatorMock: NotificatorShape = { send() {} };
  const post = new Post("Mock title", notificatorMock);

  test("Should've title", () => {
    expect(post).toHaveProperty("title");
  });

  test("Should've post", () => {
    0;
    expect(post).toHaveProperty("post");
  });
});
describe("Running to error", () => {
  const notificator = new Notificator();
  const post = new Post("Mock title", notificator);
  test("Notificator should throw", () => {
    expect(() => {
      post.post();
    }).toThrow();
  });
});
```

> Agora, você acabou de testar seu código, e aprendeu os dois mais importantes e utilizados patterns no mundo (Inj. Dep., Inv. Dep.)! Estou orgulhoso de você!

### Agora escreva seu próprio exemplo, escreva seu código e seus testes. Vá ao mundo real e construa um foguete, sei lá!

### Se este repositório foi útil à você, dê uma estrela, e compartilhe conosco seu código.
