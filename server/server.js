Meteor.startup(function() {
	// read environment variables from Meteor.settings
	if(Meteor.settings && Meteor.settings.env && _.isObject(Meteor.settings.env)) {
		for(var variableName in Meteor.settings.env) {
			process.env[variableName] = Meteor.settings.env[variableName];
		}
	}

	
if(Phonetypes.find().count() === 0){
  console.log('empty - adding dummies');
var types = ['work', 'private', 'mobile'];
    _.each(types, function (type){
      var typeid = Phonetypes.insert({type: type});console.log('Added ', type, typeid);
	});
}
});

Meteor.methods({
	"sendMail": function(options) {
		this.unblock();

		Email.send(options);
	}
});