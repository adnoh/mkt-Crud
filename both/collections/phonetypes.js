this.Phonetypes = new Mongo.Collection("phonetypes");

this.Phonetypes.userCanInsert = function(userId, doc) {
	return true;
};

this.Phonetypes.userCanUpdate = function(userId, doc) {
	return true;
};

this.Phonetypes.userCanRemove = function(userId, doc) {
	return true;
};
