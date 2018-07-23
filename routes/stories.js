const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Story = mongoose.model("stories");
const User = mongoose.model("users");
const { ensureAuthenticated, ensureGuest } = require("../helpers/auth");

router.get("/", (req, res) => {
  Story.find({
    status: "public"
  })
    .sort({ date: "desc" })
    // Since we used the user data model we can use it to make a relational mapping
    .populate("user")
    .then(stories => {
      res.render("stories/index", {
        stories: stories
      });
    });
});

// Add Story Form
router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});
// Post Story
router.post("/", ensureAuthenticated, (req, res) => {
  let allowComments;
  if (req.body.allowComments) {
    allowComments = true;
  } else {
    allowComments = false;
  }
  const newStory = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  };
  new Story(newStory).save().then(story => {
    res.redirect(`stories/show/${story.id}`);
  });
});
// Show single story

router.get("/show/:id", (req, res) => {
  //   findOne is neccesaary for get by Id
  Story.findOne({
    _id: req.params.id
  })
    .populate("user")
    .populate("comments.commentUser")
    .then(story => {
      if (story.status == "public") {
        res.render("stories/show", {
          story: story
        });
      } else {
        if (req.user) {
          if (req.user.id == story.user._id) {
            res.render("stories/show", {
              story: story
            });
          }
          else{
            res.redirect("/stories")
          }
        } else {
          res.redirect("/stories");
        }
      }
    });
});

// SHow stories of a single user
router.get("/user/:userId", (req, res) => {
  Story.find({
    user: req.params.userId,
    status: "public"
  })
    .populate("user")
    .then(stories => {
      res.render("stories/index", {
        stories: stories
      });
    });
});

// Stories editing
router.get("/edit/:id", (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    if (story.user != req.user.id) {
      res.redirecy("/stories");
    } else {
      res.render("stories/edit", {
        story: story
      });
    }
  });
});

// Show stories of a logged in user
router.get("/my", ensureAuthenticated, (req, res) => {
  Story.find({
    user: req.user.id
  })
    .populate("user")
    .then(stories => {
      res.render("stories/index", {
        stories: stories
      });
    });
});

// Submit Edit  story form
router.put("/:id", (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    let allowComments;
    if (req.body.allowComments) {
      allowComments = true;
    } else {
      allowComments = false;
    }
    // New values
    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    // Save new values
    story.save().then(story => {
      res.redirect("/dashboard");
    });
  });
});

// Delete stories
router.delete("/:id", (req, res) => {
  Story.remove({
    _id: req.params.id
  })
    .then(() => {
      res.redirect("/dashboard");
      //   console.log(req.params.id);
    })
    .catch(() => {
      console.log(err);
    });
});

// Posting comments
router.post("/comments/:id", (req, res) => {
  Story.findOne({
    _id: req.params.id
  }).then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };
    // Unshift comments array
    // push adds to the end , unshift adds to the begining
    story.comments.unshift(newComment);
    story.save().then(story => {
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});
module.exports = router;
