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

//variables need to be set at runtime (LKS 2015-09-17)
setGlobals();

var env;
var screen;

var BROWSER_NAME;
var PDF_EDITOR_NAME;

function setGlobals() {
    this.env = new Environment();
    this.screen = new Region();

    this.BROWSER_NAME = "Firefox";
    this.PDF_EDITOR_NAME = "masterpdfeditor3";
}



function load() {
    var $URL = getUrlCmTestclient();
    _navigateTo($URL);
    _call(top.location.reload());
}

function login(attemt) {
    var $password = getPassword($username);
    env.sleep(2);
    _focus(_textbox("username"));
    _click(_textbox("username"));
    env.type($username);
    if (_assertEqual(_getValue(_textbox("username")), $username)) {
        _setValue(_textbox("username"), $username);
    }
    _setValue(_password("password"), $password);
    env.sleep(1);
    _click(_submit("submit button"));


    try {
        _highlight(_span("Angemeldet als:"));
        env.sleep(1);
        _highlight(_span("user"));
    } catch (e) {
        if (attemt > 0) {
            var a = attemt - 1;
            login(a);
        } else {
            end();
            testCase.handleException(e);
            return;
        }
    }
}

function logout() {
    _click(_image("logout.png"));
}

function search($string, $ticketNo, attemt) {
    try {
        _focus(_textbox("navBar:navSearch:searchField"));
        env.sleep(2);
        env.type($string);
        env.sleep(3);
        var $regex = '/' + $ticketNo + './';
        _highlight(_div({title: $regex}, (_in(_table("gs_dropdown")))));
        env.sleep(2);
        _click(_div({title: $regex}, (_in(_table("gs_dropdown")))));
        env.sleep(5);
     
    } catch (e) {
        if (attemt > 0) {
            var a = attemt - 1;
            search($string, $ticketNo, a);
        } else {
            end();
            testCase.handleException(e);
            return;
        }
    }
}

function setUser(user) {
    this.$username = user;
}

function writeComment() {
    //sadly the div to write in is not clickable by sahi, but it will focus if we activate some format options
    _doubleClick(_link("Linksbündig"));

    env.type($comment);
}

function maximize(app, image) {
    var windowLine = app.getRegion().move(0, -40).setH(40);
    var exists = windowLine.exists(image, 1);
    if (exists) {
        exists.click();
    }
}

function openPdfFile(pdfFileLocation) {
    return new Application(PDF_EDITOR_NAME + ' "' + pdfFileLocation + '"').open();
}

function killApp(applicationName) {
    new Application(applicationName).close();
}

function end() {
    try {
        logout();
        
    } catch (e) {
        //do not handle exception, this is just a teardown
        Logger.logInfo(e);
    }
    testCase.saveResult();
}
