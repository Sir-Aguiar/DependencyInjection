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

**Linguagem**: Sinta-se livre para usar a linguagem que preferir, mas eu recomendo fortemente o uso aprendizado deste design pattern com TypeScript. Mas sempre use a linguagem que mais domina, afinal o pattern é mais importante do que código. Uma vez que o aprende, escreva-o como e onde quiser

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

```ts
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

Nosso componente agora está parcialmente desacoplado dos outros. Você não está mais criando uma instância de Notificator TODAS AS VEZES que criar uma instância de Post, o que pode lhe salvar de um vazamento de memória ou ficar careca enquanto debugga seu código.

E se você quiser testar seu código, e deveria, ainda há um problema, imagina que sua classe Notificator funciona sobre sua base de dados? Você não pode conectar-se ao banco de dados toda vez que quiser rodar seus testes. Não se preocupe, eu te salvo, meu chapa. Vamos ver como resolver este problema também.

## Por que isto acontece?

Porque se você quiser escrever testes unitários, você deve ter componentes unitários, ou seja, componentes desacoplados. Sua classe Post não está completamente desacoplada de Notificator, porque dentro de seu construtor você tem

`private notificator:Notificator`

E isto não significa que você está recebendo um objeto tipado como Notificator ou um cujo tipo mescle com a tipagem de Notificator. Isto significa que você está recebendo um objeto a partir da **classe**, uma instância da classe.

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

```ts
class Notificator {
	send() {
		console.log("The notification has been sended");
	}
}
```

### Depois

```ts
import NotificatorShape from "../@types/Notificator";

class Notificator implements NotificatorShape {
	send() {
		console.log("The notification has been sended");
	}
}
```
