import NotificatorShape from "../@types/Notificator";

export default class Notificator implements NotificatorShape {
	send(): void {
		throw new Error("The notificator has failed")
		console.log("The notification has been sended");
	}
}
