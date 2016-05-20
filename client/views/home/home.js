var pageSession = new ReactiveDict();

Template.Home.rendered = function() {
	
};

Template.Home.events({
	
});

Template.Home.helpers({
	
});

var HomeDvPhonebookItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("HomeDvPhonebookSearchString");
	var sortBy = pageSession.get("HomeDvPhonebookSortBy");
	var sortAscending = pageSession.get("HomeDvPhonebookSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "phone"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var HomeDvPhonebookExport = function(cursor, fileType) {
	var data = HomeDvPhonebookItems(cursor);
	var exportFields = [];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.HomeDvPhonebook.rendered = function() {
	pageSession.set("HomeDvPhonebookStyle", "table");
	
};

Template.HomeDvPhonebook.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("HomeDvPhonebookSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("HomeDvPhonebookSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("HomeDvPhonebookSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		/**/
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		HomeDvPhonebookExport(this.phonebooks_all, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		HomeDvPhonebookExport(this.phonebooks_all, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		HomeDvPhonebookExport(this.phonebooks_all, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		HomeDvPhonebookExport(this.phonebooks_all, "json");
	}

	
});

Template.HomeDvPhonebook.helpers({

	

	"isEmpty": function() {
		return !this.phonebooks_all || this.phonebooks_all.count() == 0;
	},
	"isNotEmpty": function() {
		return this.phonebooks_all && this.phonebooks_all.count() > 0;
	},
	"isNotFound": function() {
		return this.phonebooks_all && pageSession.get("HomeDvPhonebookSearchString") && HomeDvPhonebookItems(this.phonebooks_all).length == 0;
	},
	"searchString": function() {
		return pageSession.get("HomeDvPhonebookSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("HomeDvPhonebookStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("HomeDvPhonebookStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("HomeDvPhonebookStyle") == "gallery";
	}

	
});


Template.HomeDvPhonebookTable.rendered = function() {
	
};

Template.HomeDvPhonebookTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("HomeDvPhonebookSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("HomeDvPhonebookSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("HomeDvPhonebookSortAscending") || false;
			pageSession.set("HomeDvPhonebookSortAscending", !sortAscending);
		} else {
			pageSession.set("HomeDvPhonebookSortAscending", true);
		}
	}
});

Template.HomeDvPhonebookTable.helpers({
	"tableItems": function() {
		return HomeDvPhonebookItems(this.phonebooks_all);
	}
});


Template.HomeDvPhonebookTableItems.rendered = function() {
	
};

Template.HomeDvPhonebookTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Phonebooks.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Phonebooks.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		/**/
		return false;
	}
});

Template.HomeDvPhonebookTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }
	

	
});

Template.HomeFormInsert.rendered = function() {
	pageSession.set("phoneCrudItems", []);


	pageSession.set("homeFormInsertInfoMessage", "");
	pageSession.set("homeFormInsertErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.HomeFormInsert.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("homeFormInsertInfoMessage", "");
		pageSession.set("homeFormInsertErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var homeFormInsertMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(homeFormInsertMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("homeFormInsertInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("homeFormInsertErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				values.phone = pageSession.get("phoneCrudItems"); newId = Phonebooks.insert(values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}, 

	'click .field-phone .crud-table-row .delete-icon': function(e, t) { e.preventDefault(); var self = this; bootbox.dialog({ message: 'Delete? Are you sure?', title: 'Delete', animate: false, buttons: { success: { label: 'Yes', className: 'btn-success', callback: function() { var items = pageSession.get('phoneCrudItems'); var index = -1; _.find(items, function(item, i) { if(item._id == self._id) { index = i; return true; }; }); if(index >= 0) items.splice(index, 1); pageSession.set('phoneCrudItems', items); } }, danger: { label: 'No', className: 'btn-default' } } }); return false; }
});

Template.HomeFormInsert.helpers({
	"infoMessage": function() {
		return pageSession.get("homeFormInsertInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("homeFormInsertErrorMessage");
	}, 
		"phoneCrudItems": function() {
		return pageSession.get("phoneCrudItems");
	}
});


Template.HomeFieldPhoneInsertFormContainerFieldPhoneInsertForm.rendered = function() {
	

	pageSession.set("homeFieldPhoneInsertFormContainerFieldPhoneInsertFormInfoMessage", "");
	pageSession.set("homeFieldPhoneInsertFormContainerFieldPhoneInsertFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.HomeFieldPhoneInsertFormContainerFieldPhoneInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("homeFieldPhoneInsertFormContainerFieldPhoneInsertFormInfoMessage", "");
		pageSession.set("homeFieldPhoneInsertFormContainerFieldPhoneInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var homeFieldPhoneInsertFormContainerFieldPhoneInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(homeFieldPhoneInsertFormContainerFieldPhoneInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("homeFieldPhoneInsertFormContainerFieldPhoneInsertFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("homeFieldPhoneInsertFormContainerFieldPhoneInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				var data = pageSession.get("phoneCrudItems") || []; values._id = Random.id(); data.push(values); pageSession.set("phoneCrudItems", data); $("#field-phone-insert-form").modal("hide"); e.currentTarget.reset();
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		$("#field-phone-insert-form").modal("hide"); t.find("form").reset();

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.HomeFieldPhoneInsertFormContainerFieldPhoneInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("homeFieldPhoneInsertFormContainerFieldPhoneInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("homeFieldPhoneInsertFormContainerFieldPhoneInsertFormErrorMessage");
	}
	
});
