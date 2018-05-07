// Logic to validate settings fields
function validateField (field) {
  if ($(field).attr('required') && !$(field).val() || $(field).attr('required') && parseInt($(field).attr('max')) < parseInt($(field).val()) || $(field).attr('required') && parseInt($(field).attr('min')) > $(field).val()) {
    // Add invalid class to invalid fields
    $(field).parent().addClass('invalid')
  } else {
    $(field).parent().removeClass('invalid')
  }
}

function toggleField (field) {
  if ($(field).find('input').attr('required')) {
    $(field).slideToggle().find('input').removeAttr('required')
  } else {
    $(field).slideToggle().find('input').attr('required', true)
  }
}

// Validate fields on input
$('#settingsForm input:not([type=checkbox])').on('input', function () {
  validateField(this)
})

// Save the settings
function saveSettings (restart) {
  // If this should actually save
  var cont = true
  // Validate each setting field
  $('#settingsForm input:not([type=checkbox])').each(function (k, input) {
    validateField(input)
    if ($(input).parent().hasClass('invalid')) {
      // Switch to tab containing invalid field
      phonepresenter.showTab($(input).closest('.tab'))
      cont = false
      return false
    }
  })
  if (cont) {
    // Save the settings to JSON string
    var settingsJSON = {}
    $('#settingsForm input:not([type=checkbox])').each(function (k, input) {
      settingsJSON[$(input).attr('id')] = $(input).val()
    })
    $('#settingsForm input[type=checkbox]').each(function (k, input) {
      settingsJSON[$(input).attr('id')] = $(input).prop('checked')
    })
    // Save JSON string to localstorage
    localStorage.setItem('settings', JSON.stringify(settingsJSON))
    // Restart, if needed
    if (restart) {
      phonepresenter.showPreloader('Saving...')
      app.relaunch()
      setTimeout(function () {
        app.quit()
      }, 1000)
    }
  }
}

// Get a setting from localstorage
function getSetting (setting) {
  return JSON.parse(localStorage.getItem('settings'))[setting]
}

// Load settings
function loadSettings () {
  // Using try/catch for corruption or first run when settings are nonexistent
  try {
    if (getSetting('authentication') === true) {
      $('#authentication').prop('checked', true)
      $('#username').val(getSetting('username'))
      $('#password').val(getSetting('password'))
      $('.auth-field').show().find('input').attr('required', true)
    } else {
      $('#authentication').prop('checked', false)
      $('#username').val('')
      $('#password').val('')
      $('.auth-field').hide().find('input').removeAttr('required')
    }
    if (getSetting('customsocket') === true) {
      $('#customsocket').prop('checked', true)
      $('#socket').val(getSetting('socket'))
      $('.socket-field').show().find('input').attr('required', true)
    } else {
      $('#customsocket').prop('checked', false)
      $('#socket').val('0.0.0.0')
      $('.socket-field').hide().find('input').removeAttr('required')
    }
    if (getSetting('customport') === true) {
      $('#customport').prop('checked', true)
      $('#port').val(getSetting('port'))
      $('.port-field').show().find('input').attr('required', true)
    } else {
      $('#customport').prop('checked', false)
      $('#port').val(1028)
      $('.port-field').hide().find('input').removeAttr('required')
    }
    if (getSetting('updates') === true) {
      $('#updates').prop('checked', true)
    } else {
      $('#updates').prop('checked', false)
    }
    if (getSetting('screenview') === true) {
      $('#screenview').prop('checked', true)
      $('#refresh').val(getSetting('refresh'))
      $('#quality').val(getSetting('quality'))
      $('.screenview-field').show().find('input').attr('required', true)
    } else {
      $('#screenview').prop('checked', false)
    }
    if (getSetting('stopwatch') === true) {
      $('#stopwatch').prop('checked', true)
    } else {
      $('#stopwatch').prop('checked', false)
    }
    if (getSetting('launcher') === true) {
      $('#launcher').prop('checked', true)
      $('#launcher-folder').val(getSetting('launcher-folder'))
      $('#launcher-extensions').val(getSetting('launcher-extensions'))
      $('.launcher-field').show().find('input').attr('required', true)
    } else {
      $('#launcher').prop('checked', false)
    }
    //if (getSetting('shared') === true) {
      //$('#shared').prop('checked', true)
    //} else {
      //$('#shared').prop('checked', false)
    //}
    saveSettings(false)
  } catch (e) {
    $('#authentication').prop('checked', false)
    $('#username').val('')
    $('#password').val('')
    $('#customsocket').prop('checked', false)
    $('#socket').val('0.0.0.0')
    $('#customport').prop('checked', false)
    $('#port').val(1028)
    $('#launcher').prop('checked', false)
    $('#launcher-folder').val('')
    $('#launcher-extensions').val('')
    $('#updates').prop('checked', true)
    //$('#shared').prop('checked', false)
    saveSettings(false)
  }

  // Remove the invalid class for cancelled changes
  $('#settingsForm input:not([type=checkbox])').parent().removeClass('invalid')
}
