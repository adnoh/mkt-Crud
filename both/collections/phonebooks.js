this.Phonebooks = new Mongo.Collection("phonebooks");

this.Phonebooks.userCanInsert = function(userId, doc) {
	return true;
};

this.Phonebooks.userCanUpdate = function(userId, doc) {
	return true;
};

this.Phonebooks.userCanRemove = function(userId, doc) {
	return true;
};
