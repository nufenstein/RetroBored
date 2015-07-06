Router.configure({
    layoutTemplate: 'main'
});

Router.map(function(){
    this.route('splash', {path:'/'});
});

Router.route('/retro/:_id', function(){
        this.render('retro', {
            data: function(){
                var currentMeeting = this.params._id;
                return Meetings.findOne({ _id: currentMeeting });
            }
        });
    });

Issues = new Mongo.Collection("issues");
ActionItems = new Mongo.Collection("actionitems");
Meetings = new Mongo.Collection("meetings");


if (Meteor.isClient) {
  // This code only runs on the client

  Template.addmeeting.events({
    "submit .new-issue": function (event) {
      event.preventDefault();
      var text = event.target.text.value;

      Meetings.insert({
        meetingname: text,
        createdAt: new Date()
      });
      event.target.text.value = "";
    }
  });

  Template.splash.events({
    "click .delete": function () {
      Meetings.remove(this._id);
    }
  });

    Template.meeting.helpers({
      meetings: function () {
        return Meetings.find({},{sort: {createdAt: -1}});
      },
      createdAt: function() {
        return moment(this.createdAt).format("ddd, MMM Do YYYY");
      }
    });

  Template.retro.helpers({
    goodissues: function () {
      var currentMeeting = this._id;
      return Issues.find({type: "good", meetingID: currentMeeting}, {sort: {createdAt: 1}});
    },
    okissues: function () {
      var currentMeeting = this._id;
      return Issues.find({type: "ok", meetingID: currentMeeting}, {sort: {createdAt: 1}});
    },
    badissues: function () {
      var currentMeeting = this._id;
      return Issues.find({type: "bad", meetingID: currentMeeting}, {sort: {createdAt: 1}});
    },
    actionitems: function () {
      var currentMeeting = this._id;
      return ActionItems.find({meetingID: currentMeeting}, {sort: {createdAt: 1}});
    },
    createdAt: function() {
      return moment(this.createdAt).format("ddd, MMM Do YYYY");
    }
  });

  Template.retro.events({
    "submit .good .new-issue": function (event) {
      var text = event.target.text.value;
      var currentMeeting = this._id;
      event.preventDefault();

      Issues.insert({
        type:"good",
        text: text,
        createdAt: new Date(),         // current time
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().profile.name,   // username of logged in user
        points: 0,
        meetingID: currentMeeting
      });

      // Clear form
      event.target.text.value = "";

    },

    "submit .ok .new-issue": function (event) {
      var text = event.target.text.value;
      var currentMeeting = this._id;
      event.preventDefault();

      Issues.insert({
        type:"ok",
        text: text,
        createdAt: new Date(),         // current time
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().profile.name,    // username of logged in user
        points: 0,
        meetingID: currentMeeting
      });

      // Clear form
      event.target.text.value = "";
    },

    "submit .bad .new-issue": function (event) {
      var text = event.target.text.value;
      var currentMeeting = this._id;
      event.preventDefault();

      Issues.insert({
        type:"bad",
        text: text,
        createdAt: new Date(),         // current time
        owner: Meteor.userId(),           // _id of logged in user
        username: Meteor.user().profile.name,   // username of logged in user
        points: 0,
        meetingID: currentMeeting
      });

      // Clear form
      event.target.text.value = "";
    },

    "submit .action-item": function (event) {
      var text = event.target.text.value;
      var currentMeeting = this._id;
      event.preventDefault();

      ActionItems.insert({
        text: text,
        createdAt: new Date(),         // current time
        meetingID: currentMeeting
      });

      // Clear form
      event.target.text.value = "";
    }
  });

  Template.goodissue.events({
    "click .delete": function () {
      Issues.remove(this._id);
    },

  "click .up, click .down": function(event) {
    return Issues.update(this._id, {
      $inc: {
        points: $(event.target).hasClass('up') ? 1 : -1
      }
    });
  }
  });

  Template.okissue.events({
    "click .delete": function () {
      Issues.remove(this._id);
    },

  "click .up, click .down": function(event) {
    return Issues.update(this._id, {
      $inc: {
        points: $(event.target).hasClass('up') ? 1 : -1
      }
    });
  }
  });

  Template.badissue.events({
    "click .delete": function () {
      Issues.remove(this._id);
    },

  "click .up, click .down": function(event) {
    return Issues.update(this._id, {
      $inc: {
        points: $(event.target).hasClass('up') ? 1 : -1
      }
    });
  }
  });

  Template.actionitem.events({
    "click .delete": function () {
      ActionItems.remove(this._id);
    }
  });

}
