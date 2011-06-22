(function() {
  
  var getEl = function(id){return document.getElementById(id)};
  
  window.LISearchWidget = function (config) {
    config.inputFieldId = config.inputFieldId || '';
    config.inputButtonId = config.inputButtonId || '';
    config.typeahead = (config.typeahead === true);
    
    var _resultTemplateNode = document.getElementById(config.templateId),
        _resultsContainerEl = document.getElementById(config.resultsContainerId),
        _searchQueue = null;
    _resultsContainerEl.removeChild(_resultTemplateNode); // remove the template from the document
    _resultTemplateNode.setAttribute('style','');
    
    // map for determining how to set html element with its appropriate data, default is innerHTML
    var typeMap = {
      'img' : {
        attributeToSet : 'src'
      },
      'a' : {
        attributeToSet : 'href'
      }
    };
    // Callback for handling search results
    var _currentSearchResults = null;
    function handlePeopleSearch(peopleSearchResult) {
      if(!peopleSearchResult) {
        return;
      }
      _currentSearchResults = peopleSearchResult;
      _resultsContainerEl.innerHTML = '';
      var members = peopleSearchResult.people.values;
      if(members) { 
        members.forEach(function(member) {
          var newNode = _resultTemplateNode.cloneNode(true),
              fields = newNode.getElementsByClassName(config.templateFieldMarker),
              nodesToRemove = [];
          for(var i=0,len=fields.length;i<len;i++) {
            var node = fields[i],
                nodeTagName = node.tagName.toLowerCase(),
                data = member[node.getAttribute('data-li')];
            if(!data) {
              nodesToRemove.push(node);
              continue;
            }
            if(typeMap[nodeTagName] && typeMap[nodeTagName].attributeToSet) {
              node.setAttribute(typeMap[nodeTagName].attributeToSet, data);
            } else {
              fields[i].innerHTML = data;
            }
          }
          nodesToRemove.forEach(function(node){node.parentNode.removeChild(node);});
          
          // Add new node to container element
          _resultsContainerEl.appendChild(newNode);
          // add DD behavior
          newNode.setAttribute('draggable', 'true');
          newNode.addEventListener('dragstart', function (e) {
            e.dataTransfer.effectAllowed = 'copy'; // only dropEffect='copy' will be dropable
            e.dataTransfer.setData('Text', member.id); // required otherwise doesn't work
          }, false);
        });
      }      
      if(config.typeahead && _searchQueue) {
        _searchQueue();
        _searchQueue=null;
      }
    };  // end handlePeopleSearch
    
    /***
    * Set up events
    ***/
    getEl(config.formId).addEventListener('submit',searchEvtHandler, false); // TODO: make cross browser compatible
    function searchEvtHandler(evt) {
      evt.preventDefault(); // TODO: make cross browser compatible
      search(getEl(config.inputFieldId).value);
    };
    
    if(config.typeahead) {
      getEl(config.inputFieldId).addEventListener('keyup', function(evt) {
        if(!_searchQueue) {
          search(getEl(config.inputFieldId).value);
        } else {
          _searchQueue = function() {search(getEl(config.inputFieldId).value);};
        }
      }, false);
    }
    
    /***
    * Scan markup and set search fields
    ****/
    var fields = _resultTemplateNode.getElementsByClassName(config.templateFieldMarker);
    var fieldsToFetch = [];
    for(var i=0,len=fields.length;i<len;i++) {
      fieldsToFetch[i] = fields[i].getAttribute('data-li');
    }
    function search(input) {
        IN.API.PeopleSearch()
          .fields(fieldsToFetch)
          .params({"keywords": input})
          .result(handlePeopleSearch)
          .error(handlePeopleSearchError);
    };
    
    function handlePeopleSearchError() {
      //TODO
    };
    
    return {
      getCurrentResultsObj : function() {
        return _currentSearchResults;
      },
      render: function(resultObj) {
        handlePeopleSearch(resultObj);
      }
    }
  }
  
  
})();