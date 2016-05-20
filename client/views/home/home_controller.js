this.HomeController = RouteController.extend({
	template: "Home",
	

	yieldTemplates: {
		/*YIELD_TEMPLATES*/
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("loading"); }
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("phonetypes_all"),
			Meteor.subscribe("phonebooks_all"),
			Meteor.subscribe("phonebooks_one")
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		var data = {
			params: this.params || {},
			phonetypes_all: Phonetypes.find({}, {}),
			phonebooks_all: Phonebooks.find({}, {}),
			phonebooks_one: Phonebooks.findOne({}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});