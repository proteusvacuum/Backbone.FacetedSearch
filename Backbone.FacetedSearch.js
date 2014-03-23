// Backbone.FacetedSearch
//
// Copyright (C)2014 Farid Rener
// Distributed Under MIT License
//
// Documentation and Full License Available at:
// http://github.com/proteusvacuum/Backbone.FacetedSearch

Backbone.FacetedSearchCollection = Backbone.Collection.extend({
	
	filterFacets: [],

	filters: [],

	filterLists: {},

	wholeCollection: {},

	initializeFilters: function() {
		var self = this;
		
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
		return this.filterAll();
	},

	removeFilter: function(query) {
		this.filters = _.reject(this.filters, function(filter) {
			return _.isEqual(filter, query);
		});
		return this.filterAll();
	},

	resetFilters: function() {
		this.filters = [];
		return this.filterAll();
	},

	filterAll: function() {
		var grouped;
		grouped = _.groupBy(this.filters, function(filter) {
			return Object.keys(filter);
		});
		return this.reset(this.filterGrouped(grouped));
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