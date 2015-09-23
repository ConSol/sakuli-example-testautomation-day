/*
 * Sakuli - Testing and Monitoring-Tool for Websites and common UIs.
 *
 * Copyright 2013 - 2015 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

_dynamicInclude($includeFolder);
_dynamicInclude("../../common/showroom_common.js");
_dynamicInclude("../../common/login_credentials.js")


var testCase = new TestCase(60, 70);

var $username = "sakuli";
var $comment = "Auch Sakuli ist begeistert und will jetzt Kaffee!";

try {
    var browser = new Application(BROWSER_NAME);
    browser.focus();
    maximize(browser, "browser_maximize");

    load();
	testCase.endOfStep("Load");
	
    login(3);
	testCase.endOfStep("Login");
	
    search("Sa", "528", 3);
	testCase.endOfStep("Search Ticket 528");
	
	
	addComment($comment);
	testCase.endOfStep("Add Comment");
	
    checkComment($comment);
	testCase.endOfStep("Check Comment");
	
    env.sleep(3);

} catch (e) {
    testCase.handleException(e);
}
finally {
    end();
}

 
function addComment($comment){
	
	openComment();
    writeComment($comment);
	submitComment();	
}

function openComment() {

    _highlight(_link("Kommentar"));
    _click(_link("Kommentar"));
}

function submitComment() {

    _highlight(_button("Hinzufügen"));
    _click(_button("Hinzufügen"));
}

function checkComment($comment) {
    _highlight(_div("submain historygroup"));
    env.sleep(1);
    $testString = _getText(_div("/richContent_.*/", _div("submain historygroup")));
    _highlight(_div("/richContent_.*/", _div("submain historygroup")));

    var isIdentical = false;
    if ($testString == $comment) {
        isIdentical = true;

    } else {
        throw "The comment function did not perform correctly!";
    }
}
