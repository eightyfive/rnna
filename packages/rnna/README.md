# RNNA (React NAtive Navigation Application)

## Installation

```bash
# Init RN project
$ npx react-native init MyApp

$ cd MyApp
$ git init
$ git add -A .
$ git commit -m "Init react-native project"

# Install RN navigation
$ yarn add react-native-navigation
$ npx rnn-link

$ git commit -am "Install & link react-native-navigation"

# Download app structure (optional)
$ npx yown c1e159a3566165fadc7032b746ea7e16

## Install dependencies shown in `yown` command output
$ yarn add rnna @react-native-community/async-storage react-native-flipper
$ yarn add --dev redux-flipper rn-async-storage-flipper

$ git add app
$ git commit -m 'Download app structure'

# Download app starter (optional)
$ npx yown c1e159a3566165fadc7032b746ea7e16

$ git add -A .
$ git commit -m 'Download app starter'

# Install Pods
$ npx pod-install

$ git commit -am 'Install Pods'

# Run the app !
$ yarn run ios
```
