function setupRsvpSheet() {
  var properties = PropertiesService.getScriptProperties();
  var id = properties.getProperty("SPREADSHEET_ID");
  if (!id) throw new Error("Set SPREADSHEET_ID in Script properties first.");
  var spreadsheet = SpreadsheetApp.openById(id);
  var sheet = spreadsheet.getSheetByName("RSVPs") || spreadsheet.insertSheet("RSVPs");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Received at", "Name", "Mobile", "Guests", "Attendance", "Wishes"]);
    sheet.setFrozenRows(1);
    sheet.getRange("C:C").setNumberFormat("@");
  }
}

function doPost(event) {
  var values = event && event.parameter;
  if (!values || values["bot-field"]) {
    return responsePage("Unable to submit", "This submission could not be accepted. Please contact Pradeep on +91 96324 75628.");
  }
  var name = String(values.name || "").trim();
  var mobile = String(values.mobile || "").trim();
  var attendance = String(values.attendance || "");
  var wishes = String(values.wishes || "").trim();
  var guestText = String(values.guests || "");
  var guests = Number(guestText);
  var digits = mobile.replace(/\D/g, "");
  if (!name || name.length > 100 || !/^\+?[0-9 ()\-]{7,24}$/.test(mobile) ||
      digits.length < 7 || digits.length > 15 ||
      ["Yes", "No", "Maybe"].indexOf(attendance) === -1 ||
      !/^\d+$/.test(guestText) || !Number.isSafeInteger(guests) ||
      guests < (attendance === "No" ? 0 : 1) || wishes.length > 2000) {
    return responsePage("Please check your details", "Your RSVP has not been saved. Return to the invitation and enter a name, valid phone number, attendance choice and whole-number guest count.");
  }
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var id = PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID");
    if (!id) throw new Error("SPREADSHEET_ID is not configured.");
    var sheet = SpreadsheetApp.openById(id).getSheetByName("RSVPs");
    if (!sheet) throw new Error("Run setupRsvpSheet before accepting submissions.");
    sheet.appendRow([new Date(), safeCell(name), safeCell(mobile), guests, attendance, safeCell(wishes)]);
    SpreadsheetApp.flush();
  } catch (error) {
    console.error("RSVP storage failed: " + error.message);
    return responsePage("We couldn’t confirm your RSVP", "Please contact Pradeep on +91 96324 75628 before trying again, so we can check whether your RSVP was saved.");
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
  return responsePage("Thank you for your RSVP", "Your response has been saved. Your love and blessings mean so much as we begin this new chapter. With gratitude, Pradeep S K & Family.");
}

function safeCell(value) {
  return /^[\s]*[=+\-@]/.test(value) ? "'" + value : value;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function (character) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character];
  });
}

function responsePage(title, message) {
  var url = PropertiesService.getScriptProperties().getProperty("INVITATION_URL") || "";
  var link = /^https:\/\/[^\s]+$/i.test(url)
    ? '<a target="_top" href="' + escapeHtml(url) + '">Back to the invitation &rarr;</a>' : "";
  return HtmlService.createHtmlOutput(
    '<!doctype html><html lang="en"><head><base target="_top"><style>' +
    'body{margin:0;padding:48px 24px;background:#fcf9f2;color:#332d29;font:16px/1.8 Georgia,serif;text-align:center}' +
    'main{max-width:540px;margin:6vh auto;padding:40px 24px;border:1px solid #dfcfb4;background:#f6f0e5}' +
    'h1{font-size:38px;line-height:1.15;color:#752f38;font-weight:400}a{display:inline-block;background:#752f38;color:#fff9ef;padding:12px 22px;text-decoration:none;margin-top:20px}' +
    '</style></head><body><main><p>GRIHA PRAVESH &middot; JULY 7, 2027</p><h1>' +
    escapeHtml(title) + '</h1><p>' + escapeHtml(message) + '</p>' + link +
    '</main></body></html>'
  ).setTitle(title).addMetaTag("viewport", "width=device-width, initial-scale=1");
}
