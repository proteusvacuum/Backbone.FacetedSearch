Backbone.FacetedSearch
======================

A Backbone.JS plugin for making your collections easily filterable by any key:value pair.

Basic Usage
-----------

1. Include Backbone.FacetedSearch.js in your project, after Backbone.js
2. Make your collection facet-searchable:

  `class your_collection extends Backbone.FacetedSearchCollection`

3. When you populate your collection, call
  `your_collection.initializeFilters()`

4. Filter Something!

  Filters are just key: value pairs from your model's attributes hash.

  `{attribute_name : "Attribute Value"}`

  `your_collection.addFilter({facet: value})`

  When you do addFilter() your collection will trigger a "change" event
  which means that your view will automatically re-render.

  If you don't want that to happen, you can call
  `your_collection.initializeFilters({silent:true})`
  in that case, there will be a "filter" event that is triggered on the collection.
  which you can then listen to

5. Removing filters is as easy as you'd expect:
    ```
    your_collection.removeFilter({whichever: "you want"})
    your_collection.resetFilters()

    ```  

Advanced Usage
--------------

you can pass options when you initializeFilters()
when you do addFilter() your collection will trigger a "change" event
which means that your view will automatically re-render
if you don't want that to happen
your_collection.initializeFilters({silent:true})
in that case, there will be a "filter" event that is triggered on the collection.
which you can then listen to to do other stuff

there is also removeFilter()
which does what you think it does


and resetFilters()
and resetAndAddFilter()

after calling initializeFilters(), you will see a new wholeCollection object in your collection
which, as you guessed, is your wholeCollection


getUpdatedFilterLists(skippedFilter)

if, when making your collection you pass in an array of facets
filterFacets: ["artist_name", "album_name"]
then, if you call getUpdatedFilterLists("artist_name") when you addFilter on artist name
it will return a list of possible entries for all the other facets
if you call getFilterLists() it gives you a list of everything
you can use this to populate your possible lists of things
