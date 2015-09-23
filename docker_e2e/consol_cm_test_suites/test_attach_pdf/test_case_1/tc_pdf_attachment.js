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
//include functions and variables common to the website
_dynamicInclude("../../common/showroom_common.js");
_dynamicInclude("../../common/login_credentials.js");


var testCase = new TestCase(60, 70);

//the filname of the pdf to upload
var pdfFileName = "ConSol_Solutions.pdf";
//the username to login to the Consol CM Instance (the passwords for this testcase are always the same)
var $username = "sakuli";

//the path of the pdf to upload. the same path is used to safe the downloaded pdf file
var $pdfPath = testCase.getTestCaseFolderPath() + "/pdf/";
//the variable to safe the attachments name in
var $attachmentName = "";


//////////////////////////////////////////////////////////////////

//a descrition to be added during the pdf upload 
var $pdfDescription = "Consol Solutions";

//the comment and the name of the person commenting
var $Kommentator = "Max Sakuli";
var $Kommentar = "End2End";

////////////////////////////////////////////////////////////////

try {

    //get the browser and maximize it
    var browser = new Application(BROWSER_NAME).focus();
    maximize(browser, "browser_maximize");

    //open the pdf and write the annotation
    navigatePDF();
    env.sleep(3);
    //load the page and login
    load();
    login(3);

    //go directly to the preprepared ticket
    var $URL = getUrlCmTestclient() + "ticket/ticket_id/532";
    _navigateTo($URL);

    //upload the new attachment to the ticket
    uploadAttachment();

    //download the pdf and check its correctness
    checkPdf();

} catch (e) {
    testCase.handleException(e);
}
finally {
    end();
}

function setAttachmentName() {

    $attachmentName = $Kommentator + "_" + pdfFileName;
}

function checkPdf() {

    //click the link for attachments
    _click(_image("/arrow.gif/", _in(_div("acim_history_container", _in(_div("submain historygroup"))))));
    env.sleep(1);
    //if the next link doesn't show, we click again
    if (!_exists(_link(0, _in(_div("menu", _in(_div("acim_history_container", _in(_div("submain historygroup"))))))))) {
        _click(_image("/arrow.gif/", _in(_div("acim_history_container", _in(_div("submain historygroup"))))));
        env.sleep(1);
    }

    _highlight(_link(0, _in(_div("menu", _in(_div("acim_history_container", _in(_div("submain historygroup"))))))));
    _click(_link(0, _in(_div("menu", _in(_div("acim_history_container", _in(_div("submain historygroup"))))))));
    //sakuli *for now* cant open the pdf directly, so it is downloaded and sent to the pdf viewer
    var $pdfFileDownloadLocation = $pdfPath + "_download_" + pdfFileName;
    _saveDownloadedAs($pdfFileDownloadLocation);

    openPdfFile($pdfFileDownloadLocation);

    //open note
    screen.waitForImage("pdf2_note", 5).doubleClick();
    screen.waitForImage("pdf2_in_note", 5).doubleClick();
    //Copy string
    env.type("a", Key.CTRL);
    env.copyIntoClipboard();
    var copy = env.getClipboard();
    env.paste(copy);
    //test string and print success
    if ($Kommentar + " - " + $Kommentator) {
        env.type(". . .");
        env.paste(Key.ENTER);
        env.paste(Key.ENTER);
        env.paste("!! Success !!");
        testCase.endOfStep("Downloaded PDF: Check Annotation");
    }
    else {
        throw ("Downloaded PDF: Annotation-String does not Match.");
    }

    env.sleep(9);
    killApp(PDF_EDITOR_NAME);
}

function navigatePDF() {

    setAttachmentName();
    //load pdf and focus application
    var pdfFileLocation = $pdfPath + pdfFileName;
    var pdfViewer = openPdfFile(pdfFileLocation);

    writeAnnotation(pdfViewer);

    safePdf();

    killApp(PDF_EDITOR_NAME);

    testCase.endOfStep("Create/Navigate Pdf");
}

function safePdf() {

    //create the name
    setAttachmentName();
    //navigate through the menu
    screen.waitForImage("pdf_file", 3).click();
    screen.waitForImage("pdf_save_as", 3).click();

    screen.waitForImage("pdf_path", 10).click();

    env.sleep(2);
    //set path and name
    env.paste($pdfPath);
    env.sleep(1);
    env.paste($attachmentName);
    env.sleep(1);
    //press safe
    screen.waitForImage("pdf_safe_button", 2).click();

    //replace file if it already exists
    var exists = screen.exists("replace", 1);
    if (exists) {
        exists.click();
    }
}

function writeAnnotation(pdfViewer) {

    //click the annotations button from the toolbar, if visible
    var exists = screen.exists("pdf_add_annotation", 5);
    if (exists) {
        exists.click();
    } else {
        //otherise maximize the program and try again
        maximize(pdfViewer, "pdf_maximize");
        screen.waitForImage("pdf_add_annotation", 5).click();
    }
    //
    screen.waitForImage("pdf_sakuli", 2).click();
    screen.waitForImage("pdf2_in_note", 2).click();
    env.paste($Kommentar);
    env.type(" - " + $Kommentator);
}

function uploadAttachment() {

    setAttachmentName();
    _click(_link("Attachment"));
    env.sleep(1);
    _focus(_textbox(0, _rightOf(_cell("Beschreibung"))));
    env.type($pdfDescription);
    env.sleep(1);
    _click(_file("upload"));

    clickLocationButton();
    env.sleep(1);
    env.paste($pdfPath + $attachmentName);

    env.type(Key.ENTER);
    env.sleep(1);
    _click(_button("Hinzufügen"));

    testCase.endOfStep("Upload PDF Attachment");
}

function clickLocationButton() {

    //the button can appear in 3 differet states. clicked focesed and ready..
    var button_state_1 = screen.exists("upload_location_1", 1);
    if (button_state_1) {
        button_state_1.click();
        return;
    }

    var button_state_2 = screen.exists("upload_location_2", 1);
    if (button_state_2) {
        button_state_2.click();
        var button_state_3 = screen.exists("upload_location_3", 1);
        //this time we dont test, to raise an error
        button_state_3.click();
        return;
    }

    var button_state_3 = screen.exists("upload_location_3", 1);
    if (button_state_3) {
        button_state_3.click();
        return;
    }
}