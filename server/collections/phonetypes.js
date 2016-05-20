Phonetypes.allow({
	insert: function (userId, doc) {
		return Phonetypes.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Phonetypes.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Phonetypes.userCanRemove(userId, doc);
	}
});

Phonetypes.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Phonetypes.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Phonetypes.before.remove(function(userId, doc) {
	
});

Phonetypes.after.insert(function(userId, doc) {
	
});

Phonetypes.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Phonetypes.after.remove(function(userId, doc) {
	
});
