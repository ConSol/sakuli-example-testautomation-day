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
_dynamicInclude("../../common/login_credentials.js");

var testCase = new TestCase(60, 70);

var $user_01 = "bearbeiter_1";
var $user_02 = "bearbeiter_2";

var $comment = "Das ist nur ein Test. Bitte verwerfen.";
var $ticketName = "Probleme bei Hr. Bohne";

try {

    var browser = Application(BROWSER_NAME);
    browser.focus();
    maximize(browser, "browser_maximize");

    load();
	testCase.endOfStep("Load Consol* CM");

    /////////// User 01 /////////////////

    setUser($user_01);

    login(3);
	testCase.endOfStep("Login User 01");
    
	createTicket($ticketName);
	testCase.endOfStep("Create Ticket");

	logout();
	testCase.endOfStep("Logout User 01);

    /////////// User 02 /////////////////

    setUser($user_02);

    login(3);
	testCase.endOfStep("Login User 02");
	
	openTicket();
	testCase.endOfStep("Open Ticket");
    
	disgardTicket();
	testCase.endOfStep("Disgard Ticket");
   
    logout();
	testCase.endOfStep("Logout User 02");

    //////////////////////////////////

} catch (e) {
    testCase.handleException(e);
}
finally {
    end();
}

function createTicket($titel) {
	//"446" & "401" are just enums for the checkboxes
	_highlight(_link("Neuer Vorgang"));
	_click(_link("Neuer Vorgang"));
	_setValue(_textbox("createTicket:r:2:w:i:r:1:c:header:r:1:c:c:form:subject:subjectBorder:subjectBorder_body:subject"), $ticketName);
	_highlight(_select("createTicket:r:2:w:i:r:1:c:header:r:1:c:c:form:cf:r:1:i:t:r:0:dr:1:d:c"));
	_setSelected(_select("createTicket:r:2:w:i:r:1:c:header:r:1:c:c:form:cf:r:1:i:t:r:0:dr:1:d:c"), "446");
	_highlight(_select("createTicket:r:2:w:i:r:1:c:header:r:1:c:c:form:cf:r:1:i:t:r:1:dr:1:d:c"));

	//assign it to the user "tea bearbei" = bearbeiter_2
	_uncheck(_checkbox("checkbox"));
	_setValue(_textbox("createTicket:r:2:w:i:r:1:c:header:r:1:c:c:form:attrs:container:autoCompleteEngineer:searchField"), "Tea");
	_click(_div("name[0]", _in(_div("/.*autocomplete/"))));

	_highlight(_div("Endkunden"));
	_click(_div("Endkunden"));
	_setSelected(_select("frm_field_valid w_consumerMasterData.salutation t_enum"), "401");

	_focus(_textbox("frm_field_valid placeholder_default_watermark w_consumerMasterData.name t_string indexed"));
	//will trigger the script in CM
	//_setValue(_textbox("frm_field_valid placeholder_default_watermark w_consumerMasterData.name t_string indexed"), "B");
	env.type("B");
	//just to be shure that i worked
	if (_getValue(_textbox("frm_field_valid placeholder_default_watermark w_consumerMasterData.name t_string indexed")) != "B") {
		env.type("B");
	}
	_highlight(_link("Boris Bohne", _under(_heading4("Vorschläge"))));
	_click(_link("Boris Bohne", _under(_heading4("Vorschläge"))));
	_click(_button("Auswählen", _under(_heading4("Vorschläge"))));

	writeComment($comment);
	_click(_submit("Erzeugen"));

}

///////////User 2//////////////////////////


function openTicket() {
    _highlight(_div(0, _in(_div("/accordion_item first .*/"))));
    _highlight(_div(1, _in(_div("/accordion_item first .*/"))));
    if (!_exists(_link(0, _in(_div(1, _in(_div("/accordion_item first .*/")))))))
	{throw "No Elements in Queue";}
    //click
	var $indexOfLast = (_count("_div", "/cl_item tt_init .*/")-1);
	env.sleep(1);
	_highlight(_link(0, _in(_div("/cl_item tt_init .*/["+$indexOfLast+"]"))));
	env.sleep(1);
	_click(_link(0, _in(_div("/cl_item tt_init .*/["+$indexOfLast+"]"))));
}

function disgardTicket() {

   _highlight(_link(">>> Direkt schließen (verwerfen)..."));
   env.sleep(3);
   _click(_link(">>> Direkt schließen (verwerfen)..."));
   
   _highlight(_select("frm_field_valid w_serviceCommonACFOnly.directCloseReason t_enum"));
   env.sleep(1);
   //403 is the enum value for "Keine Aktion noetig"
	_setSelected(_select("frm_field_valid w_serviceCommonACFOnly.directCloseReason t_enum"), "403");
	 env.sleep(1);
	_click(_button("OK", _in(_div("/activity_control_form .*/"))));
}

