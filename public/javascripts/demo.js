(function() {
  
  var getEl = function(id){return document.getElementById(id)},
      widget=null;
  
  getEl("template").value = getEl("searchResults").innerHTML;
  getEl("changeTemplateButton").addEventListener('click',changeTemplate, false);
  
  function changeTemplate() {
    getEl("searchResults").innerHTML = getEl("template").value;
    var currentSearchResult = widget.getCurrentResultsObj();
    initSearchWidget();
    widget.render(currentSearchResult);
  };
  
  function initSearchWidget() {
    widget = new LISearchWidget({
      formId: "li-search-widget",
      inputFieldId : "li-keyword-input",
      inputButtonId : "li-search-widget-submit",
      typeahead : true,
      resultsContainerId: "searchResults",
      templateId: "resultTemplate",
      templateFieldMarker: "li-field"
    });
  }
  
  initSearchWidget();
  
  var drop = getEl("drop");
  drop.addEventListener('dragover', cancel, false);
  drop.addEventListener('dragenter', cancel, false);

  drop.addEventListener('drop', function (event) {
    // stops the browser from redirecting off to the text.
    if (event.preventDefault) {
      event.preventDefault();
    }

    this.innerHTML += '<p>' + (event.dataTransfer.getData('Text')) + '</p>';
    return false;
  }, false);

  function cancel(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    return false;
  }
  
})();