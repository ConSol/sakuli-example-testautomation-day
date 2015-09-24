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

var $username = "bearbeiter_link";

try {
    var browser = new Application(BROWSER_NAME);
    browser.focus();
    maximize(browser, "browser_maximize");

    load();
	testCase.endOfStep("Load");
	
    login(3);
	testCase.endOfStep("Login");
	
	checkLink("Hauptseite");
	checkLink("Neuer Vorgang");
	checkLink("Neuer Kontakt | Produkt");
	
	checkItem("Alle Kundengruppen");
	checkItem("Endkunden");
	checkItem("Firmenkunden");
	checkItem("Mitarbeiter");
	checkItem("Produkte");
	checkItem("Vertriebspartner");
	env.sleep(1);
	
} catch (e) {
    testCase.handleException(e);
}
finally {
    end();
}

function checkLink($link){
	
	_highlight(_link($link));
	env.sleep(1);
	_click(_link($link));
	env.sleep(1);
}


function checkItem($item){
	
	_click(_link("/.*choice.html#/"));
	_highlight(_listItem($item));
	env.sleep(1);
	_click(_listItem($item));
	env.sleep(1);
	_highlight(_heading4(0));
	env.sleep(1);
	
}