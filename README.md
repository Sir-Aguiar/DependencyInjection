# [Versão em pt-br / Version in pt-br](/README_PT-BR.md)

# About this repository:

## Why?

When studying this subject I felt some difficulty to comprehend why to code like this, how to do it, and what was going on, so this is to make your life simpler and more easy to study this especific pattern. Even that the code inside here is very simple, it helps a lot to understand this concept and giving you a head of how to write your own example and how to apply it on that project you're woking on, etc...

## Fork/Clone it and send your code by pull request

`$ git clone https://github.com/Sir-Aguiar/DependencyInjection.git`

By doing it you're helping another people to study, and giving the world more material to explore, just by sharing your way of code and your own vision about it.

## Authors

- [@sir-aguiar](https://github.com/Sir-Aguiar)

## Code stack

**Language** : Feel free to use the language that you prefer, but i highly recomend you to learn, and code this pattern with TypeScript. But aways use the language you dominate the most, the pattern is more important than the code. Once you learn it you can do it wherever you want.

# Functionality

This code send to our users a notification when some new post is released

```js
const notificator = new Notificator();
const post = new Post("Title", notificator);
post.send(); // BANG! Your users finally know you've made a new post
```

But let's take a look on how it does it, where it lives, and from where it came from (Be prepared for grandpa jokes).

# Entities

Look at this code:

```ts
class Notificator {
	send() {
		console.log("The notification has been sended");
	}
}
```

As you can see, I lied, it doesn't send a notification to our users. But hey, let's pretend that's what it does, I swear you aint regreting it.

You can see that this component doesn't depend of another component to work, right? (a component is any part of the system that intends to be part of a bigger system). It's fully undocked of the anothers components, and thats good! But don't focus on this part about now,

Let's take a look at this one:

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

There's nothing syntactically wrong with it, but can you see how much my Post class is dependent of the Notificator class? Everytime I create an object of Post, i'm also creating an object of Notificator.

And my component it's directly dependent from another one to compile, and thats called **_source dependency_**. Let's suppose I wanna create some tests or another thing using the Post class, but I don't wanna have any problem with the Notificator, that can't be done with this code. That's a problem, but let's see a better way to write this class and solve this problem

### Using dependency injection

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

But yes, our component is still directly dependent of Notificator entity. In other words, you wanna create an instance of Post, you need an instance of Notificator, BUT, and that's a BIG BUT: With this new code you can create an Notificator instance outside your Post, then use it from the outside. At the same time this instance can be used to build the Post, once it has the dependency of a Notificator on its constructor. And that's why we call it dependency injection... a dependency... we injected.

Your component know is partially undocked from another one. You're not creating an instance of Notificator EVERYTIME you create an instance of Post, it might save you from a memory leak and getting bald while debugging your code.

What if you wanna test your code, and you should, there is still a problem, imagine your Notificator class works on data base? You can't connect to your database every time you wanna run your tests. Don't worry, I got your back buddy. Let's see how to solve this problem too.

### Why does it happen?

Cause if you wanna write unitary test, you must have unitary components, or undocked components. Your Post class is not fully undocked from Notificator, cause inside your constructor you have

`private notificator:Notificator`

And that means you're not receiving an object typed as Notificator or one wich the types match Notificator's type. It means you're receiving an object from the **class**, an instance from the class.

## Solving your problem

### Dependency Inversion

Lets pretend that inside my new Notificator().send() I have the whole code to send notifications to my users. Currently, to build my Post object I need an instance of Notificator, but why? Ok, I might want to use the functionality inside it, but am I OBLIGATED to use an instance, otherwise it won't compile? If I wanna test my new Post().send() method, I need to send a notification to all my users? No.

Inside my Post class, i'm not using the whole Notificator class or some code that belong ESPECIFICALLY to it, and i shouldn't. So let's take the properties I need inside my component, and build my interface with it. In this case i only need the _send()_ method, and not the whole instance of the class.

```ts
interface NotificatorShape {
  send(): void;
}
```

Now i need to implement this interface to my Notificator class, see how we do it:

### Before

```js
class Notificator {
  send() {
    console.log("The notification has been sended");
  }
}
```

### After

```js
import NotificatorShape from "../@types/Notificator";

class Notificator implements NotificatorShape {
  send() {
    console.log("The notification has been sended");
  }
}
```

### Why use _implements_?

Well, that's the way you got to ensure and enforce that the properties you need are gonna be present to the object, and have some security about it's type, once you define the name and the type it needs inside your interface.

### What's the difference?

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

Inside my _notificator2.send()_ method i have the whole implementation of a functionality. And we don't even need to pretend that _notificator1.send()_ does nothing, cause it does nothing.

> Take a look, both are objects, but the notificator2 is an instance of a class, and the notificator1 it's not.

> And we all agree that also both have the _send()_ property.

So wich one do you prefer to use in your tests? The first one right? But before we jump in to our tests, we need to make a few changes inside our Post entity, let's see:

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

WE FINALLY DID IT! Our Post entity it's **_FULLY UNDOCKED_**

### What? Why? And how? Are you crazy? Looks the same to me

Well, you must be blind. Let me show you that this is not the same than before.

Imagine you wanna create a post and send a notification to your users, you still can do it, and the implementation of this functionality hasn't changed a bit. Just look at my code implementation:

### Before

```js
const notificator = new Notificator();
const post = new Post("Title", notificator);
post.send(); // BANG! Your users finally know you've made a new post
```

### After

```js
const notificator = new Notificator();
const post = new Post("Title", notificator);
post.send(); // BANG! Your users finally know you've made a new post
```

I think i just cried in here, can you imagine? Refactoring your code and its implementation is still the same, and works as it should. Man, that's heaven.

But I told you that I was gonna teach you how to write tests right? Let's go then, I'm a man of word, but I warn you: **You don't need to change a single letter from your source code now, the code and the test run independently**.

### I'm so in heaven that i need to say to my code "Hey! Gimme an error to have fun"

> I said you don't need to change a letter, but you wrote a code so good, that if you just write some tests, it won't be didatic to you realise how important the design pattern you just learn is.

# Writing some tests

> ### If you're not familiarized with Jest or another test framework, no worries, it's quite intuitive and also very easy to learn. In here i'm using Vitest, just by preference, honestly, syntax it's just like Jest.

### Importing all of my dependencies

```js
import { describe, test, expect } from "vitest";
import Post from "../entities/Post";
import NotificatorShape from "../@types/Notificator";
import Notificator from "../entities/Notificator";
```

### Creating my test case and giving it a good name of what I expect it to do

```js
describe("Checking if the post class is working good", () => {});
```

The first argument it's like the title of the case, and the second it's a callback function that runs everytime this case is tested.

### Now I'm creating my mocks

> A _mock_ is like "Hey, i wan't you to pretend you do something, but you actually don't, cause if you do I'm f\*\*\*\*d"

```js
describe("Checking if the post class is working good", () => {
	const notificatorMock: NotificatorShape = { send() {} };
	const post = new Post("Mock title", notificatorMock);
});
```

### Now I'm telling my test case what to expect to receive

> When you're testing something, you call your code, expect something to happen and checks if that happens. I know that's what you do when testing it by hand

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

> The _expect_ function receives a function, kinda funny, right? And it takes the return of the function, then you can access a thousand of properties and methods that checks if it returns true, if it does, **CONGRATULATIONS YOUR TEST JUST PASSED**;

> But what i've tested exactly? I said to my test "Hey, expect it to have a title property" and then I said "[...] post method".

### Now it comes the more weird part, you're telling you test to expect an error.

> Usually you spent the most part of your time hoping it don't throw something, but you remember right? I changed my code so it throws an error everytime _new Notificator().send()_ is called

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

> Now, you've finally tested you code, and learned the most two important and used design patterns in the world (Dep. Inj., Dep. Inv.)! So proud of you.

### Now write your own example, write your own code and your own tests. Go to the world and build a rocket, I don't know!

### If this repository was useful for you, give it a star, and share with us your code.
