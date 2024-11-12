/**
 * Logistic Fleet
 */
('use strict');

(function () {
  //Selecting Sidebar Accordion for perfect scroll
  var sidebarAccordionBody = $('.logistics-fleet-sidebar-body');

  //Perfect Scrollbar for Sidebar Accordion
  if (sidebarAccordionBody.length) {
    new PerfectScrollbar(sidebarAccordionBody[0], {
      wheelPropagation: false,
      suppressScrollX: true
    });
  }
})();
