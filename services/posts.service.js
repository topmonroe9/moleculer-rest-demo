"use strict";

module.exports = {
	name: "posts",

	actions: {
		getPosts: {
			rest: {
				method: "GET",
				path: "/"
			},
			async handler() {
				return "posts will be here";
			}
		},
		createPost: {
			rest: "POST /",
			async handler(ctx) {
				return "posts will be created with this method";
			}
		},
		editPost: {
			rest: "PUT /:id",
			params: {
				id: "string"
			},
			async handler(ctx) {
				return "post with id" + ctx.params.id + "is being edited";
			}
		},
		deletePost: {
			rest: "DELETE /:id",
			params: {
				id: "string"
			},
			async handler(ctx) {
				return "deleting post id" + ctx.params.id;
			}
		}
	}
};


