Meteor.publish("phonetypes_all", function() {
	return Phonetypes.find({}, {});
});

