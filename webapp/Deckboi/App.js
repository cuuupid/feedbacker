import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Camera from 'react-native-camera';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { looks: "Calibrating..." }    
  }
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
          style={styles.preview}
          captureTarget={Camera.constants.CaptureTarget.memory}
          aspect={Camera.constants.Aspect.fill}>
          <Text style={styles.capture} onPress={() => this.notTakePicture()}>fam :3 we got dis</Text>
          <Text style={styles.capture}>{this.state.looks}</Text>
        </Camera>
      </View>
    );
  }
  notTakePicture() {
    console.log("Attempting to take picture")
    this.camera.capture({metadata: {}})
      .then((data) => {
        console.log(data)
        fetch('http://192.81.214.158:1337/emotion', {
          method: 'POST',
          body: JSON.stringify({data: data.data, whoami: 'iameveryone'}),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }).then((s) => s.json()).then((d) => {
          console.log(d)
          let num = d.size
          delete d.size
          if (num > 0) {
            if (d.top2.length > 1)
              this.state.looks = num + " ppl, " + d.top2[0] + " & " + d.top2[1]
            else
              this.state.looks = num + " ppl, " + d.top2[0]
          }
          else {
            this.state.looks = "Don't see anyone :/"
          }
          this.setState({looks: this.state.looks})
        })
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
