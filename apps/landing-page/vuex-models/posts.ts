// import { type Fields, Model } from "@vuex-orm/core";

// import user from "./users";

// export default class post extends Model {
//   static entity = "posts";

//   // `this.belongsTo` is for belongs to relationship. The first argument is
//   // the Model class, and second is the field name for the foreign key.
//   static fields(): Fields {
//     return {
//       id: this.attr(null),
//       user_id: this.attr(null),
//       title: this.attr(""),
//       body: this.attr(""),
//       published: this.attr(false),
//       author: this.belongsTo(user, "user_id"),
//     };
//   }
// }
