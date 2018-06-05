/*eslint-disable */
define(["knockout", "ko-draggable", "ko-sortable", "mage/translate", "uiEvents", "underscore", "Magento_PageBuilder/js/config", "Magento_PageBuilder/js/panel/group", "Magento_PageBuilder/js/panel/group/content-type"], function (_knockout, _koDraggable, _koSortable, _translate, _uiEvents, _underscore, _config, _group, _contentType) {
  /**
   * Copyright © Magento, Inc. All rights reserved.
   * See COPYING.txt for license details.
   */
  var Panel =
  /*#__PURE__*/
  function () {
    function Panel(parent) {
      this.groups = _knockout.observableArray([]);
      this.searchResults = _knockout.observableArray([]);
      this.isCollapsed = _knockout.observable(false);
      this.isVisible = _knockout.observable(false);
      this.searching = _knockout.observable(false);
      this.searchValue = _knockout.observable("");
      this.searchPlaceholder = (0, _translate)("Find items");
      this.searchNoResult = (0, _translate)("Nothing found");
      this.fullScreenTitle = (0, _translate)("Full Screen");
      this.searchTitle = (0, _translate)("Clear Search");
      this.parent = void 0;
      this.id = void 0;
      this.template = "Magento_PageBuilder/panel";
      this.parent = parent;
      this.id = this.parent.id;
      this.initListeners();
    }
    /**
     * Init listeners
     */


    var _proto = Panel.prototype;

    _proto.initListeners = function initListeners() {
      var _this = this;

      _uiEvents.on("stage:ready:" + this.id, function () {
        _this.populateContentTypes();

        _this.isVisible(true);
      });
    };
    /**
     * Return the template string
     *
     * @returns {string}
     */


    _proto.getTemplate = function getTemplate() {
      return this.template;
    };
    /**
     * Conduct a search on the available content types,
     * and find matches for beginning of words.
     *
     * @param self
     * @param event
     */


    _proto.search = function search(self, event) {
      this.searchValue(event.currentTarget.value.toLowerCase());

      if (this.searchValue() === "") {
        this.searching(false);
      } else {
        this.searching(true);
        this.searchResults(_underscore.map(_underscore.filter(_config.getConfig("content_types"), function (contentType) {
          var regEx = new RegExp("\\b" + self.searchValue(), "gi");
          var matches = !!contentType.label.toLowerCase().match(regEx);
          return matches && contentType.is_visible === true;
        }), function (contentType, identifier) {
          // Create a new instance of GroupContentType for each result
          return new _contentType.ContentType(identifier, contentType);
        }));
      }
    };
    /**
     * Traverse up to the WYSIWYG component and set as full screen
     */


    _proto.fullScreen = function fullScreen() {
      _uiEvents.trigger("pagebuilder:toggleFullScreen:" + this.parent.id);
    };
    /**
     * Collapse the panel into the side of the UI
     */


    _proto.collapse = function collapse() {
      this.isCollapsed(!this.isCollapsed());
    };
    /**
     * Clear Search Results
     */


    _proto.clearSearch = function clearSearch() {
      this.searchValue("");
      this.searching(false);
    };
    /**
     * Populate the panel with the content types
     */


    _proto.populateContentTypes = function populateContentTypes() {
      var _this2 = this;

      var groups = _config.getConfig("groups");

      var contentTypes = _config.getConfig("content_types"); // Verify the configuration contains the required information


      if (groups && contentTypes) {
        // Iterate through the groups creating new instances with their associated content types
        _underscore.each(groups, function (group, id) {
          // Push the group instance into the observable array to update the UI
          _this2.groups.push(new _group.Group(id, group, _underscore.map(_underscore.where(contentTypes, {
            group: id,
            is_visible: true
          }),
          /* Retrieve content types with group id */
          function (contentType, identifier) {
            var groupContentType = new _contentType.ContentType(identifier, contentType);
            return groupContentType;
          })));
        }); // Display the panel


        this.isVisible(true); // Open first group

        var hasGroups = 0 in this.groups();

        if (hasGroups) {
          this.groups()[0].active(true);
        }
      } else {
        console.warn("Configuration is not properly initialized, please check the Ajax response.");
      }
    };

    return Panel;
  }();

  return Panel;
});
//# sourceMappingURL=panel.js.map
