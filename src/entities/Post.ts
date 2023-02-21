import NotificatorShape from "../@types/Notificator";
import PostShape from "../@types/Post";

export default class Post implements PostShape {
	constructor(public title: string, private notificator: NotificatorShape) {}
	post(): void {
		console.log(`New post has been published: ${this.title}`);
		this.notificator.send();
	}	
}
