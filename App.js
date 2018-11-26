/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react"
import { Platform, StyleSheet, Button, View, Alert, Text } from "react-native"
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  LoginButton
} from "react-native-fbsdk"
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes
} from "react-native-google-signin"

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
})

type Props = {}
export default class App extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      googleLoginInProgress: false
    }
  }
  /*loginWithFacebook() {
    LoginManager.logInWithReadPermissions(["public_profile", "email"])
      .then(result => {
        if (result.isCancelled) {
          return Promise.reject(new Error("The user cancelled the request"))
        }

        return AccessToken.getCurrentAccessToken()
      })
      .then(user => {
        console.log(user.accessToken)
        let req = new GraphRequest(
          "/me",
          {
            httpMethod: "GET",
            version: "v2.5",
            parameters: {
              fields: {
                string: "email,name,friends"
              }
            }
          },
          (err, res) => {
            console.log(err, res)
          }
        )
        new GraphRequestManager().addRequest(req).start()
      })
      .catch(error => {
        console.error(error)
      })
  }*/

  loginFinished(error, result) {
    if (error) {
      console.error(error)
      return
    }

    if (result.isCancelled) {
      Alert.alert("Login cancelado!")
      return
    }

    AccessToken.getCurrentAccessToken().then(data => {
      //console.log(data)
      let req = new GraphRequest(
        "/me?fields=name,email",
        {
          httpMethod: "GET",
          version: "v3.2",
          parameters: {
            fields: {
              string: "email,name,friends"
            }
          }
        },
        (err, res) => {
          if (err) {
            console.error(err)
            return
          }
          console.log(res)
          Alert.alert("Logado " + res.email)
          return
        }
      )

      new GraphRequestManager().addRequest(req).start()
    })
  }

  logoutFinished() {
    Alert.alert("Alou")
  }

  async googleLogin() {
    try {
      GoogleSignin.configure({
        webClientId:
          "772846079313-3lu83kff9p2r34dsm68bcmolmcu38qhu.apps.googleusercontent.com"
      })
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      Alert.alert("Logado " + userInfo.user.email)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Login cancelado!")
      } else if (error.code === statusCodes.IN_PROGRESS) {
        this.setState({
          googleLoginInProgress: true
        })
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert("Play service nao disponivel!")
      } else {
        Alert.alert("Um erro muito doido!")
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LoginButton
          readPermissions={["public_profile", "email"]}
          onLoginFinished={this.loginFinished}
          onLogoutFinished={this.logoutFinished}
        />
        <GoogleSigninButton
          style={{ width: 200, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.googleLogin}
          disabled={this.state.googleLoginInProgress}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
})
