const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create scheme

const StorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: "public"
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  comments: [
    {
      commentBody: {
        type: String,
        require: true
      },
      commentDate: {
        type: Date,
        default: Date.now
      },
      commentUser: {
        // RelationalMapping with another collection
        type: Schema.Types.ObjectId,
        ref: "users"
      }
    }
  ],
  user: {
    // RelationalMapping with another collection
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  date: {
    type: Date,
    default: Date.now
  }
});
// Third param gives name of the collectionu
mongoose.model("stories", StorySchema, 'stories');
