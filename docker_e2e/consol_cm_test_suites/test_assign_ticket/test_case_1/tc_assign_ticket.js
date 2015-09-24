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

var $comment = "KOMMENTAR!!";
var $ticketName = "Probleme bei Hr. Bohne";

try {

    var browser = Application(BROWSER_NAME); //wenn browser bereits gestartet ist
    browser.focus();
    maximize(browser, "browser_maximize");

    load();

    /////////// User 01 /////////////////

    setUser($user_01);

    login(3);
    createNew($ticketName);

    // jetzt soll in das kommentarfeld geschribeen werden
    // GENAU WIE BEIM ANDEREN... aber er nimmts nicht an... ?!?!?!

    env.sleep(999);

    logout();

    /////////// User 02 /////////////////

    setUser($user_02);

    login(3);
    openTicket();
    checkTicket();
    increasePriority();
    setCompensation();
    env.sleep(2);

    logout();

    //////////////////////////////////


} catch (e) {
    testCase.handleException(e);
}
finally {
    end();
}

function createNew($titel) {
    //"446" & "401" are just enums for the checkboxes
    _highlight(_link("Neuer Vorgang"));
    _click(_link("Neuer Vorgang"));
    // TODO no other selectors?
    _setValue(_textbox("createTicket:r:2:w:i:r:1:c:header:r:1:c:c:form:subject:subjectBorder:subjectBorder_body:subject"), $ticketName);
    _highlight(_select("createTicket:r:2:w:i:r:1:c:header:r:1:c:c:form:cf:r:1:i:t:r:0:dr:1:d:c"));
    _setSelected(_select("createTicket:r:2:w:i:r:1:c:header:r:1:c:c:form:cf:r:1:i:t:r:0:dr:1:d:c"), "446");
    _highlight(_select("createTicket:r:2:w:i:r:1:c:header:r:1:c:c:form:cf:r:1:i:t:r:1:dr:1:d:c"));

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

function checkComment() {
    _highlight(_div("submain historygroup"));
    env.sleep(1);
    $testString = _getText(_div("/richContent_.*/", _div("submain historygroup")));
    _highlight(_div("/richContent_.*/", _div("submain historygroup")));

    var isIdentical = false;
    if ($testString == $comment) {
        isIdentical = true;

    } else {
        Logger.logError("The Comment Function did not perform correctly.");
    }
}

///////////User 2//////////////////////////


function openTicket() {
    _highlight(_div(0, _in(_div("/accordion_item first .*/"))));
    _highlight(_div(1, _in(_div("/accordion_item first .*/"))));
    _click(_link(0, _in(_div(1, _in(_div("/accordion_item first .*/"))))));
    //click
}

function checkTicket() {

    _highlight(_image("Gelb - mindestens eine offene Beschwerde oder Reklamation"));

}

function increasePriority() {
    _highlight(_link("Priorität erhöhen"));
    _click(_link("Priorität erhöhen"));
    _click(_link("Priorität erhöhen"));
}

function setCompensation() {
    _highlight(_link(">>> Kompensation..."));
    _click(_link(">>> Kompensation..."));

    // TODO no other selectors?
    _setSelected(_select("customFields:0:first:value:cf:c"), "494");
    _setValue(_textarea("customFields:0:second:value:cf:c"), "Wichtigster Kunde!");
    _click(_button("buttonsPanel:buttonsList:0:button"));

    //_highlight(_link(">>> Abschließen..."));
    //_click(_link(">>> Abschließen..."));
}
