// Updates network interfaces available in the paring wizard
function updateInterfaces () {
  $('#interfaces select').empty()
  var addr = []
  var interfaces = os.networkInterfaces()
  $('#interfaces select').append($('<option></option>').attr('value', ip.address).text('Automatic'))
  for (var i in interfaces) {
    for (var i2 in interfaces[i]) {
      var address = interfaces[i][i2]
      if (address.family === 'IPv4' && !address.internal) {
        $('#interfaces select').append($('<option></option>').attr('value', address.address).text(i))
      }
    }
  }
  setIPAddress($('#interfaces select'))
}

// Sets the ip address of the chosen network interface in the paring wizard
function setIPAddress (item) {
  var ips = $(item).val().split('.')
  $('#ip1').text(ips[0])
  $('#ip2').text(ips[1])
  $('#ip3').text(ips[2])
  $('#ip4').text(ips[3])
  $('#ip5').text(getSetting('port'))
  $('#ip').text($(item).val() + ':' + getSetting('port'))
}

// Event handler for when a different network interface is chosen
$('#interfaces select').on('change', function () {
  // Set the ip address in the paring wizard
  setIPAddress(this)
})

function showCustomModal (modal) {
  phonepresenter.closeModal('.popover-links')
  if (modal === 'update') {
    phonepresenter.modal({
      title: 'PhonePresenter Update',
      text: 'An update is available for PhonePresenter.',
      buttons: [{
        text: 'Close'
      },
      {
        text: 'Update Now',
        onClick: function () {
          shell.openExternal('https://phonepresenter.github.io/#download')
        }
      }]
    })
  }
  if (modal === 'credits') {
    phonepresenter.modal({
      title: 'PhonePresenter Credits',
      text: 'PhonePresenter '+version+'<br>&copy; 2018 James King.<br><a href="#" onclick="shell.openExternal(\'https://phonepresenter.github.io\')">phonepresenter.github.io</a><br><br><a href="#" onclick="shell.openExternal(\'https://github.com/PhonePresenter/PhonePresenter/blob/master/LICENSE\')">License Information</a>',
      buttons: [{
        text: 'Close'
      }]
    })
  }
}
