// Backbone.FacetedSearch
//
// Copyright (C)2014 Farid Rener
// Distributed Under MIT License
//
// Documentation and Full License Available at:
// http://github.com/proteusvacuum/Backbone.FacetedSearch

Backbone.FacetedSearchCollection = Backbone.Collection.extend({

	options : {},

	constructor: function() {
		if (!this.filterFacets) {

			this.filterFacets = [];

		} else {

			this.filterFacets = this.filterFacets;
		}

		this.filters = [];

		this.filterLists = {};

		if (!this.wholeCollection) {

			this.wholeCollection = {};
		}
		Backbone.Collection.apply(this, arguments);
	},

	initializeFilters: function(options) {
		var self = this;

		if (options){
			this.options = options;
		}
		_.defaults(this.options, {silent:false});

		this.wholeCollection = this.clone();

		if (this.filterFacets.length !== 0) {
			this.initializeFilterLists();
		}

		this.on("change", function() {
			self.wholeCollection.add(this.models, { merge: true });
		});
	},

	addFilter: function(query) {
		this.filters.push(query);
		var returnedModels = this.filterAll();
		this.trigger("filter");
		return returnedModels;
	},

	addFilters: function(filterArray) {
		self = this;
		_.each(filterArray, function(filter) {
			self.filters.push(filter);
		});
		var returnedModels = this.filterAll();
		this.trigger("filter");
		return returnedModels;
	},

	removeFilter: function(query) {
		this.filters = _.reject(this.filters, function(filter) {
			return _.isEqual(filter, query);
		});
		var returnedModels = this.filterAll();
		this.trigger("filter");
		return returnedModels;
	},

	overWriteFilter: function(query){
		this.filters = _.reject(this.filters, function(filter) {
			return Object.keys(filter)[0] == Object.keys(query)[0];
		});
		this.filters.push(query);
		var returnedModels = this.filterAll();
		this.trigger("filter");
		return returnedModels;
	},

	resetAndAddFilter: function(query) {
		this.filters = [];
		this.filters.push(query);
		var returnedModels = this.filterAll();
		this.trigger("filter");
		return returnedModels;
	},

	resetFilters: function() {
		var returnedModels;
		if (this.filters.length > 0){
			this.filters = [];
			returnedModels = this.reset(this.wholeCollection.models, {silent: this.options.silent});
			this.trigger("filter");
		}
		else{
			returnedModels = this.models;
		}
		return returnedModels;
	},

	filterAll: function() {
		var grouped;
		grouped = _.groupBy(this.filters, function(filter) {
			return Object.keys(filter);
		});
		return this.reset(this.filterGrouped(grouped), {silent: this.options.silent});
	},

	skipFilter: function(facet) {
		var filtered, grouped;
		grouped = _.groupBy(this.filters, function(filter) {
			return Object.keys(filter);
		});
		grouped = _.omit(grouped, facet);
		filtered = this.filterGrouped(grouped);
		return new Backbone.Collection(filtered);
	},

	filterGrouped: function(grouped) {
		var output = this.wholeCollection;
		_.each(grouped, function(filters) {
			var filtered;
			if (filters.length > 1) {
				filtered = [];
				_.each(filters, function(filter) {
					var key = Object.keys(filter);
					filtered.push(output.filter(function(model) {
						if ({}.toString.call(model.get(key)) === '[object Array]') {
							if (_.indexOf(model.get(key), filter[key]) >= 0){
								return true;
							} else {
								return false;
							}
						} else {
							return filter[key] === model.get(key);
						}
					}));
				});
				output = new Backbone.Collection(_.flatten(filtered));
			} else {
				_.each(filters, function(filter) {
					var key;
					key = Object.keys(filter);
					output = new Backbone.Collection(output.filter(function(model) {
						if ({}.toString.call(model.get(key)) === '[object Array]') {
							if (_.indexOf(model.get(key), filter[key]) >= 0){
								return true;
							} else {
								return false;
							}
						} else {
							return filter[key] === model.get(key);
						}
					}));
				});
			}
		});
		return output.models;
	},

	initializeFilterLists: function() {
		var self = this;

		_.each(this.filterFacets, function(facet) {

				self.filterLists[facet] = self.makeFilterList(facet, self);

		});

		return this.filterLists;
	},

	getUpdatedFilterLists: function(skippedFacet) {
		var self = this;
		var toUpdate = _.without(this.filterFacets, skippedFacet);

		_.each(toUpdate, function(facet) {
			self.filterLists[facet] = self.makeFilterList(facet, self.skipFilter(facet));
		});

		return this.filterLists;
	},

	getFilterLists: function() {
		return this.filterLists;
	},

	makeFilterList: function(facet, collection) {
		return (_.uniq(_.flatten(collection.pluck(facet)))).sort();
	}

});
