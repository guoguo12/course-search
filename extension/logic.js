/****************************************************************************
 * Main extension logic.
 * Requires data.js.
 ****************************************************************************/

// Do the thing.
$(main());

// URL prefixes (to be updated).
var prefixes = {'sb': 'https://schedulebuilder.berkeley.edu/explore/courses/SP/2015/',
								'bt': 'http://www.berkeleytime.com/catalog/',
								'osoc': 'http://osoc.berkeley.edu/OSOC/osoc?p_term=SP&',
								'bltn': 'http://bulletin.berkeley.edu/search/?P=',
								'nc': 'https://ninjacourses.com/explore/1/course/'};

// Proxy page URL.
var url = 'http://www.ocf.berkeley.edu/~allenguo/coursesearch/proxy.php?_type=json&courseUID='

// Fade in/out time in milliseconds.
var transitionTime = 300;

// Executes when toolbar button is clicked.
function main() {
	console.log('Loaded');
	// Attach submit listener to search box
	$('#searchSubmit').submit(function(event) {
		// Prevent actual submission (causes popup to reload)
		event.preventDefault();
		// Get input and check for empty submission
		var input = $('#searchInput').val();
		if ($.trim(input).length == 0) {
			resetSearchScreen('<span class="orange">Please enter one or more search terms.</span>');
			return;
		}
		// Transition to loading screen
		$('#searchInput').prop('disabled', 'true');
		$('#searchStatus').html('<i class="fa fa-spinner fa-spin"></i> Please wait...')
		// Execute search
		var result = searchCourseData(input);
		if (result == null) {
			resetSearchScreen('<span class="orange">No results found.</span>');
		} else if (typeof result === 'string') {
			requestCourseInfo(result, function(response) {
				var course = response['CanonicalCourse'][0];
				populateCourseScreen(course);
				$('#searchScreen').hide(transitionTime);
				$('#courseScreen').show(transitionTime);
			}, function(jqxhr, textStatus, error) {
				// Network error
				resetSearchScreen('<span class="red">Error: Network request failed.</span>');
				console.error(textStatus + ', ' + error);
			});
		} else if (Array.isArray(result) && result.length > 0) {
			populateDisambigScreen(result);
			$('#searchScreen').hide(transitionTime);
			$('#disambigScreen').show(transitionTime);
		} else {
			console.error(result);
			resetSearchScreen('<span class="red">An error occurred.</span>');
		}
	});
	console.log(window.getSelection().toString());
}

// Requests course info from UC Berkeley database (via proxy).
function requestCourseInfo(courseId, success, fail) {
	$.getJSON(url + courseId, success).fail(fail);
}

// Injects course information into course screen.
function populateCourseScreen(course) {
	var code = course.courseUID.split('.')[0];
	var courseNumber = course.courseUID.split('.')[1];
	var courseName = course.courseUID.replace('.', ' ');
	var units = Math.max(course.upperUnits, course.lowerUnits);
	$('#courseHeader').html(courseName + ' <span class="h1Detail">(' + units + ' units)</span>');
	$('#courseTitle').html(course.courseTitle);
	$('#courseDescription').html(course.courseDescription);
	addLink('sb', prefixes.sb + getScheduleBuilderId(code, courseNumber));
	addLink('bt', prefixes.bt + course.courseUID.replace('.', '/'));
	addLink('osoc', prefixes.osoc + 'p_course=' + courseNumber + '&p_dept=' + code);
	addLink('bltn', prefixes.bltn + course.courseUID.replace('.', '+'));
	addLink('nc', prefixes.nc + course.courseUID.replace('.', '/'));
}

// Injects information into disambiguation screen.
function populateDisambigScreen(courses) {
	var container = $('#disambigCourses').html('');
	var titles = getTitles(courses);
	for (var i = 0; i < courses.length; i++) {
		var courseName = courses[i].replace('.', ' ');
		var title = titles[i];
		var element = $('<div class="courseResult"><b>' + courseName + '</b> &ndash; ' + title +'</div>');
		element.attr('data-id', courseName);
		element.click(function() {
			$('#disambigScreen').hide(transitionTime);
			$('#searchScreen').show(transitionTime);			
			resetSearchScreenAndSearch('', $(this).attr('data-id'));	
		});
		container.append(element);
	}
	var resultsText = courses.length > 1 ? ' results ' : ' result ';
	$('#disambigHeader').html(courses.length + resultsText + 'found.')
}

// Creates link to external page that opens in new tab (in background).
function addLink(id, url) {
	$('#' + id).click(function() {
		chrome.tabs.create({url: url, active: false});
	});
}

// Resets search screen to original state and displays given status message.
function resetSearchScreen(status) {
	resetSearchScreenAndSearch(status, '');
}

// Resets search screen to original state and displays given status message.
// Inputs the given search in the search box and triggers submission.
function resetSearchScreenAndSearch(status, search) {
	$('#searchInput').removeAttr('disabled');
	if (status) {
		$('#searchStatus').fadeOut(transitionTime, function() {
			$('#searchStatus').html(status);
			$('#searchStatus').fadeIn(transitionTime);
		});
	} else {
		$('#searchInput').val('');
		$('#searchStatus').html('Press Enter to submit.');
	}
	if (search) {
		$('#searchInput').val(search);
		$('#searchSubmit').submit();
	}
}
