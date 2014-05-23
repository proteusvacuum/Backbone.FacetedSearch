Backbone.FacetedSearch
======================

A Backbone.JS plugin for making your collections easily filterable by any key:value pair.

Usage
-----------

1. Include Backbone.FacetedSearch.js in your project, after Backbone.js
2. Make your collection facet-searchable:
  ```
  class your_collection = Backbone.FacetedSearchCollection.extend({})
  ```

3. When you populate your collection, call
  `your_collection.initializeFilters()`

  After calling initializeFilters(), you will see a new wholeCollection object in your collection
  which, as you guessed, is your whole collection.

4. Filter Something!

  Filters are just key: value pairs from your model's attributes hash.
  ```
  your_collection.addFilter({facet: value})
  ```
  or 
  ```
  your_collection.resetAndAddFilter({facet: value})
  ```

  When you do addFilter() your collection will trigger a "change" event
  which means that your view will automatically re-render.

  If you don't want that to happen, you can call
  `your_collection.initializeFilters({silent:true})`
  in that case, there will be a "filter" event that is triggered on the collection.

5. Removing filters is as easy as you'd expect:
    ```
    your_collection.removeFilter({whichever: "you want"});
    your_collection.resetFilters();
    ```  
6. For a list of potential values, separated by facet:

  ```
    your_collection.getFilterLists()
  ```
  When you add or remove a filter on a particular facet, you can call:
  ```
    your_collection.getUpdatedFilterLists(facet)
  ```
  which will return a list of all the remaining possible filters for all the other facets.

License
-------
The MIT License (MIT)

Copyright (c) 2014 Farid Rener

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
