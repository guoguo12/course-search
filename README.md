course-search
=============

**Berkeley Course Search** is a Chrome extension for browsing the UC Berkeley course catalog. Install the latest version at the [Chrome Web Store](https://chrome.google.com/webstore/detail/berkeley-course-search/ppifbfeldmmfgeobebpkgllmapipmabd).

Project structure
-----------------
* `data/` &ndash; scripts used to compile information about courses
* `extension/` &ndash; Chrome extension
* `server/` &ndash; PHP proxy responsible from sending requests to the [Berkeley Courses API](api.berkeley.edu) with this app's API credentials

Credits
-------
This project was built using [jQuery 1.11.1](https://jquery.com/) and [Font Awesome](https://fortawesome.github.io/Font-Awesome/). The font used is [Open Sans](http://www.google.com/fonts/specimen/Open+Sans).

This project also uses a single line of JavaScript code from [ScheduleBuilder](http://schedulebuilder.berkeley.edu) to accomplish [query expansion](https://en.wikipedia.org/wiki/Query_expansion) (e.g. converting `CS` into `COMPSCI`, the official department code). This line is in [data/generate-departments.js](https://github.com/guoguo12/course-search/blob/master/data/generate-departments.js#L7), and is clearly marked.
