// Perform action
function action (act) {
  var platform = os.platform()
  switch (act) {
    case 'NEXT':
      keyboard.keyTap('right')
      break
    case 'PREV':
      keyboard.keyTap('left')
      break
    case 'BLANK':
      keyboard.keyTap('b')
      break
    case 'START':
      if (platform === 'darwin'){
        keyboard.keyTap('p', ['command', 'alt'])
      } else {
        keyboard.keyTap('f5')
      }
      break
    case 'END':
      keyboard.keyTap('escape')
      break
  }
}

// Start the server
function startServer () {
  // Define digest authentication settings
  var digest = auth.digest({
  		realm: 'PhonePresenter'
  	}, (username, callback) => {
  		// Expecting md5(username:realm:password) in callback.
  		if (username === getSetting('username')) {
  			callback(utils.md5(getSetting('username') + ':PhonePresenter:' + getSetting('password')))
  } else {
  			callback()
  		}
  	}
  )

  // Load server static resources
  server.use('/static/icons', express.static(__dirname + '/resources/icons'))
  server.use('/static/sound', express.static(__dirname + '/resources/sound'))
  server.use('/static/jquery', express.static(__dirname + '/node_modules/jquery/dist'))
  server.use('/static/framework7', express.static(__dirname + '/node_modules/framework7/dist'))
  server.use('/static/font-awesome', express.static(__dirname + '/resources/font-awesome'))
  server.use('/static/hammer', express.static(__dirname + '/node_modules/hammerjs'))
  server.use('/static/moment', express.static(__dirname + '/node_modules/moment/min'))

  // Hacky...define two different routes with and without authentication
  if (getSetting('authentication')) {
      server.get('/', auth.connect(digest), function (req, res) {
        res.send(PhonePresenterInterface)
      })
      server.get('/login', auth.connect(digest), function (req, res) {
        swiper.slideTo(3)
        res.redirect('/')
      })
      server.get('/config', auth.connect(digest), function (req, res) {
        res.send(JSON.stringify({screenview: getSetting('screenview'), refresh: getSetting('refresh'), stopwatch: getSetting('stopwatch'), launcher: getSetting('launcher')}))
      })
      if (getSetting('screenview')){
        server.get('/screenshot', auth.connect(digest), function (req, res) {
          desktopCapturer.getSources({ types: ['screen'], thumbnailSize: screenSize() }, function(err,sources){
            sources.forEach(function(source){
              if (source.name === 'Entire screen' || source.name === 'Screen 1'){
                res.send(source.thumbnail.toJPEG(Number(getSetting('quality'))).toString('base64'))
              }
            })
          })
        })
      }
      if (getSetting('launcher')){
        server.get('/launcher/list', auth.connect(digest), function (req, res) {
          var acceptedextensions = getSetting('launcher-extensions').split(' ')
          var openpath = path.normalize(path.join(getSetting('launcher-folder'), req.query.path))
          if (openpath.startsWith(path.normalize(getSetting('launcher-folder')))){
            try{
              if (fs.statSync(openpath).isDirectory()){
                fs.readdir(openpath, function (err, files) {
                  var filelist = []
                  files.forEach(function (file){
                    var normalizedfile = path.normalize(path.join(openpath, file))
                    if (fs.statSync(normalizedfile).isFile()){
                      if (acceptedextensions.indexOf(path.extname(normalizedfile)) >= 0) {
                        filelist.push({name: file, type: 'file'})
                      }
                    }
                    if (fs.statSync(normalizedfile).isDirectory()){
                      filelist.push({name: file, type: 'directory'})
                    }
                  })
                  res.send(filelist)
                })
              }
              else if (fs.statSync(path.normalize(openpath)).isFile()){
                if (acceptedextensions.indexOf(path.extname(path.normalize(openpath))) >= 0) {
                  shell.openItem(path.normalize(openpath))
                  res.sendStatus(200)
                }
                else{
                  res.sendStatus(403)
                }
              }
              else{
                res.sendStatus(403)
              }
            }
            catch(e){
              res.sendStatus(404)
            }
          }
          else{
            res.sendStatus(403)
          }
        })
      }
      server.post('/next', auth.connect(digest), function (req, res) {
        action('NEXT')
        res.send('NEXT')
      })
      server.post('/prev', auth.connect(digest), function (req, res) {
        action('PREV')
        res.send('PREV')
      })
      server.post('/blank', auth.connect(digest), function (req, res) {
        action('BLANK')
        res.send('BLANK')
      })
      server.post('/start', auth.connect(digest), function (req, res) {
        action('START')
        res.send('START')
      })
      server.post('/end', auth.connect(digest), function (req, res) {
        action('END')
        res.send('END')
      })
  } else {
    server.get('/', function (req, res) {
      res.send(PhonePresenterInterface)
    })
    server.get('/login', function (req, res) {
      swiper.slideTo(3)
      res.redirect('/')
    })
    server.get('/config', function (req, res) {
      res.send(JSON.stringify({screenview: getSetting('screenview'), refresh: getSetting('refresh'), stopwatch: getSetting('stopwatch'), launcher: getSetting('launcher')}))
    })
    if (getSetting('screenview')){
      server.get('/screenshot', function (req, res) {
        desktopCapturer.getSources({ types: ['screen'], thumbnailSize: screenSize() }, function(err,sources){
          sources.forEach(function(source){
            if (source.name === 'Entire screen' || source.name === 'Screen 1'){
              res.send(source.thumbnail.toJPEG(Number(getSetting('quality'))).toString('base64'))
            }
          })
        })
      })
    }
    if (getSetting('launcher')){
      server.get('/launcher/list', function (req, res) {
        var acceptedextensions = getSetting('launcher-extensions').split(' ')
        var openpath = path.normalize(path.join(getSetting('launcher-folder'), req.query.path))
        if (openpath.startsWith(path.normalize(getSetting('launcher-folder')))){
          try{
            if (fs.statSync(openpath).isDirectory()){
              fs.readdir(openpath, function (err, files) {
                var filelist = []
                files.forEach(function (file){
                  var normalizedfile = path.normalize(path.join(openpath, file))
                  if (fs.statSync(normalizedfile).isFile()){
                    if (acceptedextensions.indexOf(path.extname(normalizedfile)) >= 0) {
                      filelist.push({name: file, type: 'file'})
                    }
                  }
                  if (fs.statSync(normalizedfile).isDirectory()){
                    filelist.push({name: file, type: 'directory'})
                  }
                })
                res.send(filelist)
              })
            }
            else if (fs.statSync(path.normalize(openpath)).isFile()){
              if (acceptedextensions.indexOf(path.extname(path.normalize(openpath))) >= 0) {
                shell.openItem(path.normalize(openpath))
                res.sendStatus(200)
              }
              else{
                res.sendStatus(403)
              }
            }
            else{
              res.sendStatus(403)
            }
          }
          catch(e){
            res.sendStatus(404)
          }
        }
        else{
          res.sendStatus(403)
        }
      })
    }
    server.post('/next', function (req, res) {
      action('NEXT')
      res.send('NEXT')
    })
    server.post('/prev', function (req, res) {
      action('PREV')
      res.send('PREV')
    })
    server.post('/blank', function (req, res) {
      action('BLANK')
      res.send('BLANK')
    })
    server.post('/start', function (req, res) {
      action('START')
      res.send('START')
    })
    server.post('/end', function (req, res) {
      action('END')
      res.send('END')
    })
  }

  // This route doesn't need authentication, so it's defined down here
  server.get('/ishere', cors(), function (req, res) {
    res.send('PhonePresenter is here')
  })

  // Start the server
  try {
    server.listen(parseInt(getSetting('port')), getSetting('socket')).on('error', function (e) {
      $('.swiper-container').hide()
      $('.errorpage').show()
      $('#error-text').text(e)
    })
  } catch (e) {
    $('.swiper-container').hide()
    $('.errorpage').show()
    $('#error-text').text(e)
  }
}
