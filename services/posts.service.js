"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const _ = require("lodash");

module.exports = {
	name: "posts",
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.MONGO_URI,
		{ useUnifiedTopology: true }
	),
	model: mongoose.model("Post", mongoose.Schema({
		title: { type: String, required: true },
		content: { type: String, required: true },
		created: { type: Date },
		updated: { type: Date }
	})),

	actions: {
		list: {
			rest: {
				method: "GET",
				path: "/"
			},
			async handler() {

				const posts = await this.adapter.find();


				return _.orderBy(posts,[ "created" ], [ "desc" ] );;
			}
		},
		create: {
			rest: "POST /",
			params: {
				title: { type: "string", min: 1, max: 35 },
				content: { type: "string", min: 1 }
			},
			async handler(ctx) {
				// should be Joi validator
				const post = ctx.params;

				// mongoose object should be created with new Post,
				// todo get Post object from model somehow
				post.created = new Date(Date.now());
				await this.adapter.insert(post);

				return post;
			}
		},
		update: {
			rest: "PUT /:id",
			async handler(ctx) {
				// just simple security check. Joi should be used here
				if (!ctx.params.title && !ctx.params.content)
					return "At least one item should be in body to use this method";

				const post = await this.adapter.findById(ctx.params.id);
				if (!post) return "no posts found";

				// Object assign method should be used here for bigger amount of content
				if (ctx.params.title) post.title = ctx.params.title;
				if (ctx.params.content) post.title = ctx.params.content;
				post.updated = new Date(Date.now());

				await post.save();

				return post;
			}
		},
		delete: {
			rest: "DELETE /:id",
			async handler(ctx) {
				if ( await this.adapter.findById(ctx.params.id) )
					return "Post not found";

				await this.adapter.removeById(ctx.params.id);
				return "post deleted successfully";
			}
		}
	}
};


