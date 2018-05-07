// Check for updates and show a random modal
function checkForUpdates() {
  if (getSetting('updates') === true) {
    try {
      $.ajax({
        url: 'https://phonepresenter.github.io/version.json',
        success: function(data) {
          if (data.version !== version.toString()) {
            showCustomModal('update')
          }
        }
      })
    } catch (e) {}
  }
}
