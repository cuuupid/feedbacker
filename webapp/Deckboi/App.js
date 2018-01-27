import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Camera from 'react-native-camera';

export default class App extends React.Component {
  componentDidMount() {
    // hacking thru cDM because i can't be bothered to polyfill :0 soz
    this.timer = setInterval(() => this.notTakePicture(), 10 * 1000);
  }
  render() {
    return (
      <View style={styles.container}> 
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
      	  onBarCodeRead={this.onBarCodeRead.bind(this)}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={styles.capture}>fam :3 we got dis</Text>
        </Camera>
      </View>
    );
  }
  notTakePicture() {
    this.camera.capture({metadata: {}})
      .then((data) => {
        // data is base64 so we don't convert jack shit
      })
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});
