import { describe, test, expect } from "vitest";
import Post from "../entities/Post";
import NotificatorShape from "../@types/Notificator";
import Notificator from "../entities/Notificator";

describe("Checking if the post class is working good", () => {
	const notificatorMock: NotificatorShape = { send() {} };
	const post = new Post("Mock title", notificatorMock);
	test("Should've title", () => {
		expect(post).toHaveProperty("title");
	});

	test("Should've post", () => {0
		expect(post).toHaveProperty("post");
	});

	test("Should run without errors", () => {
		expect(() => {
			post.post();
		}).not.toThrow();
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
