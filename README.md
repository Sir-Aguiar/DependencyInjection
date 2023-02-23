### If you want to fork/clone it here are some tips:

> It might be more pratic using declaration depending on how are you using this code base. So working inside .d.ts files you replace _export default_ by _declare_ (And don't forget to add "declaration":true inside the tsconfig.json);

> The code as example is very simple, but you can write differents tests or change a bit of the index.ts code before making your own classes, functions or types. By this you can see how you want to your code act and having a better understending about this pattern.

# Types definition

## @types/

All of the types/interfaces used on the code must be place inside this directory

### Interfaces

- NotificationShape
  > send():void;
- PostShape
  > post():void;

### Types

None type is defined

## entities/

Here all of the _entities_ used are decleared, the way the code runs and how its architeture is defined, all in here. It's important to separate the calling of the code and the part that does the trick. It's note a rule, but you are gonna thank me for this tip when rewriting your code or debugging it.

- Notificator

  > This class implements the _NotificatorShape_ interface and has only one method

  - send()
    > This one does nothing, well, when running good it calls a _console.log()_. But it has a _throw_ inside, so you're aways having an error calling this method. Later i explain why i did it, and why it's funny and pedagogic to do the same on your code lesson.
  - post()

    > This one has no trick, it work as you expect it to work, and that's the trick (So yeah, i lied, there's a trick in here too);

    > Calls a _console.log()_ and proceeds to call the _this.notificator.send()_ method, wich is a private property. And as you know, this method returns you an error.

## index.ts

This one is very straight to the point, once the code is simple, the calling it's even more simple, almost make you feel stupid.

I start by creating an object from the _Notificator_ entity;

Then i proceed to create a _post_ object from the _Post_ entity, and it receives two arguments in the constructor:

- "How to build testable and solid apps", the string required as a title for the _post_;
- And the _notificator_ object.

And finishing it, the calling of the _post()_ method from the _post_ object.


