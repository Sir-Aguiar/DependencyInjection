import Notificator from "./entities/Notificator";
import Post from "./entities/Post";

const notificator = new Notificator();
const post = new Post("How to build testable and solid apps", notificator);

post.post();
