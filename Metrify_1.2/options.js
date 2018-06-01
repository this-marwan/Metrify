// Saves options to chrome.storage
function save_options() {
  var color = document.getElementById("color").value;
  var light = document.getElementById("isLight").checked;
  chrome.storage.sync.set({
    'isLight' : light,
    'highlightColor': color,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';

  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    'isLight': true,
    'highlightColor': "yellow",
  }, function(items) {
    document.getElementById('color').value = items.highlightColor;
    document.getElementById('isLight').checked = items.isLight;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
