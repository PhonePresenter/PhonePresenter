# PhonePresenter
Control presentations from your smartphone

## Build From Source

### Clone and Install Dependencies
```
git clone https://github.com/PhonePresenter/PhonePresenter.git
cd PhonePresenter
npm install
```

### Run
```
npm start
```

### Create Installer
Requires that [electron-builder](https://github.com/electron-userland/electron-builder) be installed.
```
npm run dist
```

## Contribute
There's a lot of work that PhonePresenter needs to be a really modern app.  In no particular order:

- Update to Electron 2.0.0
- Rewrite to use websockets instead of http requests
- Switch to RobotJS so we're not shelling out to AutoHotKey/xdotool/osascript (should be easy)
- Investigate how to make the screenshot capture faster
- Better structure the code and make it less messy!
- Improve the interface (though it's not too bad right now)

I don't have a whole lot of time to maintain PhonePresenter any more, so I heartily welcome PRs to fix above issues.
