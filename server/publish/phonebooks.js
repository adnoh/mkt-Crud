Meteor.publish("phonebooks_all", function() {
	return Phonebooks.find({}, {});
});

Meteor.publish("phonebooks_one", function() {
	return Phonebooks.find({}, {});
});

