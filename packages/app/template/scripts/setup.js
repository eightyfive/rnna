#!/usr/bin/env node

const postLinkAndroid = require('react-native-navigation/autolink/postlink/postLinkAndroid');
const postLinkIOS = require('react-native-navigation/autolink/postlink/postLinkIOS');

postLinkAndroid();
postLinkIOS();
